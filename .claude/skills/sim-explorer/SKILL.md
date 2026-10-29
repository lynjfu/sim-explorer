---
name: sim-explorer
description: Turn a described agent-based simulation (answers to 1_ASSIGNMENT.md, a memo, a Puranam four-stage spec, or existing MATLAB/Python code) into a model.js that runs in the sim-explorer page, a fixed interactive HTML explorer with parameters, Step/Play/Loop, charts, Batch, Compare (AI on vs off) and Sweep on a seeded RNG. Use whenever someone wants to "see my model run", "build my model", "an explorer", "an interactive version", "step through it", or hands over answers to the assignment. With no material at all, it is the maintainer's jump-back command.
---

# sim-explorer (Claude Code wrapper)

The repository root is three directories above this file when the skill is loaded from the repository, or `__REPO__` when it was installed user-wide by `scripts/install_skill.sh`. Call it `$REPO` below.

## Bare invocation: orient the maintainer

If invoked with no model material (no answers, memo, spec, code or request to build) and `$REPO/project_log.md` exists, this is the maintainer's jump-back command. Read that log and give a concise bullet summary: the most recent decisions and why, the current state of the page and documents, open items and what is next. No preamble. Then ask whether to continue or change direction. After each substantive session on the project itself, append a dated entry to that log. If the log does not exist (a student's copy), skip this and proceed below.

## Building a model

1. Read `$REPO/docs/LLM_INSTRUCTIONS.md` and `$REPO/docs/MODEL_CONTRACT.md` in full, and `$REPO/model.js` as the worked example. Follow the instructions exactly: fill the card, ask at most six plain-language questions, confirm the card, write one `model.js`. Everything there applies here, with these additions for Claude Code.
2. If the user has existing code (MATLAB, Python, R), the code is the authority on mechanics and their prose is the authority on intent. Keep parameter names identical to the code so the two can be compared line by line.
3. **Where the file goes.** Write `model.js` into the user's project folder (or the repository, if they are working in it). If no location was given, ask. Never write it to a scratch or session-output path.
4. **Verify, then say exactly what you verified.** Run `$REPO/scripts/smoke_test.sh path/to/model.js`. It runs the page's own self-check headlessly, including the model's `checks`. Report the lines it printed, with numbers. If the reference code can be run, run one condition in both and report both numbers, the seed and the run counts; expect agreement within sampling error, not bit for bit. Never report a number you did not compute; if a check was skipped, say so.
5. **Show it.** `open "$REPO/index.html"` runs the built-in model; to run theirs, either copy their `model.js` over `$REPO/model.js` in a copy of the folder, or make a one-file copy: `$REPO/scripts/inline_model.sh path/to/model.js out.html` and open that. For a shareable link, add `--artifact` and publish the result as a Claude artifact.
6. **Record.** If the user's project keeps a `project_log.md` or `project_state.md`, append a dated entry with the assumptions, the `// CHOICE:` list and the verification numbers.

## Iterating

Change only `model.js`, and only what the user changed. For a second version side by side, add a second model object and list both in `MODELS`; the page shows tabs. Keep a short decision log in the delivery message or the project record so the sequence of versions can be reconstructed.

## Files

| File | Read when |
|---|---|
| `$REPO/docs/LLM_INSTRUCTIONS.md` | Always: intake, questions, card, build rules, delivery |
| `$REPO/docs/MODEL_CONTRACT.md` | Writing `model.js` |
| `$REPO/model.js`, `$REPO/examples/ai-advisor/` | The worked example: answers, model, assumption list |
| `$REPO/scripts/` | smoke_test, inline_model, build_prompt, install_skill |
