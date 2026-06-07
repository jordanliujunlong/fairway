# Windows セットアップ手順（Docker不要版）

Virtualizationが無効のためDockerが使えない場合の手順です。

---

## 方法1 — PowerShellスクリプト（一番簡単）

1. **`setup-windows-no-docker.ps1`** を右クリック
2. **「PowerShellで実行」** を選択
   - 「管理者として実行」を求められた場合はOKを押す
   - 「このファイルを実行しますか？」→ **「R」を押してRun（実行）**

スクリプトが自動でやること：
- Node.js のインストール（未インストールの場合）
- PostgreSQL 16 のインストール（未インストールの場合）
- DB・ユーザーの作成
- `server/.env` の作成
- `npm install`

---

## 方法2 — 手動手順（PowerShellスクリプトがうまくいかない場合）

### Step 1 — Node.js をインストール

https://nodejs.org から **LTS版**（v22推奨）をダウンロードしてインストール。

確認：
```powershell
node -v   # v22.x.x と表示されればOK
npm -v
```

---

### Step 2 — PostgreSQL をインストール

**方法A: winget（コマンド）**

PowerShellを**管理者として**開いて：
```powershell
winget install PostgreSQL.PostgreSQL.16
```

**方法B: インストーラー（GUIで簡単）**

1. https://www.postgresql.org/download/windows/ を開く
2. **「Download the installer」** をクリック
3. Version **16.x**、Windows x86-64 をダウンロード
4. インストーラーを実行
   - インストール中に **パスワードを設定** → `postgres` と入力（または好きなもの）
   - ポート: **5432**（デフォルトのまま）
   - すべてデフォルトでNext → Finish

---

### Step 3 — DB・ユーザーを作成

スタートメニューで **「SQL Shell (psql)」** を検索して起動。

```
Server [localhost]: ← Enterを押す
Database [postgres]: ← Enterを押す
Port [5432]: ← Enterを押す
Username [postgres]: ← Enterを押す
Password for user postgres: ← インストール時に設定したパスワードを入力
```

ログインできたら以下を実行：

```sql
CREATE USER fairway WITH PASSWORD 'fairway_pass';
CREATE DATABASE fairway_db OWNER fairway;
\q
```

---

### Step 4 — .env ファイルを作成

`server` フォルダの中で、`.env.local` を `.env` という名前でコピー。

エクスプローラーで `server` フォルダを開いて：
- `.env.local` を右クリック → コピー → 貼り付け → 名前を `.env` に変更

または PowerShell で：
```powershell
cd fairway\server
Copy-Item .env.local .env
```

`.env` の中身を確認（デフォルトのままで動くはず）：
```env
DATABASE_URL=postgresql://fairway:fairway_pass@localhost:5432/fairway_db
JWT_SECRET=local-dev-secret-do-not-use-in-production
FRONTEND_URL=*
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_...   ← あとで設定
```

---

### Step 5 — npm install

```powershell
cd fairway\server
npm install
```

---

### Step 6 — サーバー起動

```powershell
npm run dev
```

こんなログが出ればOK：
```
✅ DB initialized
🚀 FAIRWAY API on port 3000
```

---

### Step 7 — フロントエンドを開く

`fairway\frontend\index.html` をダブルクリックしてブラウザで開く。

---

## よくあるエラー

### `psql` コマンドが見つからない

PostgreSQLインストール後にPATHが反映されていません。

**解決方法：** PowerShellを一度閉じて、新しいウィンドウで再試行。
または手動でPATHを追加：
```powershell
$env:PATH += ";C:\Program Files\PostgreSQL\16\bin"
```

---

### `password authentication failed for user "postgres"`

インストール時に設定したパスワードが違います。

**解決方法：** `pg_hba.conf` を編集してパスワードなしでローカル接続を許可するか、
PostgreSQL を再インストールしてパスワードを `postgres` に設定し直す。

---

### `ECONNREFUSED` / DBに繋がらない

PostgreSQLサービスが起動していません。

```powershell
# サービスを起動
net start postgresql-x64-16

# または
Get-Service postgresql* | Start-Service
```

---

### `Cannot find module 'express'`

npm install していないか、別フォルダで実行しています。

```powershell
cd fairway\server
npm install
npm run dev
```

---

## DBの中身を確認する

スタートメニューの **「SQL Shell (psql)」** を起動してログイン後：

```sql
-- fairway_dbに接続
\c fairway_db

-- テーブル一覧
\dt

-- ユーザー一覧
SELECT id, email, name FROM users;

-- 注文一覧
SELECT order_number, status, total FROM orders;

-- 終了
\q
```

または **pgAdmin**（PostgreSQLと一緒にインストールされるGUIツール）でも確認できます。
