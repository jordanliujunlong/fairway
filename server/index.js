require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// Webhook は raw body 必須なので先に定義
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleWebhook);
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ── 静的ファイル配信（frontendフォルダ）──
app.use(express.static(path.join(__dirname, 'public')));

const JWT_SECRET = process.env.JWT_SECRET || 'fairway-dev-secret-change-in-prod';
function signToken(userId) { return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' }); }
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: '認証が必要です' });
  try { req.userId = jwt.verify(h.slice(7), JWT_SECRET).userId; next(); }
  catch { res.status(401).json({ error: 'トークンが無効です' }); }
}

// ── DB INIT ──
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT, kana TEXT, phone TEXT,
      zip TEXT, pref TEXT, city TEXT, addr TEXT,
      stripe_customer_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS carts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL,
      qty INTEGER NOT NULL DEFAULT 1,
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      order_number TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending_payment',
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      payment_intent_id TEXT,
      total INTEGER NOT NULL,
      shipping_address TEXT,
      payment_method TEXT,
      items JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      title TEXT,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      label TEXT NOT NULL DEFAULT '自宅',
      name TEXT NOT NULL,
      kana TEXT,
      phone TEXT,
      zip TEXT NOT NULL,
      pref TEXT NOT NULL,
      city TEXT NOT NULL,
      addr TEXT NOT NULL,
      is_default BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('✅ DB initialized');
}

// ════════════════════════════════════════
// AUTH
// ════════════════════════════════════════
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: '全項目を入力してください' });
  if (password.length < 6) return res.status(400).json({ error: 'パスワードは6文字以上で入力してください' });
  try {
    const hash = await bcrypt.hash(password, 10);
    // Stripe Customer作成（Stripeキーが設定されている場合のみ）
    let stripeCustomerId = null;
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      try {
        const customer = await stripe.customers.create({ email: email.toLowerCase(), name, metadata: { source: 'fairway' } });
        stripeCustomerId = customer.id;
      } catch (stripeErr) {
        console.warn('Stripe Customer作成をスキップ:', stripeErr.message);
      }
    }
    const r = await pool.query(
      'INSERT INTO users (email,password_hash,name,stripe_customer_id) VALUES ($1,$2,$3,$4) RETURNING id,email,name,created_at',
      [email.toLowerCase(), hash, name, stripeCustomerId]
    );
    res.json({ token: signToken(r.rows[0].id), user: r.rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'このメールアドレスは既に登録されています' });
    console.error(e); res.status(500).json({ error: 'サーバーエラー' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: '全項目を入力してください' });
  try {
    const r = await pool.query('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
    const user = r.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが違います' });
    const { password_hash, ...safe } = user;
    res.json({ token: signToken(user.id), user: safe });
  } catch { res.status(500).json({ error: 'サーバーエラー' }); }
});

// ════════════════════════════════════════
// PROFILE
// ════════════════════════════════════════
app.get('/api/profile', auth, async (req, res) => {
  const r = await pool.query(
    'SELECT id,email,name,kana,phone,zip,pref,city,addr,created_at FROM users WHERE id=$1', [req.userId]
  );
  res.json(r.rows[0]);
});

app.patch('/api/profile', auth, async (req, res) => {
  const { name, kana, phone, zip, pref, city, addr } = req.body;
  const r = await pool.query(
    'UPDATE users SET name=$1,kana=$2,phone=$3,zip=$4,pref=$5,city=$6,addr=$7 WHERE id=$8 RETURNING id,email,name,kana,phone,zip,pref,city,addr,created_at',
    [name, kana, phone, zip, pref, city, addr, req.userId]
  );
  res.json(r.rows[0]);
});

// ════════════════════════════════════════
// CART
// ════════════════════════════════════════
app.get('/api/cart', auth, async (req, res) => {
  const r = await pool.query('SELECT product_id,qty FROM carts WHERE user_id=$1', [req.userId]);
  res.json(r.rows);
});

app.put('/api/cart', auth, async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: '不正なデータ' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM carts WHERE user_id=$1', [req.userId]);
    for (const item of items)
      if (item.qty > 0)
        await client.query('INSERT INTO carts (user_id,product_id,qty) VALUES ($1,$2,$3)', [req.userId, item.product_id, item.qty]);
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch { await client.query('ROLLBACK'); res.status(500).json({ error: 'サーバーエラー' }); }
  finally { client.release(); }
});

// ════════════════════════════════════════
// ORDERS
// ════════════════════════════════════════
app.get('/api/orders', auth, async (req, res) => {
  const r = await pool.query('SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC', [req.userId]);
  res.json(r.rows);
});

