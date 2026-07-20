# Stripe決済 セットアップガイド

## ⚠️ 最優先：シークレットキーの再発行

チャットに貼られたシークレットキー（`sk_test_...`）は**必ず失効させてください**。

1. Stripeダッシュボード → **開発者** → **APIキー**
2. シークレットキーの「⋯」→ **失効（Roll key）**
3. 新しいキーをコピー
4. `.env` の `STRIPE_SECRET_KEY` に貼り付け

**シークレットキーは絶対にチャット・GitHub・フロントエンドコードに書かないでください。**

---

## 問題の原因

決済してもStripeダッシュボードに何も表示されなかった理由：

**フロントエンドがStripeを一切呼んでいませんでした。**

```
【修正前】
カード番号を入力 → 「注文を確定」 → /api/orders → DB保存 → 完了画面
                                       ↑ Stripeを経由していない
```

`index.js` には `/api/payments/create-intent` が実装済みでしたが、
`cart.html` から呼び出されていない状態でした。

```
【修正後】
「注文を確定」
  ↓
/api/payments/create-intent  → Stripeに PaymentIntent 作成（ここで記録される）
  ↓
stripe.confirmCardPayment()  → カード情報を安全に送信・3Dセキュア認証
  ↓
/api/payments/confirm        → 注文ステータスを paid に更新
  ↓
完了画面
```

---

## 変更したファイル

### `cart.html`

- Stripe.js（`https://js.stripe.com/v3/`）を読み込み
- 自前のカード入力欄（カード番号・有効期限・CVC）を削除
  → **Stripe Elements** に置き換え（PCI DSS準拠）
- `placeOrder()` をカード決済時はStripe経由に変更
- カード決済はログイン必須に（未ログイン時はエラー表示）
- 日英中3言語のエラーメッセージを追加

### `index.js`

- 価格表（`PRICES`）を現在の商品ID（13〜42）に更新
  → **旧ID（1〜12）のままだと金額計算が0円になり決済が必ず失敗していました**

---

## セットアップ手順

### 1. `.env` を設定

```env
STRIPE_SECRET_KEY=sk_test_（再発行した新しいキー）
STRIPE_WEBHOOK_SECRET=whsec_（下記手順で取得）
```

### 2. サーバー起動

```bash
npm install
npm run dev
```

### 3. テスト決済を実行

ブラウザで `http://localhost:3000` を開き、以下の手順で確認します。

1. マイページからログイン（**カード決済にはログインが必須です**）
2. 商品をカートに追加 → レジへ進む
3. 配送先を入力 → 支払い方法で「クレジットカード」を選択
4. テストカード番号を入力

| 項目 | テスト値 |
|---|---|
| カード番号 | `4242 4242 4242 4242` |
| 有効期限 | 任意の未来日（例：`12/34`） |
| CVC | 任意の3桁（例：`123`） |

5. ポリシーに同意 → 「注文を確定する」

### 4. Stripeダッシュボードで確認

**支払い** タブに決済が表示されれば成功です。

---

## その他のテストカード

| カード番号 | 挙動 |
|---|---|
| `4242 4242 4242 4242` | 成功 |
| `4000 0025 0000 3155` | 3Dセキュア認証が必要 |
| `4000 0000 0000 9995` | 残高不足でエラー |
| `4000 0000 0000 0002` | カード拒否 |

---

## Webhook の設定（推奨）

ユーザーがブラウザを閉じても注文状態を正しく更新するため、Webhookを設定します。

### ローカル開発の場合

```bash
# Stripe CLI をインストール
brew install stripe/stripe-cli/stripe   # macOS
# Windows は https://stripe.com/docs/stripe-cli からダウンロード

stripe login
stripe listen --forward-to localhost:3000/api/payments/webhook
```

表示される `whsec_...` を `.env` の `STRIPE_WEBHOOK_SECRET` に設定します。

### 本番環境の場合

1. Stripeダッシュボード → **開発者** → **Webhook** → **エンドポイントを追加**
2. URL: `https://あなたのドメイン/api/payments/webhook`
3. 送信するイベント：
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. 表示される署名シークレット（`whsec_...`）を環境変数に設定

---

## 動作の仕組み

### 支払い方法ごとの処理

| 支払い方法 | 処理 |
|---|---|
| **クレジットカード** | Stripe経由（PaymentIntent作成 → カード認証 → 確定） |
| PayPay | 従来どおり `/api/orders`（Stripeを経由しない） |
| 後払い（コンビニ） | 従来どおり `/api/orders` |
| 銀行振込 | 従来どおり `/api/orders` |

### セキュリティ

- カード情報は**Stripe Elementsのiframe内**で処理され、あなたのサーバーには一切届きません
- 金額は**サーバー側で再計算**されるため、フロントを改ざんしても不正な金額では決済できません
- Publishable Key（`pk_test_...`）は公開前提のキーなので、フロントに書いて問題ありません

---

## 本番公開時のチェックリスト

- [ ] Stripeダッシュボードで**本番モード**に切り替え
- [ ] `cart.html` の `STRIPE_PUBLISHABLE_KEY` を `pk_live_...` に変更
- [ ] `.env` の `STRIPE_SECRET_KEY` を `sk_live_...` に変更
- [ ] Webhookエンドポイントを本番URLで登録
- [ ] Stripeアカウントの本人確認・銀行口座登録を完了
- [ ] 特定商取引法に基づく表記を用意
