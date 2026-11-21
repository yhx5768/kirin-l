#!/bin/sh
# 麒麟芯片图鉴 · 本地预览
cd "$(dirname "$0")" || exit 1
PORT="${1:-8787}"
echo "Kirin-L → http://localhost:${PORT}"
exec python3 -m http.server "${PORT}"
