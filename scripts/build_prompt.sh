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
# The guided setup page (carolynjfu.com/sim-setup/, repository lynjfu/sim-setup) needs the same prompt without the first comment line, as a script it can load from a local folder too.
python3 - "$OUT" "$DIR/start/prompt.js" <<'PY'
import json, sys
body = open(sys.argv[1], encoding='utf-8').read().split('\n', 2)[2]
open(sys.argv[2], 'w', encoding='utf-8').write('// Built by scripts/build_prompt.sh from 2_PROMPT.md. Do not edit by hand.\nwindow.PROMPT_BODY = ' + json.dumps(body, ensure_ascii=False) + ';\n')
PY
echo "wrote $DIR/start/prompt.js"
# PSEUDOCODE.md: the example model's pseudocode field, for reading on GitHub (also copied into examples/ai-advisor/).
python3 - "$DIR/model.js" "$DIR/PSEUDOCODE.md" "$DIR/examples/ai-advisor/PSEUDOCODE.md" <<'PY'
import re, sys
src = open(sys.argv[1], encoding='utf-8').read()
m = re.search(r"pseudocode:\s*`(.*?)`", src, re.S)
name = re.search(r"name:\s*'([^']*)'", src)
if not m: sys.exit('model.js has no pseudocode field')
body = m.group(1).strip('\n').rstrip()
text = (f"# Pseudocode: {name.group(1) if name else 'the example model'}\n\n"
        "The built-in example's code (`model.js`), step by step in plain words. Generated from the `pseudocode` field of `model.js` "
        "by `scripts/build_prompt.sh`; do not edit by hand. In the explorer, press **Pseudocode** on the left to see the pseudocode "
        f"of whichever model is running.\n\n```text\n{body}\n```\n")
for out in sys.argv[2:]: open(out, 'w', encoding='utf-8').write(text)
PY
echo "wrote $DIR/PSEUDOCODE.md and $DIR/examples/ai-advisor/PSEUDOCODE.md"
