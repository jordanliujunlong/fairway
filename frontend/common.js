// ═══════════════════════════════════════════
// FAIRWAY — 共通設定・関数
// ═══════════════════════════════════════════

const API_BASE = 'http://localhost:3000';
// 本番時はコメントを切り替え:
// const API_BASE = 'https://YOUR-APP.up.railway.app';

const PRODUCTS = [
  {id:1,cat:'club',brand:'TITLEIST',name:'TSR3 Driver',desc:'超低スピンで最大飛距離。ツアープロ使用モデル。',descLong:'TSR3ドライバーは、最先端の空気力学とフェース設計を融合させたツアーレベルのドライバーです。超低スピン特性により、強い弾道でキャリーとランを最大化。フェースの薄肉化によって反発エリアを拡大し、ミスヒット時のエネルギーロスを最小限に抑えます。',price:88000,badge:'NEW',icon:'🏌️',specs:[['ロフト角','9.0° / 10.5°'],['シャフト','Titleist HZRDUS Red CB 60'],['フレックス','S / X'],['ヘッド体積','460cc'],['重量','約298g']],rating:4.8,reviews:[{user:'田中 K.',date:'2026.03.12',text:'飛距離が10ヤード以上伸びました。打感も柔らかく最高です。'},{user:'佐藤 M.',date:'2026.02.28',text:'フィッティングで選んで大正解。'}]},
  {id:2,cat:'club',brand:'CALLAWAY',name:'Paradym Irons Set',desc:'AI設計フェースで安定した方向性と飛距離を両立。',descLong:'AIが設計した極薄フェースと鍛造インフィル構造により、番手ごとに最適化されたたわみを実現。6本セット（5I〜PW）でのご提供です。',price:132000,badge:null,icon:'⛳',specs:[['セット構成','5I〜PW（6本）'],['シャフト','Callaway RCH 45'],['素材','17-4ステンレス+鍛造'],['フレックス','R / S']],rating:4.6,reviews:[{user:'鈴木 T.',date:'2026.04.01',text:'打感が素晴らしく、安定した弾道が出ます。'}]},
  {id:3,cat:'ball',brand:'TITLEIST',name:'Pro V1x（12個入）',desc:'ツアー使用率No.1。高スピンと柔らかな打感。',descLong:'世界ツアーで最も使用されているプレミアムゴルフボール。デュアルコア構造によりドライバーでの低スピン飛距離とアイアンでの高スピンコントロールを両立します。',price:7800,badge:'SALE',origPrice:9200,icon:'⚪',specs:[['コア構造','デュアルコア'],['カバー','ウレタンエラストマー(318ディンプル)'],['圧縮率','102'],['層構造','4ピース']],rating:4.9,reviews:[{user:'伊藤 S.',date:'2026.04.10',text:'グリーン周りのスピン量が段違い。'}]},
  {id:4,cat:'wear',brand:'POLO GOLF',name:'Performance Polo',desc:'UVカット・吸汗速乾。快適なプレーをサポート。',descLong:'UPF50+のUVカット機能と高機能吸汗速乾素材を組み合わせた本格ゴルフポロシャツ。ストレッチ素材採用でスウィング時の動きを妨げません。',price:14800,badge:'NEW',icon:'👕',specs:[['素材','ポリエステル92% / スパンデックス8%'],['機能','UPF50+ / 吸汗速乾 / ストレッチ'],['サイズ','S / M / L / XL / XXL']],rating:4.5,reviews:[{user:'高橋 Y.',date:'2026.04.05',text:'着心地が最高。夏のラウンドでも快適でした。'}]},
  {id:5,cat:'bag',brand:'TITLEIST',name:'Players 4 StaDry',desc:'完全防水スタンドバッグ。14分割収納。',descLong:'完全防水加工が施されたプレミアムスタンドバッグ。14分割の仕切りで整理しやすく、複数のポケットが便利な収納を提供。',price:52000,badge:null,icon:'🎒',specs:[['重量','約2.1kg'],['ポケット数','7（うち保温1）'],['クラブ仕切り','14分割'],['防水','完全防水（IPX5相当）']],rating:4.7,reviews:[{user:'松本 H.',date:'2026.02.14',text:'雨の日でも安心。スタンドの安定感も抜群です。'}]},
  {id:6,cat:'goods',brand:'FootJoy',name:'StaSof Golf Glove',desc:'最高級カブレッタレザー。フィット感と耐久性。',descLong:'最高級AAA級カブレッタレザーを使用した伝統的なゴルフグローブ。柔らかくしなやかな質感でグリップとの一体感を演出。',price:3800,badge:null,icon:'🧤',specs:[['素材','AAA級カブレッタレザー'],['サイズ','S / M / ML / L / XL'],['利き手','左手（右利き用）']],rating:4.8,reviews:[{user:'小林 T.',date:'2026.03.18',text:'これ以上のグローブは存在しません。'}]},
  {id:7,cat:'club',brand:'PING',name:'G430 MAX Fairway',desc:'最大慣性モーメントで方向性抜群。',descLong:'G430シリーズ最高の慣性モーメントを誇るフェアウェイウッド。スピードポケット設計でフェース全体の反発力を向上。',price:42000,badge:null,icon:'🏌️',specs:[['ロフト角','3W(15°) / 5W(17.5°) / 7W(21°)'],['シャフト','PING TOUR 2.0 Chrome'],['フレックス','R / S / X']],rating:4.6,reviews:[{user:'吉田 R.',date:'2026.03.28',text:'3Wが苦手でしたがこれは打ちやすい。'}]},
  {id:8,cat:'ball',brand:'BRIDGESTONE',name:'TOUR B XS（12個入）',desc:'タイガー・ウッズ愛用モデル。',descLong:'タイガー・ウッズが自ら開発に関わったプレミアムボール。REACTIV™コアが衝撃の強さに応じてたわみを最適化。',price:8200,badge:'NEW',icon:'🔵',specs:[['コア','REACTIV™コア'],['カバー','スラワン™ウレタン(330ディンプル)'],['圧縮率','90'],['層構造','4ピース']],rating:4.8,reviews:[{user:'西村 K.',date:'2026.04.08',text:'アプローチのスピンが良くかかります。'}]},
  {id:9,cat:'wear',brand:'adidas GOLF',name:'Ultimate365 Pants',desc:'4方向ストレッチ素材。スウィングをサポート。',descLong:'4方向ストレッチ素材と撥水加工を兼ね備えたオールコンディションゴルフパンツ。',price:12800,badge:null,icon:'👖',specs:[['素材','ポリエステル87% / スパンデックス13%'],['機能','4方向ストレッチ / 撥水 / UVカット'],['サイズ','28〜36インチ']],rating:4.4,reviews:[{user:'森 T.',date:'2026.03.10',text:'動きやすくておしゃれ。'}]},
  {id:10,cat:'goods',brand:'Bushnell',name:'Pro XE Rangefinder',desc:'GPSレーザー距離計。±0.5yd高精度。',descLong:'プロゴルファーも信頼するBushnellフラッグシップ距離計。傾斜補正機能で実際のプレー距離を算出。防水・防塵設計。',price:68000,badge:'NEW',icon:'📡',specs:[['測定距離','最大1,760ヤード'],['精度','±0.5ヤード'],['倍率','7倍'],['防水','IPX7相当']],rating:4.9,reviews:[{user:'田村 S.',date:'2026.04.02',text:'ピンへの距離が一発で出る。'}]},
  {id:11,cat:'club',brand:'TaylorMade',name:'Stealth 2 Plus Driver',desc:'カーボンフェースで超軽量・最大反発。',descLong:'60層カーボンツイストフェースを採用したTaylorMade最先端ドライバー。調整機能付きホーゼルで9つのロフト・ライ設定が可能です。',price:76000,badge:null,icon:'🏌️',specs:[['フェース','60層カーボンツイストフェース'],['ロフト角','8° / 9° / 10.5°（±2°調整可）'],['シャフト','Fujikura Ventus TR Red']],rating:4.7,reviews:[{user:'石井 M.',date:'2026.02.25',text:'飛距離は確かに伸びた。'}]},
  {id:12,cat:'bag',brand:'Sun Mountain',name:'C-130S Cart Bag',desc:'カートバッグの最高峰。15分割仕切り。',descLong:'15分割の独立したクラブ仕切りと11個の多機能ポケット。RotoTop™フード機構採用。',price:38000,badge:'SALE',origPrice:48000,icon:'🎒',specs:[['重量','約2.6kg'],['ポケット数','11（うち保温2）'],['クラブ仕切り','15分割（独立型）']],rating:4.6,reviews:[{user:'林 K.',date:'2026.03.05',text:'整理しやすくラウンドのストレスが激減。'}]},
];

