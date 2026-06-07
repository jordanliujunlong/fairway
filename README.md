# FAIRWAY — ゴルフECサイト

## ファイル構成

```
fairway/
├── setup.sh              ← ローカル環境を一発セットアップ
├── docker-compose.yml    ← PostgreSQLをDockerで起動
├── server/
│   ├── index.js          APIサーバー（Express）
│   ├── package.json
│   ├── railway.toml      Railwayデプロイ設定
│   ├── .env.local        ローカル用環境変数テンプレート
│   └── .env.example      本番用環境変数テンプレート
├── frontend/
│   └── index.html        フロントエンド（全機能統合済み）
└── README.md
```

---

# ローカル開発環境の構築

## 必要なもの

| ツール | バージョン | 入手先 |
|---|---|---|
| Node.js | v18以上 | https://nodejs.org |
| Docker Desktop | 最新版 | https://docs.docker.com/get-docker/ |
| Stripe CLI | 最新版 | https://stripe.com/docs/stripe-cli （Webhook確認用・任意）|

---

## セットアップ手順

### 方法A — セットアップスクリプト（推奨）

```bash
# プロジェクトのルートで実行
bash setup.sh
```

スクリプトが以下を自動でやります：
- Node.js / Docker の確認
- `server/.env` の作成
- PostgreSQLコンテナの起動
- `npm install`

> **⚠ `Docker daemon is not running` エラーが出た場合**
>
> Docker Desktopが起動していません。
> - **Windows**: スタートメニューで「Docker Desktop」を検索して起動。タスクバーにクジラ🐳アイコンが出るまで待つ（1〜2分）
> - **Mac**: アプリケーションフォルダから「Docker」を起動。メニューバーにクジラアイコンが出るまで待つ
>
> 起動後に `bash setup.sh` を再実行してください。

---

### Dockerなしの場合（PostgreSQLを直接インストール）

DockerなしでもPostgreSQLをローカルに直接インストールして動かせます。

**Windows（winget）**
```powershell
winget install PostgreSQL.PostgreSQL.16
```

**Mac（Homebrew）**
```bash
brew install postgresql@16
brew services start postgresql@16
```

インストール後、DBとユーザーを作成します：

```bash
# PostgreSQLに接続（Windowsはpgadminでも可）
psql -U postgres

# DB・ユーザーを作成
CREATE USER fairway WITH PASSWORD 'fairway_pass';
CREATE DATABASE fairway_db OWNER fairway;
\q
```

`server/.env` の `DATABASE_URL` はそのままで動きます：
```env
DATABASE_URL=postgresql://fairway:fairway_pass@localhost:5432/fairway_db
```

その後は `cd server && npm install && npm run dev` で起動できます。

---

### 方法B — 手動セットアップ

#### 1. PostgreSQLを起動（Docker）

```bash
docker compose up -d db

# 起動確認
docker compose ps
# STATE が healthy になればOK
```

#### 2. 環境変数ファイルを作成

```bash
cp server/.env.local server/.env
```

`server/.env` を開いて確認（デフォルトでそのまま動きます）：

```env
DATABASE_URL=postgresql://fairway:fairway_pass@localhost:5432/fairway_db
JWT_SECRET=local-dev-secret-do-not-use-in-production
FRONTEND_URL=*
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_...    ← Stripeキーを持っている場合は設定
STRIPE_WEBHOOK_SECRET=whsec_...  ← Stripe CLIで取得
```

#### 3. npmパッケージをインストール

```bash
cd server
npm install
```

#### 4. APIサーバーを起動

```bash
npm run dev
# → http://localhost:3000 で起動
# → DB初期化（テーブル自動作成）のログが出ればOK
```

起動ログの確認：
```
✅ DB initialized
🚀 FAIRWAY API on port 3000
```

#### 5. フロントエンドを開く

`frontend/index.html` をブラウザで直接開くだけです：

```bash
# Mac
open frontend/index.html

# Windows
start frontend/index.html

# または VSCodeのLive Server拡張でも可
```

> `frontend/index.html` 先頭の設定でローカル用がデフォルトになっています：
> ```javascript
> const API_BASE = 'http://localhost:3000'; // ローカル用（デフォルト）
> ```

---

## Stripe（カード決済）のローカルテスト

Stripeキーがない場合でも、**Stripe以外の機能（ログイン・カート・住所管理・お気に入り等）はすべて動作します。**

カード決済もテストしたい場合：

#### 1. Stripeアカウント作成・キー取得

1. https://stripe.com でアカウント作成（無料）
2. ダッシュボード右上の「テストモード」をONにする
3. **開発者 → APIキー** から取得：
   - 公開可能キー：`pk_test_...` → `frontend/index.html` の `STRIPE_PUBLISHABLE_KEY` に設定
   - シークレットキー：`sk_test_...` → `server/.env` の `STRIPE_SECRET_KEY` に設定

#### 2. Stripe CLIでWebhookをローカル転送

```bash
# Stripe CLIのインストール（macOS）
brew install stripe/stripe-cli/stripe

# ログイン
stripe login

# 別ターミナルで実行（サーバー起動中に）
stripe listen --forward-to http://localhost:3000/api/payments/webhook

# 表示される whsec_... を server/.env の STRIPE_WEBHOOK_SECRET に設定
# サーバーを再起動（npm run dev）
```

