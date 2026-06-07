#!/bin/bash
# FAIRWAY ローカル環境セットアップスクリプト
# 使い方: bash setup.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "╔══════════════════════════════════╗"
echo "║  FAIRWAY ローカルセットアップ    ║"
echo "╚══════════════════════════════════╝"
echo ""

# ── Node.js チェック ──
echo -e "${YELLOW}[1/5] Node.js を確認中...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js が見つかりません。${NC}"
  echo "  → https://nodejs.org から v18以上 をインストールしてください"
  exit 1
fi
NODE_VER=$(node -v)
echo -e "${GREEN}✓ Node.js $NODE_VER${NC}"

# ── Docker チェック ──
echo -e "${YELLOW}[2/5] Docker を確認中...${NC}"
if ! command -v docker &> /dev/null; then
  echo -e "${RED}✗ Docker が見つかりません。${NC}"
  echo ""
  echo "  インストール方法:"
  echo -e "  ${BLUE}Windows:${NC} https://docs.docker.com/desktop/install/windows-install/"
  echo -e "  ${BLUE}Mac:${NC}     https://docs.docker.com/desktop/install/mac-install/"
  echo ""
  echo "  ※ Dockerなしで使う場合は README.md の「Dockerなしの場合」を参照"
  exit 1
fi

# Docker デーモンが起動しているか確認
echo -e "  Docker デーモンの起動を確認中..."
if ! docker info &> /dev/null; then
  echo ""
  echo -e "${RED}✗ Docker は見つかりましたが、起動していません。${NC}"
  echo ""
  echo -e "  ${YELLOW}【解決方法】${NC}"
  echo -e "  ${BLUE}Windows:${NC}"
  echo "    1. スタートメニューで「Docker Desktop」を検索して起動"
  echo "    2. タスクバーにクジラのアイコンが表示されるまで待つ（1〜2分）"
  echo "    3. このスクリプトを再実行: bash setup.sh"
  echo ""
  echo -e "  ${BLUE}Mac:${NC}"
  echo "    1. アプリケーションフォルダから「Docker」を起動"
  echo "    2. メニューバーにクジラアイコンが出るまで待つ"
  echo "    3. このスクリプトを再実行: bash setup.sh"
  echo ""
  exit 1
fi
echo -e "${GREEN}✓ Docker $(docker -v | awk '{print $3}' | tr -d ',') (起動中)${NC}"

# ── .env セットアップ ──
echo -e "${YELLOW}[3/5] 環境変数ファイルをセットアップ中...${NC}"
if [ ! -f server/.env ]; then
  cp server/.env.local server/.env
  echo -e "${GREEN}✓ server/.env を作成しました${NC}"
  echo -e "${YELLOW}  ⚠ Stripeキーを server/.env に設定するとカード決済も使えます（後でも可）${NC}"
else
  echo -e "${GREEN}✓ server/.env は既に存在します${NC}"
fi

# ── PostgreSQL 起動 ──
echo -e "${YELLOW}[4/5] PostgreSQL（Docker）を起動中...${NC}"
docker compose up -d db
echo -n "  DBの起動を待機中"
READY=false
for i in {1..30}; do
  if docker compose exec -T db pg_isready -U fairway -d fairway_db &>/dev/null; then
    READY=true
    break
  fi
  echo -n "."
  sleep 1
done
echo ""
if [ "$READY" = false ]; then
  echo -e "${RED}✗ DBの起動がタイムアウトしました。${NC}"
  echo "  → docker compose logs db  で原因を確認してください"
  exit 1
fi
echo -e "${GREEN}✓ PostgreSQL が起動しました${NC}"

# ── npm install ──
echo -e "${YELLOW}[5/5] npm パッケージをインストール中...${NC}"
cd server && npm install --silent
echo -e "${GREEN}✓ パッケージインストール完了${NC}"
cd ..

# ── 完了 ──
echo ""
echo "══════════════════════════════════════════"
echo -e "${GREEN}✅ セットアップ完了！${NC}"
echo "══════════════════════════════════════════"
echo ""
echo "次のステップ:"
echo ""
echo -e "  ${YELLOW}① APIサーバーを起動${NC}"
echo "     cd server"
echo "     npm run dev"
echo ""
echo -e "  ${YELLOW}② フロントエンドをブラウザで開く${NC}"
echo "     frontend/index.html をダブルクリック"
echo "     または:"
echo "       Mac:     open frontend/index.html"
echo "       Windows: start frontend/index.html"
echo ""
echo -e "  ${YELLOW}③ （任意）Stripeカード決済をテストする場合${NC}"
echo "     README.md の「Stripe のローカルテスト」を参照"
echo ""
echo "  DBに直接アクセスする場合:"
echo "     docker compose exec db psql -U fairway -d fairway_db"
echo ""
echo "  停止する場合:"
echo "     docker compose down"
echo ""
