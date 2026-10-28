#!/bin/sh
# Headless self-check of a model.js against the page's utilities. Same checks as the page runs on load.
# Usage: scripts/smoke_test.sh [model.js]      (default: ./model.js next to index.html)
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
MODEL="${1:-$DIR/model.js}"
TMP="$(mktemp -t explorer_smoke).js"
awk '/<script id="utils">/{f=1;next} /<\/script>/{if(f){f=0}} f' "$DIR/index.html" > "$TMP"
cat "$MODEL" >> "$TMP"
cat "$DIR/scripts/smoke_test.js" >> "$TMP"
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
if command -v node >/dev/null 2>&1; then node "$TMP"
elif [ -x "$JSC" ]; then "$JSC" "$TMP"
else echo "no JavaScript engine found (install node); open index.html in a browser instead, the page runs the same checks"; exit 2; fi
rm -f "$TMP"