// ── 状態 ──
let token = localStorage.getItem('fw_token') || null;
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('fw_cart') || '[]');

// ── API ──
async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API_BASE + path, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'APIエラー');
  return data;
}

// ── カート（localStorage同期）──
function saveCartLocal() {
  localStorage.setItem('fw_cart', JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function getCartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function addToCart(productId, qty = 1) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p) return;
  const ex = cart.find(x => x.id === productId);
  if (ex) ex.qty += qty; else cart.push({ ...p, qty });
  saveCartLocal();
  syncCartServer();
  updateCartBadge();
  showToast(`${p.name} をカートに追加しました`);
}

let cartSyncTimer = null;
function syncCartServer() {
  if (!token) return;
  clearTimeout(cartSyncTimer);
  cartSyncTimer = setTimeout(() => {
    api('PUT', '/api/cart', { items: cart.map(i => ({ product_id: i.id, qty: i.qty })) }).catch(() => {});
  }, 800);
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const count = getCartCount();
  badges.forEach(b => b.textContent = count);
}

// ── セッション復元 ──
async function restoreSession() {
  if (!token) return;
  try {
    currentUser = await api('GET', '/api/profile');
    // サーバーのカートとマージ
    const serverCart = await api('GET', '/api/cart');
    if (serverCart.length) {
      serverCart.forEach(row => {
        const p = PRODUCTS.find(x => x.id === row.product_id);
        if (!p) return;
        const ex = cart.find(x => x.id === row.product_id);
        if (!ex) cart.push({ ...p, qty: row.qty });
      });
      saveCartLocal();
    }
  } catch {
    token = null;
    localStorage.removeItem('fw_token');
  }
  updateCartBadge();
  updateNavAuth();
}