// Stripe不要の通常注文（ローカル開発・後払い・銀行振込用）
app.post('/api/orders', auth, async (req, res) => {
  const { items, total, shippingAddress, paymentMethod } = req.body;
  if (!items || !total) return res.status(400).json({ error: '注文データが不正です' });
  const orderNumber = `FW-${Date.now().toString().slice(-8)}`;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const r = await client.query(
      `INSERT INTO orders (user_id, order_number, status, payment_status, payment_intent_id, total, shipping_address, payment_method, items)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.userId, orderNumber, 'processing', 'paid', null, total, shippingAddress, paymentMethod, JSON.stringify(items)]
    );
    await client.query('DELETE FROM carts WHERE user_id=$1', [req.userId]);
    await client.query('COMMIT');
    res.json(r.rows[0]);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ error: 'サーバーエラー: ' + e.message });
  } finally {
    client.release();
  }
});

// ════════════════════════════════════════
// WISHLIST
// ════════════════════════════════════════
app.get('/api/wishlist', auth, async (req, res) => {
  const r = await pool.query('SELECT product_id,created_at FROM wishlists WHERE user_id=$1 ORDER BY created_at DESC', [req.userId]);
  res.json(r.rows);
});

app.post('/api/wishlist/:productId', auth, async (req, res) => {
  const productId = parseInt(req.params.productId);
  if (!productId) return res.status(400).json({ error: '不正なproductId' });
  try {
    await pool.query('INSERT INTO wishlists (user_id,product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.userId, productId]);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: 'サーバーエラー' }); }
});

app.delete('/api/wishlist/:productId', auth, async (req, res) => {
  await pool.query('DELETE FROM wishlists WHERE user_id=$1 AND product_id=$2', [req.userId, parseInt(req.params.productId)]);
  res.json({ ok: true });
});

// ════════════════════════════════════════
// REVIEWS
// ════════════════════════════════════════
app.get('/api/reviews', auth, async (req, res) => {
  const r = await pool.query('SELECT * FROM reviews WHERE user_id=$1 ORDER BY created_at DESC', [req.userId]);
  res.json(r.rows);
});

app.get('/api/reviews/product/:productId', async (req, res) => {
  // 認証不要 — 商品ページ用
  const r = await pool.query(
    `SELECT r.id, r.rating, r.title, r.body, r.created_at, u.name AS user_name
     FROM reviews r JOIN users u ON r.user_id=u.id
     WHERE r.product_id=$1 ORDER BY r.created_at DESC`,
    [parseInt(req.params.productId)]
  );
  res.json(r.rows);
});

app.post('/api/reviews', auth, async (req, res) => {
  const { product_id, rating, title, body } = req.body;
  if (!product_id || !rating || !body) return res.status(400).json({ error: '必須項目を入力してください' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: '評価は1〜5で入力してください' });
  try {
    const r = await pool.query(
      `INSERT INTO reviews (user_id,product_id,rating,title,body)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (user_id,product_id)
       DO UPDATE SET rating=$3,title=$4,body=$5,created_at=NOW()
       RETURNING *`,
      [req.userId, product_id, rating, title || null, body]
    );
    res.json(r.rows[0]);
  } catch { res.status(500).json({ error: 'サーバーエラー' }); }
});

app.delete('/api/reviews/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM reviews WHERE id=$1 AND user_id=$2', [parseInt(req.params.id), req.userId]);
  res.json({ ok: true });
});

// ════════════════════════════════════════
// ADDRESSES
// ════════════════════════════════════════
app.get('/api/addresses', auth, async (req, res) => {
  const r = await pool.query('SELECT * FROM addresses WHERE user_id=$1 ORDER BY is_default DESC,created_at ASC', [req.userId]);
  res.json(r.rows);
});

app.post('/api/addresses', auth, async (req, res) => {
  const { label, name, kana, phone, zip, pref, city, addr, is_default } = req.body;
  if (!name || !zip || !pref || !city || !addr) return res.status(400).json({ error: '必須項目を入力してください' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (is_default) await client.query('UPDATE addresses SET is_default=false WHERE user_id=$1', [req.userId]);
    const r = await client.query(
      'INSERT INTO addresses (user_id,label,name,kana,phone,zip,pref,city,addr,is_default) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *',
      [req.userId, label || '自宅', name, kana || null, phone || null, zip, pref, city, addr, !!is_default]
    );
    await client.query('COMMIT');
    res.json(r.rows[0]);
  } catch { await client.query('ROLLBACK'); res.status(500).json({ error: 'サーバーエラー' }); }
  finally { client.release(); }
});

app.patch('/api/addresses/:id', auth, async (req, res) => {
  const { label, name, kana, phone, zip, pref, city, addr, is_default } = req.body;
  const id = parseInt(req.params.id);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (is_default) await client.query('UPDATE addresses SET is_default=false WHERE user_id=$1', [req.userId]);
    const r = await client.query(
      'UPDATE addresses SET label=$1,name=$2,kana=$3,phone=$4,zip=$5,pref=$6,city=$7,addr=$8,is_default=$9 WHERE id=$10 AND user_id=$11 RETURNING *',
      [label, name, kana, phone, zip, pref, city, addr, !!is_default, id, req.userId]
    );
    await client.query('COMMIT');
    res.json(r.rows[0]);
  } catch { await client.query('ROLLBACK'); res.status(500).json({ error: 'サーバーエラー' }); }
  finally { client.release(); }
});

app.delete('/api/addresses/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM addresses WHERE id=$1 AND user_id=$2', [parseInt(req.params.id), req.userId]);
  res.json({ ok: true });
});

app.patch('/api/addresses/:id/set-default', auth, async (req, res) => {
  const id = parseInt(req.params.id);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE addresses SET is_default=false WHERE user_id=$1', [req.userId]);
    await client.query('UPDATE addresses SET is_default=true WHERE id=$1 AND user_id=$2', [id, req.userId]);
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch { await client.query('ROLLBACK'); res.status(500).json({ error: 'サーバーエラー' }); }
  finally { client.release(); }
});

// ════════════════════════════════════════
// STRIPE PAYMENTS
// ════════════════════════════════════════
app.post('/api/payments/create-intent', auth, async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!items?.length) return res.status(400).json({ error: 'カートが空です' });
const PRICES = { 1:88000,2:132000,3:7800,4:14800,5:52000,6:3800,7:42000,8:8200,9:12800,10:68000,11:76000,12:38000,13:18500,20:14800,21:32800,22:32800,23:6800,24:6800,25:28600,26:22800,27:22800,28:168000,29:7800,30:12800,31:8900,32:9800,33:8500,34:4800,35:6200,36:198000,37:78000,38:158000,39:128000,40:8470,41:88000,42:50,43:68000,44:68000 };
  const subtotal = items.reduce((s, i) => s + (PRICES[i.product_id] || 0) * i.qty, 0);
  if (subtotal <= 0) return res.status(400).json({ error: '金額の計算に失敗しました' });
  const shipping = subtotal >= 10000 ? 0 : 880;
  const total = subtotal + shipping;
  try {
    const userRes = await pool.query('SELECT stripe_customer_id FROM users WHERE id=$1', [req.userId]);
    const customerId = userRes.rows[0]?.stripe_customer_id;
    const intent = await stripe.paymentIntents.create({
      amount: total, currency: 'jpy',
      customer: customerId || undefined,
      payment_method_types: ['card'],
      metadata: { user_id: String(req.userId), shipping_address: shippingAddress || '' },
      description: `FAIRWAY注文 - ユーザー${req.userId}`,
    });
    const orderNumber = `FW-${Date.now().toString().slice(-8)}`;
    await pool.query(
      'INSERT INTO orders (user_id,order_number,status,payment_status,payment_intent_id,total,shipping_address,payment_method,items) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [req.userId, orderNumber, 'pending_payment', 'unpaid', intent.id, total, shippingAddress || '', 'card', JSON.stringify(items)]
    );
    res.json({ clientSecret: intent.client_secret, orderNumber, total, shipping });
  } catch (e) {
    console.error('Stripe error:', e);
    res.status(500).json({ error: '決済の初期化に失敗しました: ' + e.message });
  }
});

app.post('/api/payments/confirm', auth, async (req, res) => {
  const { paymentIntentId } = req.body;
  if (!paymentIntentId) return res.status(400).json({ error: 'paymentIntentIdが必要です' });
  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== 'succeeded')
      return res.status(400).json({ error: `決済が完了していません（status: ${intent.status}）` });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const r = await client.query(
        "UPDATE orders SET status='processing',payment_status='paid' WHERE payment_intent_id=$1 AND user_id=$2 RETURNING *",
        [paymentIntentId, req.userId]
      );
      if (!r.rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: '注文が見つかりません' }); }
      await client.query('DELETE FROM carts WHERE user_id=$1', [req.userId]);
      await client.query('COMMIT');
      res.json({ order: r.rows[0] });
    } catch (e) { await client.query('ROLLBACK'); throw e; }
    finally { client.release(); }
  } catch (e) {
    console.error('Confirm error:', e);
    res.status(500).json({ error: '注文確定に失敗しました: ' + e.message });
  }
});

async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch (e) { return res.status(400).send(`Webhook Error: ${e.message}`); }
  switch (event.type) {
    case 'payment_intent.succeeded':
      await pool.query("UPDATE orders SET status='processing',payment_status='paid' WHERE payment_intent_id=$1 AND payment_status='unpaid'", [event.data.object.id]).catch(console.error);
      break;
    case 'payment_intent.payment_failed':
      await pool.query("UPDATE orders SET payment_status='failed' WHERE payment_intent_id=$1", [event.data.object.id]).catch(console.error);
      break;
  }
  res.json({ received: true });
}

app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── SPAフォールバック（/api以外はindex.htmlを返す）──
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

initDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 FAIRWAY API on port ${PORT}`)))
  .catch(e => { console.error(e); process.exit(1); });