#### テスト用カード番号

| カード番号 | 結果 |
|---|---|
| `4242 4242 4242 4242` | ✅ 決済成功 |
| `4000 0000 0000 9995` | ❌ 残高不足エラー |
| `4000 0025 0000 3155` | 🔐 3Dセキュア認証 |

有効期限：未来の任意の日付　CVC：任意の3桁

---

## DBの中身を確認する

```bash
# PostgreSQLに接続
docker compose exec db psql -U fairway -d fairway_db

# テーブル一覧
\dt

# ユーザー一覧
SELECT id, email, name, created_at FROM users;

# 注文一覧
SELECT id, order_number, status, payment_status, total FROM orders;

# お気に入り
SELECT * FROM wishlists;

# レビュー
SELECT * FROM reviews;

# 住所
SELECT * FROM addresses;

# 終了
\q
```

---

## APIの動作確認（curl）

```bash
# ヘルスチェック
curl http://localhost:3000/health

# アカウント登録
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"テスト太郎"}'

# ログイン（tokenを取得）
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# プロフィール取得（tokenを差し替えて使用）
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# お気に入り追加
curl -X POST http://localhost:3000/api/wishlist/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 住所追加
curl -X POST http://localhost:3000/api/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"label":"自宅","name":"テスト太郎","zip":"150-0001","pref":"東京都","city":"渋谷区","addr":"神南1-1-1","is_default":true}'
```

---

## よくあるエラーと対処

| エラー | 原因 | 対処 |
|---|---|---|
| `ECONNREFUSED 5432` | PostgreSQLが起動していない | `docker compose up -d db` |
| `password authentication failed` | .envのDB接続情報が違う | `.env`の`DATABASE_URL`を確認 |
| `Cannot find module 'express'` | npm installしていない | `cd server && npm install` |
| Stripeエラー（sk_test_placeholder）| Stripeキー未設定 | `.env`に`sk_test_...`を設定、またはStripe決済をスキップ |
| CORSエラー | FRONTEND_URLの設定 | `.env`の`FRONTEND_URL=*`を確認 |
| `Cannot GET /` | サーバーが起動していない | `npm run dev`で起動 |

---

## DBのリセット

```bash
# コンテナとデータを完全削除してやり直す
docker compose down -v

# 再起動（テーブルは自動再作成される）
docker compose up -d db
```

---

# Railway本番デプロイ

ローカルで動作確認できたら本番へ。

### 1. フロントエンドの設定を本番用に切り替え

`frontend/index.html` の先頭：

```javascript
// ローカル用をコメントアウト
// const API_BASE = 'http://localhost:3000';
// const STRIPE_PUBLISHABLE_KEY = 'pk_test_...';

// 本番用を有効化
const API_BASE = 'https://YOUR-APP.up.railway.app';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_PUBLISHABLE_KEY_HERE';
```

### 2. server/ をGitHubにpush

```bash
cd server
git init && git add . && git commit -m "initial"
git remote add origin https://github.com/YOUR/REPO.git
git push -u origin main
```

### 3. RailwayでDBとサービスを作成

1. Railwayプロジェクト → **+ New** → **Database** → **PostgreSQL**
2. **+ New** → **GitHub Repo** → Root Directory を `server` に設定

### 4. Railwayの Variables に設定

| 変数名 | 値 |
|---|---|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `openssl rand -hex 32` の出力 |
| `FRONTEND_URL` | フロントエンドのURL |
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhookで発行された `whsec_...` |

### 5. フロントエンドをVercel/Netlifyにデプロイ

```bash
# Vercel
npx vercel deploy frontend/
```

---

## APIエンドポイント一覧

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| GET | `/health` | 不要 | ヘルスチェック |
| POST | `/api/auth/register` | 不要 | アカウント登録 |
| POST | `/api/auth/login` | 不要 | ログイン |
| GET | `/api/profile` | JWT | プロフィール取得 |
| PATCH | `/api/profile` | JWT | プロフィール更新 |
| GET | `/api/cart` | JWT | カート取得 |
| PUT | `/api/cart` | JWT | カート保存 |
| GET | `/api/orders` | JWT | 注文履歴 |
| GET | `/api/wishlist` | JWT | お気に入り一覧 |
| POST | `/api/wishlist/:productId` | JWT | お気に入り追加 |
| DELETE | `/api/wishlist/:productId` | JWT | お気に入り削除 |
| GET | `/api/reviews` | JWT | 自分のレビュー一覧 |
| GET | `/api/reviews/product/:id` | 不要 | 商品別レビュー |
| POST | `/api/reviews` | JWT | レビュー投稿・更新 |
| DELETE | `/api/reviews/:id` | JWT | レビュー削除 |
| GET | `/api/addresses` | JWT | 住所一覧 |
| POST | `/api/addresses` | JWT | 住所追加 |
| PATCH | `/api/addresses/:id` | JWT | 住所編集 |
| DELETE | `/api/addresses/:id` | JWT | 住所削除 |
| PATCH | `/api/addresses/:id/set-default` | JWT | デフォルト設定 |
| POST | `/api/payments/create-intent` | JWT | 決済Intent作成 |
| POST | `/api/payments/confirm` | JWT | 注文確定 |
| POST | `/api/payments/webhook` | Stripe署名 | Webhookイベント |
