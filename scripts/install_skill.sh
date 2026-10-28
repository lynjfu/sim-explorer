#!/bin/sh
# Install the Claude Code skill user-wide (~/.claude/skills/sim-explorer), writing this folder's absolute path into it.
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$HOME/.claude/skills/sim-explorer"
mkdir -p "$DEST"
sed "s#__REPO__#$DIR#g" "$DIR/.claude/skills/sim-explorer/SKILL.md" > "$DEST/SKILL.md"
echo "installed to $DEST (repo path: $DIR)"