function updateNavAuth() {
  const btn = document.getElementById('mypageNavBtn');
  const dot = document.getElementById('userDot');
  if (!btn) return;
  if (currentUser) {
    btn.classList.add('logged-in');
    if (dot) dot.style.background = 'var(--gold)';
  } else {
    btn.classList.remove('logged-in');
    if (dot) dot.style.background = 'var(--gray)';
  }
}

// ── トースト ──
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(80px);background:var(--gold);color:var(--black);padding:.75rem 2rem;font-size:.82rem;font-weight:700;letter-spacing:.08em;z-index:9999;transition:transform .3s;pointer-events:none;white-space:nowrap;font-family:var(--font-ja)';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(80px)'; }, 2400);
}

// ── 共通CSS変数 ──
const COMMON_CSS = `
  :root {
    --black:#050a06;--dark:#0d1a0f;--forest:#1a3320;--green:#2d5a3d;
    --gold:#c9a84c;--gold-lt:#e2c97e;--cream:#f5f0e8;--gray:#6a6a5a;
    --red:#c0392b;
    --font-en:'Cormorant Garamond',serif;
    --font-ja:'Zen Kaku Gothic New',sans-serif;
    --font-hd:'Bebas Neue',cursive;
  }
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:var(--black);color:var(--cream);font-family:var(--font-ja);font-weight:300;overflow-x:hidden}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--dark)}::-webkit-scrollbar-thumb{background:var(--gold)}
  a{text-decoration:none;color:inherit}

  /* NAV */
  nav{position:fixed;top:0;left:0;right:0;z-index:90;display:flex;align-items:center;justify-content:space-between;padding:1.1rem 3rem;background:rgba(5,10,6,0.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(201,168,76,0.15)}
  .nav-logo{font-family:var(--font-hd);font-size:1.8rem;letter-spacing:.18em;color:var(--cream)}
  .nav-logo span{color:var(--gold)}
  .nav-links{display:flex;gap:2rem;list-style:none}
  .nav-links a{font-size:.76rem;letter-spacing:.14em;color:rgba(245,240,232,.65);transition:color .2s}
  .nav-links a:hover,.nav-links a.active{color:var(--gold-lt)}
  .nav-right{display:flex;align-items:center;gap:1rem}
  .nav-btn{position:relative;background:none;border:1px solid rgba(201,168,76,.35);color:var(--cream);padding:.5rem 1.2rem;font-family:var(--font-ja);font-size:.78rem;letter-spacing:.1em;cursor:pointer;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:.4rem}
  .nav-btn:hover{background:var(--gold);color:var(--black);border-color:var(--gold)}
  .nav-btn.logged-in .user-dot{background:var(--gold)}
  .cart-badge{background:var(--gold);color:var(--black);width:18px;height:18px;border-radius:50%;font-size:.6rem;font-weight:700;display:inline-flex;align-items:center;justify-content:center}
  .user-dot{width:8px;height:8px;border-radius:50%;background:var(--gray);transition:background .2s}

  /* PAGE WRAPPER */
  .page-wrap{padding-top:70px;min-height:100vh}

  /* BTN */
  .btn-gold{padding:.8rem 2rem;background:var(--gold);color:var(--black);font-family:var(--font-ja);font-size:.82rem;font-weight:700;letter-spacing:.12em;border:none;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:.5rem}
  .btn-gold:hover{background:var(--gold-lt);transform:translateY(-2px)}
  .btn-ghost{padding:.8rem 2rem;background:transparent;color:var(--cream);font-family:var(--font-ja);font-size:.82rem;letter-spacing:.12em;border:1px solid rgba(245,240,232,.25);cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;gap:.5rem}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
`;
