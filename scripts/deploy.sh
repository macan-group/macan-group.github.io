#!/usr/bin/env bash
#
# Local deploy: build the static export and mirror it to cPanel.
# Same result as the GitHub Actions "Deploy to cPanel" workflow — use this
# when CI isn't set up yet, or to deploy without going through git.
#
# Requires: lftp   (macOS: brew install lftp)
# Config:   scripts/deploy.env   (copy from scripts/deploy.env.example)
#
set -euo pipefail
cd "$(dirname "$0")/.."

CONF="scripts/deploy.env"
[ -f "$CONF" ] && { set -a; . "$CONF"; set +a; }

: "${FTP_HOST:?set FTP_HOST in scripts/deploy.env (server hostname or IP)}"
: "${FTP_USER:?set FTP_USER in scripts/deploy.env}"
: "${FTP_PASS:?set FTP_PASS in scripts/deploy.env}"
: "${FTP_DIR:?set FTP_DIR in scripts/deploy.env (cPanel document root)}"

PROTOCOL="${DEPLOY_PROTOCOL:-ftps}"   # ftps | ftp | sftp
PORT="${FTP_PORT:-}"

command -v lftp >/dev/null || { echo "lftp not found — run: brew install lftp"; exit 1; }

case "$PROTOCOL" in
  ftps) URL="ftp://${FTP_HOST}";  SETTINGS="set ftp:ssl-force true; set ftp:ssl-protect-data true; set ssl:verify-certificate no" ;;
  ftp)  URL="ftp://${FTP_HOST}";  SETTINGS="set ftp:ssl-allow no" ;;
  sftp) URL="sftp://${FTP_HOST}"; SETTINGS="set sftp:auto-confirm yes" ;;
  *) echo "DEPLOY_PROTOCOL must be ftps, ftp or sftp"; exit 1 ;;
esac
[ -n "$PORT" ] && URL="${URL}:${PORT}"

echo "==> Building static export"
npm run build

echo "==> Deploying out/ -> ${PROTOCOL}://${FTP_HOST}/${FTP_DIR}"
lftp -c "
set cmd:fail-exit yes
${SETTINGS}
open -u '${FTP_USER}','${FTP_PASS}' '${URL}'
mirror --reverse --delete --only-newer --verbose \
  --exclude-glob __next* \
  --exclude '.ftp-deploy-sync-state.json' \
  --exclude 'sendmail.config.php' \
  --exclude-glob .well-known/ \
  ./out/ '${FTP_DIR}'
"
echo "==> Done."
