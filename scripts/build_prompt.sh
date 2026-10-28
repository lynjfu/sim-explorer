#!/bin/sh
# Rebuild 2_PROMPT.md (the self-contained paste-in prompt for any AI assistant) from docs/LLM_INSTRUCTIONS.md, docs/MODEL_CONTRACT.md and model.js.
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$DIR/2_PROMPT.md"
{
  cat <<'HDR'
<!-- Student: copy EVERYTHING in this file into a new chat with your AI assistant, then paste your answers to 1_ASSIGNMENT.md underneath. -->

You are an AI assistant helping a doctoral student in management turn their written description of an agent-based simulation into a working `model.js` for a fixed web page called the explorer. Three documents follow, then the student's answers. Read all of it before replying. Follow "Instructions for the AI assistant" exactly: fill in the card, ask at most six plain-language questions about what is missing, show the card for confirmation, then write the one file.

---

HDR
  cat "$DIR/docs/LLM_INSTRUCTIONS.md"
  printf '\n\n---\n\n'
  cat "$DIR/docs/MODEL_CONTRACT.md"
  printf '\n\n---\n\n# Example `model.js` (a complete, working model that follows the contract)\n\n```js\n'
  cat "$DIR/model.js"
  printf '```\n\n---\n\n# The student'"'"'s answers follow\n\n'
} > "$OUT"
echo "wrote $OUT ($(wc -c < "$OUT") bytes)"
