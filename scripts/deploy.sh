#!/usr/bin/env bash
#
# Local deploy: build the static export and FTPS-mirror it to cPanel.
# Same result as the GitHub Actions "Deploy to cPanel" workflow — use this
# when you want to push a change without going through git, or to bootstrap.
#
# Requires: lftp  (macOS:  brew install lftp)
# Config:   scripts/deploy.env  (copy from scripts/deploy.env.example)
#
set -euo pipefail

cd "$(dirname "$0")/.."

CONF="scripts/deploy.env"
if [ -f "$CONF" ]; then
  set -a; . "$CONF"; set +a
fi

: "${FTP_HOST:?set FTP_HOST in scripts/deploy.env}"
: "${FTP_USER:?set FTP_USER in scripts/deploy.env}"
: "${FTP_PASS:?set FTP_PASS in scripts/deploy.env}"
: "${FTP_DIR:?set FTP_DIR in scripts/deploy.env (cPanel document root)}"
FTP_PORT="${FTP_PORT:-21}"

command -v lftp >/dev/null || { echo "lftp not found — install it (brew install lftp)"; exit 1; }

echo "==> Building static export"
npm run build

echo "==> Uploading out/ -> ${FTP_HOST}:${FTP_DIR}"
lftp -c "
set cmd:fail-exit yes
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ssl:verify-certificate true
open -p ${FTP_PORT} -u '${FTP_USER}','${FTP_PASS}' '${FTP_HOST}'
mirror --reverse --delete --only-newer --verbose \
  --exclude-glob __next* \
  --exclude '.ftp-deploy-sync-state.json' \
  --exclude 'sendmail.config.php' \
  --exclude-glob .well-known/ \
  ./out/ '${FTP_DIR}'
"
echo "==> Done. https://macanco.com"
