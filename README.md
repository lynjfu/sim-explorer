# sim-explorer

**Start with `1_ASSIGNMENT.md`.** It has the assignment and the questions to answer. Then `2_PROMPT.md` is what you paste into your AI assistant. Everything else here is for the assistant or the instructor.

This repository turns a simulation you have described in words into a model you can watch run, change and compare, in your browser, using whichever AI assistant you already use (Claude, ChatGPT, Gemini or another). You answer the questions in plain language; the assistant writes one small file; a fixed web page runs it, checks it and shows it. The page is the same for everyone. The model inside it is yours.

## The steps

1. **Answer the questions in `1_ASSIGNMENT.md`**, three to five sentences each. Be specific about numbers where you can (how many agents, how many choices); where you are not, say "you choose" and the assistant will pick a usual value and tell you.
2. **Open `2_PROMPT.md`, copy everything in it**, paste it into a new chat with your assistant, then paste your answers underneath. (If your assistant takes attachments, you can attach the files in `docs/` and `model.js` instead and write "follow LLM_INSTRUCTIONS.md" with your answers.)
3. **Answer its questions.** It will ask about anything you left unclear, in plain words, at most six questions, then show you a short table of what it understood. Correct anything wrong. Then it writes `model.js`.
4. **Run it.** Open the explorer page at **https://carolynjfu.com/sim-explorer/** (or `index.html` from this folder). Press **Load model** at the top right, paste the code, press **Load pasted code**. The page checks the code and says "self-check: passed" if it runs correctly. If it says "failed", click it, copy the report, and paste it back to the assistant with "please fix this".
5. **Explore.** Change parameters and watch. Press **Compare** to see with and without the AI. Compare what you expected (the last question of the assignment) with what you see.

The page keeps your pasted model in your browser, so you can close it and come back. "Use built-in model" clears it. Nothing you paste leaves your computer.

## What the page shows

Your model's parameters on the left. On the right: Step through one run a round at a time, Play it, Loop it; a chart of the system's performance over time and, where it applies, one of how different the agents are from one another, plus sometimes one about the AI; a strip showing the current state; a log with one readable line per round. Batch averages many runs. Compare runs the same batch with your AI agent switched on and off and overlays the two. Sweep varies one parameter and plots the final outcome against it. Every run has a seed, so a run that showed something can be replayed. Copy CSV takes the numbers out.

## What is in the folder

| File | What it is for |
|---|---|
| `1_ASSIGNMENT.md` | The assignment and the questions you answer. Start here. |
| `2_PROMPT.md` | Paste this whole file into your AI assistant, then your answers. Built from `docs/` plus the example model. |
| `index.html` | The explorer page. Never edited. |
| `model.js` | The built-in example model (people searching for a good project with an AI advisor). Yours replaces it. |
| `examples/ai-advisor/` | That example end to end: the written answers, the `model.js`, and the assumption list that came with it. |
| `examples/analysts-ai/` | A second example (analysts choosing among five approaches, an AI pooling everyone's results), produced from the prompt alone: the answers, the assistant's full reply, and its `model.js`. |
| `docs/LLM_INSTRUCTIONS.md`, `docs/MODEL_CONTRACT.md` | What the assistant does and what `model.js` must contain. For the assistant; you do not need to read them. |
| `docs/LAYOUT.md`, `docs/FIGURES.md` | How the page works and its chart rules. |
| `docs/researcher-*.md` | A more detailed form and question bank for researchers with existing code. |
| `scripts/` | For instructors and maintainers, below. |

## For instructors

- **Hosting.** The page is served from GitHub Pages at the link above. A fork works the same way: switch on Pages for the fork and the link becomes `https://<user>.github.io/sim-explorer/` (or the fork owner's custom domain).
- **Reading a student's model.** Open the page, Load model, paste their `model.js`. Their `about` text, assumption list and checks are in the file. The self-check tells you at once whether it runs, whether a seed reproduces, and whether their own sanity checks pass.
- **Rebuilding the prompt.** `scripts/build_prompt.sh` writes `2_PROMPT.md` from `docs/LLM_INSTRUCTIONS.md`, `docs/MODEL_CONTRACT.md` and `model.js`. Run it after editing any of them.
- **Checking a model headlessly.** `scripts/smoke_test.sh path/to/model.js` runs the page's self-check from the command line (needs `node`, or the `jsc` that ships with macOS).
- **One-file copy.** `scripts/inline_model.sh [model.js] out.html` puts the model inside the page, for emailing or publishing as a single file.
- **Claude Code.** The folder carries a skill at `.claude/skills/sim-explorer/`; in Claude Code (terminal or web) a student can open the folder and say "build my model from my answers". `scripts/install_skill.sh` installs the same skill user-wide.

The modelling vocabulary follows Puranam, Stieglitz, Osman and Pillutla (2015), "Modelling bounded rationality in organizations: progress and prospects", *Academy of Management Annals* 9(1).
