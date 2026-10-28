#!/bin/sh
# Make a single-file explorer with the model inside it. Usage: scripts/inline_model.sh [model.js] out.html [--artifact]
# --artifact also strips the document wrapper (doctype/html/head/body lines) for publishing as a Claude artifact.
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
if [ $# -ge 2 ] && [ "$2" != "--artifact" ]; then MODEL="$1"; OUT="$2"; shift 2; else MODEL="$DIR/model.js"; OUT="$1"; shift 1; fi
[ -n "$OUT" ] || { echo "usage: inline_model.sh [model.js] out.html [--artifact]"; exit 1; }
awk -v model="$MODEL" '
  /<script src="model.js"><\/script>/ { print "<script>"; while ((getline line < model) > 0) print line; close(model); print "</script>"; next }
  { print }
' "$DIR/index.html" > "$OUT"
if [ "$1" = "--artifact" ]; then
  sed -i '' -e '/^<!DOCTYPE html>$/d' -e '/^<html lang="en">$/d' -e '/^<head>$/d' -e '/^<\/head>$/d' -e '/^<body>$/d' -e '/^<\/body>$/d' -e '/^<\/html>$/d' "$OUT"
fi
echo "wrote $OUT"
