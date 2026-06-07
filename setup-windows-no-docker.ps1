# FAIRWAY Windows セットアップスクリプト（Docker不要版）
# PowerShellで実行: .\setup-windows-no-docker.ps1
# ※ 管理者権限で実行してください（右クリック→「管理者として実行」）

$Green  = "Green"
$Yellow = "Yellow"
$Red    = "Red"
$Cyan   = "Cyan"

Write-Host ""
Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  FAIRWAY セットアップ (Docker不要)  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── 管理者権限チェック ──
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "✗ 管理者権限が必要です。" -ForegroundColor $Red
    Write-Host "  → このファイルを右クリックして「管理者として実行」を選んでください。" -ForegroundColor $Yellow
    Read-Host "Enterキーで終了"
    exit 1
}

# ── Node.js チェック ──
Write-Host "[1/4] Node.js を確認中..." -ForegroundColor $Yellow
try {
    $nodeVer = node -v 2>$null
    Write-Host "✓ Node.js $nodeVer" -ForegroundColor $Green
} catch {
    Write-Host "✗ Node.js が見つかりません。インストールします..." -ForegroundColor $Yellow
    winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
    Write-Host "✓ Node.js をインストールしました。" -ForegroundColor $Green
    Write-Host "  ※ インストール後はターミナルを再起動してください。" -ForegroundColor $Yellow
}

# ── PostgreSQL チェック・インストール ──
Write-Host "[2/4] PostgreSQL を確認中..." -ForegroundColor $Yellow
$pgReady = $false
try {
    $pgVer = psql --version 2>$null
    Write-Host "✓ $pgVer" -ForegroundColor $Green
    $pgReady = $true
} catch {
    Write-Host "  PostgreSQL が見つかりません。winget でインストールします..." -ForegroundColor $Yellow
    winget install PostgreSQL.PostgreSQL.16 --silent --accept-source-agreements --accept-package-agreements
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
    Write-Host "✓ PostgreSQL をインストールしました。" -ForegroundColor $Green
    $pgReady = $true
}

# ── DB・ユーザー作成 ──
Write-Host "[3/4] データベースをセットアップ中..." -ForegroundColor $Yellow

# PostgreSQL サービス起動
$svc = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($svc) {
    if ($svc.Status -ne "Running") {
        Start-Service $svc.Name
        Start-Sleep -Seconds 3
        Write-Host "✓ PostgreSQL サービスを起動しました。" -ForegroundColor $Green
    } else {
        Write-Host "✓ PostgreSQL サービスは既に起動中です。" -ForegroundColor $Green
    }
} else {
    Write-Host "⚠ PostgreSQL サービスが見つかりません。手動で起動してください。" -ForegroundColor $Yellow
}

# DB・ユーザー作成（既に存在してもエラーにならない）
$sqlCommands = @"
DO `$`$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'fairway') THEN
    CREATE USER fairway WITH PASSWORD 'fairway_pass';
  END IF;
END `$`$;

SELECT 'CREATE DATABASE fairway_db OWNER fairway'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fairway_db')\gexec
"@

Write-Host "  DB・ユーザーを作成中..." -ForegroundColor $Yellow
try {
    $sqlCommands | psql -U postgres --quiet 2>$null
    Write-Host "✓ DB 'fairway_db' とユーザー 'fairway' を確認しました。" -ForegroundColor $Green
} catch {
    Write-Host "⚠ DB作成をスキップ（既に存在するか、postgresユーザーのパスワードが必要です）" -ForegroundColor $Yellow
    Write-Host "  手動でDBを作成する場合は README.md を参照してください。" -ForegroundColor $Yellow
}

# ── .env ファイル作成 ──
Write-Host "[4/4] 環境変数ファイルをセットアップ中..." -ForegroundColor $Yellow
$envPath = "server\.env"
$envLocalPath = "server\.env.local"

if (-not (Test-Path $envPath)) {
    Copy-Item $envLocalPath $envPath
    Write-Host "✓ server\.env を作成しました。" -ForegroundColor $Green
} else {
    Write-Host "✓ server\.env は既に存在します。" -ForegroundColor $Green
}

# ── npm install ──
Write-Host "  npm パッケージをインストール中..." -ForegroundColor $Yellow
Set-Location server
npm install --silent
Set-Location ..
Write-Host "✓ npm install 完了。" -ForegroundColor $Green

# ── 完了 ──
Write-Host ""
Write-Host "══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ セットアップ完了！" -ForegroundColor $Green
Write-Host "══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "次のステップ:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "  ① 新しいターミナルで APIサーバーを起動"
Write-Host "       cd server"
Write-Host "       npm run dev"
Write-Host ""
Write-Host "  ② frontend\index.html をブラウザで開く"
Write-Host "       （ダブルクリックでOK）"
Write-Host ""
Write-Host "  ③ （任意）Stripeキーを server\.env に設定するとカード決済も使えます"
Write-Host ""
Read-Host "Enterキーで終了"
