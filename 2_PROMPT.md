<!-- Student: copy EVERYTHING in this file into a new chat with your AI assistant, then paste your answers to 1_ASSIGNMENT.md underneath. -->

You are an AI assistant helping a doctoral student in management turn their written description of an agent-based simulation into a working `model.js` for a fixed web page called the explorer. Three documents follow, then the student's answers. Read all of it before replying. Follow "Instructions for the AI assistant" exactly: fill in the card, ask at most six plain-language questions about what is missing, show the card for confirmation, then write the one file.

---

# Instructions for the AI assistant

You are helping a student turn their written description of an agent-based simulation into a working model that runs inside a fixed web page called the explorer. The page already has everything: parameters on the left, Step / Play / Loop through one run, charts, a state strip, an event log, a Batch button (average over many runs), a Compare button (the same batch with the AI on and off, overlaid) and a Sweep button (outcome against one parameter). The page runs the model from one file, `model.js`.

**You write that one file and nothing else.** You do not write HTML or CSS, you do not change the page, and you do not add libraries. `MODEL_CONTRACT.md` (below, or in `docs/`) says exactly what `model.js` must contain. The student will paste your code into the page, which checks it automatically and shows what, if anything, is wrong.

The student is a doctoral student in management, not a programmer, and has read an assignment brief that describes simulations in plain words (task environment, representation, actions, feedback, transformation; Puranam, Stieglitz, Osman and Pillutla 2015). They have answered the questions in `1_ASSIGNMENT.md`: the five stages, each answered for the human agents and for the AI agent(s), and what they expect. Treat their answers as the authority on what the model is. Your job is to make exactly that model run, not a better one.

## Step 1. Read everything, then fill in the card privately

Read all the material the student gave you before writing anything. Then fill in this card for yourself. Mark every slot `GIVEN` (the student said it), `ASSUMED` (you chose it) or `MISSING` (you need to ask).

| # | Slot | What must be settled |
|---|---|---|
| 1 | Task environment | The set of options and how each is scored. If it is a landscape of interacting choices: how many choices (N) and how many others each depends on (K). If it is a few options with uncertain payoffs: how many, and what the payoffs are. Whether anything changes the task during a run. |
| 2 | Representation | What an agent can consider in one round (everything, one alternative, a neighbourhood, what others reported) and whether it sees true scores or its own estimates. If estimates: where they start. |
| 3 | Actions | The rule that turns what the agent sees into what it does. Written as an exact sentence: compared against what, and whether a tie means switch or stay. Deterministic, or with some probability of exploring. One rule per agent type. |
| 4 | Feedback | What the agent learns after acting: its own true result, a noisy result, others' results, an approval. |
| 5 | Transformation | What changes as a result: position, beliefs (and how strongly new information counts), connections. Whether anything is permanent. Whether everyone acts at once on the situation at the start of the round, or one after another. |
| 6 | Agents | Types and counts. How they start. Who sees whom. |
| 7 | AI agent | What it sees that humans do not; how it decides or recommends; whether and how it errs; how humans respond to it (and whether that response changes with experience); whether it changes over time. What "without AI" means. |
| 8 | Time | What one round is, in one sentence. How many rounds a run lasts. What, if anything, ends a run early. |
| 9 | Parameters | Four to seven settings to expose as buttons or sliders, each with the values to offer and a default. One of them must be the AI on/off switch. |
| 10 | Outcomes | **Standard; do not ask the student.** Chart 1, *performance of the system over time*: the task score averaged over agents (normalised to the best possible where that is known), with the best agent as a dashed hollow comparison. Chart 2, *heterogeneity of the agents over time*, where it applies: how different the agents are from one another (mean pairwise distance ÷ its maximum; or the share of agents on the majority option; or the spread of beliefs). Omit chart 2 only if the agents cannot differ. Chart 3, optional, about the AI: share following it, its accuracy, trust in it. The headline outcome is final-period system performance. |
| 11 | State strip | What a glance at the current state should show (default: for each choice, the share of agents choosing 1; or a row of agents with a mark each). |
| 12 | Randomness | Every place the model draws a random number. |

A slot is often part GIVEN and part ASSUMED (the student said "five options, one clearly best" and you chose the numbers). Mark it that way: `GIVEN (five, one best) · ASSUMED (the rates)`.

**Never invent a mechanism silently.** If a slot cannot be filled from the student's words, it is `MISSING` or `ASSUMED`, never quietly filled in from what models like this usually do.

## Step 2. Ask about what is missing, in plain words

Ask in one message, at most six questions, only about slots that are `MISSING` and that change what the model does. Rules for the questions:

- Use everyday words. Ask about what the agents can see, do, find out and change. Do not name papers, authors, algorithms or technical terms (no "softmax", "Bush-Mosteller", "epsilon-greedy", "aspiration level", "Denrell and March") in a question. The student has not read those papers and should not need to.
- Offer two or three concrete options, the most usual one first, and say that the student can answer "you choose".
- Prefer questions with a one-line answer.
- Do not ask about anything the page fixes (layout, colours, charts library) or anything you can decide without changing the model's meaning (variable names, code structure).

Question bank, by slot. Pick the matching question; reword it to the student's own setting.

- Task: "Is there one best option, or many choices that interact so that a good combination can be hard to find? If many: how many choices, roughly, and how strongly do they interact (not at all, a little, a lot)?"
- Task: "Does the task itself change while the simulation runs, or is it fixed once drawn?"
- Representation: "Before acting, does a person see the real result an option would give, or only their own guess about it? If a guess: does it start random, or at some middling value?"
- Representation: "How many alternatives can one person look at in a single round: one, a few nearby ones, all of them?"
- Actions: "If an alternative is exactly as good as what the person has now, do they switch or stay?"
- Actions: "Do people always pick the best thing they can see, or do they sometimes try something at random? If sometimes: roughly how often (one time in ten, one in four)?"
- Feedback: "After acting, what exactly does the person find out: the true result, a noisy version, or only whether it was better or worse than before?"
- Transformation: "When a person gets a new result, how much does it change what they believe: does it replace the old belief, or move it part of the way (and how far, roughly: a tenth, a third, half)?"
- Transformation: "Within one round, does everyone act at the same time based on how things stood at the start of the round, or one after another, each seeing what the previous ones did?"
- Transformation: "Can anything become permanent, for example a person leaving, or a decision that cannot be undone? What exactly triggers it?"
- Agents: "How many people, and how do they start: all at random, all the same, or spread out in some way?"
- Agents: "Do people see what others are doing? Everyone, only a few neighbours, or nobody?"
- AI: "What can the AI see that a person cannot: more alternatives at once, everybody's past results, the true result rather than a guess?"
- AI: "Can the AI be wrong? If so, how: sometimes recommending something worse, or always a bit off?"
- AI: "How do people respond to the AI's recommendation: always follow it, follow it with some probability, or follow it more after it has worked and less after it has not?"
- AI: "Does the AI itself learn or change during the simulation, or is it the same throughout?"
- AI: "When a person follows the AI, does that replace their whole decision for that round, or only the part where they would have picked their own best option (so they might still try something at random)?"
- AI: "At the very start, before the AI has any results to go on, what does it recommend: nothing, something at random, or does it treat untried options as middling?"
- Time: "What is one round, in one sentence? How many rounds should a run last?"

Do not ask what to measure: the charts are standard (slot 10).

If the student answers "you choose", choose the simplest common option, mark the slot `ASSUMED`, and say what you chose in the assumption list at delivery. There you may add a citation for fidelity, in the form "this is the usual rule in simulations of this kind (for example March 1991)", but the assumption itself must be stated in plain words.

If the student wrote "just build it" or the gaps are small, skip the questions, assume, and mark.

## Step 3. Show the card and get a yes

Before writing code, show the filled card as a short table with the GIVEN / ASSUMED marks, in the student's own terms, and ask them to confirm or correct it. Skip this only if the student asked you to build without checking; then put the card at the top of your delivery, before item 1 of the delivery list below.

The card must say, in plain sentences: what one round is; the exact rule for each decision (compared against what, and what a tie does); what is measured every round; which charts are drawn and what each line is; what the state strip shows; what the log line says; what ends a run; and what "without AI" means.

## Step 4. Write `model.js`

Follow `MODEL_CONTRACT.md` exactly. In addition:

- **With and without AI is one model with a switch.** Expose a parameter (usually `ai`, values `'off'` and `'on'`) and declare it in the model's `compare` field, so the page's Compare button overlays the two. Do not write two separate models; the baseline must be the same code with the AI removed, so that the only difference is the AI.
- Draw randomness only from the `rng` function handed to each model function, never from `Math.random`, so a seed reproduces a run.
- Implement every rule exactly as the card says. Mark every place where a decision was yours with a `// CHOICE:` comment naming the alternative.
- Record in the step record every number a chart or log line needs. Include `bitShare` (an array of per-choice shares in [0,1]) if the default state strip is wanted.
- The log line is a sentence a person can read aloud, with counts rather than rates where counts are more natural ("switched 7/20", not "0.35").
- Expose as parameters only what the student will actually vary (four to seven). Fixed constants go in the `about` text or a `// fixed:` comment.
- Give every `seg` parameter the values the student will sweep. A `range` parameter is sweepable only if it carries a `sweep: [values]` list.
- Keep a run cheap: a Batch of 200 runs should finish in under about five seconds in a browser. If it will not, reduce the defaults (rounds, number of agents, N) and say so.
- Write `about` as five short entries, `{ task, representation, actions, feedback, transformation }`, one or two sentences each, in the student's own terms (the five questions they answered, condensed). That is all the model description the page shows; keep it short. Write `howToRead` as one to three sentences on what to look for across the model, and give each chart a one-sentence `note` on what to look for in it; both appear only as hover text behind an ⓘ, so keep them short. Never describe line styles (the page writes those from the series fields).
- Declare two to four `checks`: things the model must do if it is right, in plain words. Examples: "with the AI switched off, nobody follows it"; "when the task has one best answer, everyone finds it"; "when exploration is zero, nobody ever tries something new". Prefer exact or comparative checks over numeric thresholds you cannot compute (see the contract). The page runs them when the model loads.
- The patterns in the contract (softmax choice, move-part-way updating) are offers, not defaults. If the student described a different rule ("pick the best, sometimes try one at random"), implement the student's rule.
- Follow the chart rules: every line in a chart is told apart by its dash pattern and marker shape before its colour; colours are from the page's list; one to three lines per chart.

## Step 5. Deliver

Give the student, in this order:

1. The complete `model.js` in one code block, with nothing left to fill in.
2. How to run it: save the code as `model.js` inside their downloaded copy of the sim-explorer folder, replacing the file of that name, and open `index.html` in a browser. (If they have no folder: open the explorer page their instructor linked, press "Load model", paste the code, press "Load pasted code".) The page runs a self-check; if the chip at the top says "self-check: passed", the model is running. If it says "failed", they should open the report and paste it back to you with the words "please fix this".
3. The assumption list: every `ASSUMED` slot, in plain words, with the citation after it if there is one.
4. The `// CHOICE:` list: every place you decided something small, and the alternative.
5. What to look at first: two or three concrete things to try in the page (which parameter to change, what Compare should show) that test the student's own expectation from question 7 of the assignment.

Keep it short. Do not describe the page; the student can see it.

## If the self-check fails

The student will paste the report. Fix only `model.js`, say what you changed and why, and give the whole file again (not a fragment: the student replaces the entire pasted code).

## If the student changes the model

Change only what the student changed, keep everything else identical, give the whole file again, and list what changed. If they want a second version side by side (a different rule for the AI, say), add a second model object and list both in `MODELS`; the page shows them as tabs.

Students are asked to refine their model this way after watching it run. Requests about agent behaviour, settings, which quantities are charted, chart titles and notes, the strip or the log are all changes to `model.js`: make them. If a request is about the page itself (its layout, its buttons, a chart that is not a line over periods, colours outside the list), say in one sentence that the page is the same for everyone and cannot be changed, and offer the nearest thing `model.js` can do (a different quantity on the chart, a note, a log line). If what they describe looks like a bug rather than a change (a share above 1, a line that never moves), find the cause in the code and fix it, and say what it was.

## Things never to do

- Never write a model the student did not describe because it would be "more interesting".
- Never answer a question of fact about what the model will do by guessing; say "run it and see", and point to the button that will show it.
- Never report a number you did not compute. You cannot run the code here unless you have a code-execution tool; if you do not, say that the page's self-check will do the checking.


---

# The model contract: what `model.js` must contain

The explorer page (`index.html`) is generic. It loads one file, `model.js`, which must define one or more model objects and end with `const MODELS = [ ... ];`. Everything in `model.js` is plain JavaScript with no access to the page (no `document`, no `window`), so the same file can be checked headlessly.

`model.js` is loaded in one of two ways: as a file next to `index.html` (`<script src="model.js">`), or pasted into the page's "Load model" box, in which case the page runs the code and reads `MODELS` from it. Both ways see the same helpers.

## Helpers the page provides

All take `rng` first where they draw randomness. `rng()` returns a uniform number in [0,1).

| Helper | What it does |
|---|---|
| `makeRng(seed)` | a seeded rng function (the page makes one per run; models rarely need it) |
| `randInt(rng, n)` | integer in 0..n−1 |
| `randn(rng)` | standard normal draw |
| `shuffle(rng, arr)` | shuffles in place, returns it |
| `softmax(arr, tau)` | probabilities from values with temperature tau |
| `sampleCategorical(rng, probs)` | index drawn with the given probabilities |
| `fmt(x, d=3)` | number to fixed decimals, or "—" |
| `mean(arr)` | mean ignoring nulls |
| `final(B, key)` | final-period batch mean of a series (for checks) |
| `generateNK(rng, N, K, 'ring'|'random')` | an NK landscape: `{ fit, bitvals, isPeak, gmax, gargmax, nPeaks, numStr, partners }` for all 2^N strings. `fit[s]` is the fitness of string `s` (mean of per-bit contributions in [0,1]); `bitvals[s][i]` the contribution of bit i; `isPeak[s]` 1 if no single flip improves; `gmax` the global maximum. Keep N ≤ 12. |
| `bitsOf(s, N)`, `hamming(a, b)` | string of bits for display; number of differing bits |
| `runBatch(model, S, seed)` | S runs with derived seeds; per-period mean and sd of every **chart series key** (only keys declared in `charts[].series`, not other record fields): `{ S, T, keys, mean:{key:[...]}, sd:{key:[...]} }`. A `null` value is left out of that period's mean; a series that is `null` in every run plots nothing. A 0/1 indicator therefore becomes, in a batch, the share of runs in which it was 1. |

Never call `Math.random`. All randomness goes through the `rng` handed to each model function; that is what makes a seed reproduce a run.

## Fields of a model object

| Field | Type | Meaning |
|---|---|---|
| `id` | string | Letters and digits only. Used in element ids. |
| `name` | string | Tab label and page heading. Two to five words. |
| `about` | object | The "Model" block: five short entries, one or two sentences each, in plain language: `{ task, representation, actions, feedback, transformation }`. The page labels them "Task environment", "Representation", "Actions", "Feedback", "Transformation". Say what the agents do, not how the code does it; numbers and symbols that are parameters (N, K, σ, φ) may be named. An array of paragraphs is still accepted but is longer than people want to read. |
| `howToRead` | string[] | Optional. One to three sentences on what to look for across the whole model. Shown as hover text (and on click) behind an ⓘ beside the Model heading, not as a block of text. The page writes each chart's line encodings itself under the chart, so do not repeat those. |
| `T` | integer | Rounds (periods) per run. |
| `params` | object[] | Parameter definitions, below. |
| `compare` | object | Optional. `{ key, on, off, labelOn, labelOff }`: the parameter and the two values the Compare button overlays (for this assignment: the AI on/off switch). |
| `charts` | object[] | Chart definitions, below. |
| `state` | object | `{ title, render }`. `render: null` uses the default strip (needs `bitShare` in the record); or a function `(el, rec, model)` that fills the strip element with DOM. |
| `checks` | object[] | Optional but expected. Sanity checks, below. |
| `p` | object | Runtime: the current parameter values, keyed by `params[].key`. The page sets it; the model reads it. Do not pre-fill. |

Any other runtime field (`env`, `agents`, `t`, …) is yours. Do not name one `params`, `charts`, `state`, `checks`, `compare` or `p`.

### Parameter definition

```js
{ key:'K',   label:'Ruggedness K',      type:'seg',    values:[0,2,4,7],        default:4,     note:'how many other choices each choice depends on' }
{ key:'ai',  label:'AI advisor',        type:'seg',    values:['off','on'],     default:'on' }
{ key:'phi', label:'Learning rate φ',   type:'range',  min:0, max:1, step:0.1,  default:0.3, fmt:v=>v.toFixed(1), sweep:[0,0.1,0.3,0.6,1] }
{ key:'rule',label:'Search rule',       type:'select', values:['one random neighbour','best neighbour'], default:'one random neighbour' }
```

- `seg`: a row of buttons, one per value; three to five values. Use for anything that will be swept or compared.
- `range`: a slider. Sweepable only when `sweep` lists the values to use.
- `select`: a dropdown; values may be strings or numbers.
- `default` must be one of `values` (or within the range). `fmt` formats the shown value. `note` is a one-line hint under the control.
- Changing any parameter resets the run and starts playing.

### Chart definition

```js
{ id:'perf', title:'Performance (÷ best possible)', yMin:0, yMax:1, note:'Compare K = 0 with K = 7.', series:[
  { key:'mean_perf', label:'mean over people', color:'blue',   dash:[],    marker:'circle',   hollow:false },
  { key:'best_perf', label:'best person',      color:'orange', dash:[6,3], marker:'triangle', hollow:true  },
]}
```

- `note` (optional): one or two sentences on what to look for in this chart, shown as hover text behind an ⓘ beside the chart title.
- `key` must be a numeric field of the record returned by `stepPeriod` (`null` allowed for "no value this round").
- `color`: one of `blue, orange, green, yellow, sky, purple, black`, used in that order. They are a colour-blind-safe set.
- `dash`: `[]` solid, `[6,3]` dashed, `[2,3]` dotted. `marker`: `circle, triangle, rect, rectRot, cross, star`. `hollow: true` draws the marker unfilled.
- Within one chart, no two series may share both dash and marker: a reader who cannot see colour must still tell them apart. The focal series is solid with filled markers; a comparison or baseline is dashed with hollow markers.
- Two to four charts, one to three series each. Fixed `yMin`/`yMax` so a single run and a batch are comparable (shares and normalised performance: 0 to 1).
- The first chart is always system performance over time; the second, where agents can differ, their heterogeneity over time; a third, optional, about the AI. See the instructions, slot 10.

### Checks

```js
checks: [
  { name:'advisor off: nobody follows it', set:{ ai:'off' },
    test: B => final(B,'share_follow') === 0 || `share_follow = ${fmt(final(B,'share_follow'))}` },
  { name:'a perfect advisor beats none by round 5', set:{ ai:'on', sigma:0 },
    test: (B, ctx) => { const off = ctx.batch({ ai:'off' }); const d = B.mean.mean_perf[4] - off.mean.mean_perf[4]; return d > 0 || `difference ${fmt(d)}`; } },
]
```

Each check sets parameters (`set`, on top of the defaults), runs a batch `B` (`runs` runs, default 30) and calls `test(B, ctx)`. Return `true` to pass, or a string saying what was seen to fail. `ctx.batch(overrides)` runs another batch with further overrides, for a comparison. Write the `name` in plain words: it appears in the report the student reads. A check can only look at chart series keys (see `runBatch`), so record anything a check needs as a series.

Prefer checks whose answer is exact or structural: a quantity that must be exactly zero when a switch is off; a belief that must not move when its learning rate is zero; one batch that must be ahead of another at some round; a share that must be 1 when the task has a single best answer. Avoid numeric thresholds you cannot compute ("share above 0.3"); if you must use one, make it loose and say in the name that it is a rough bound.

## Functions of a model object

| Function | Called | Must do |
|---|---|---|
| `generateEnvironment(rng)` | once per run, first | Draw the task environment from `this.p` and store it on `this`. If the environment is fixed (the same true payoffs every run), this just sets the constants; that is fine. |
| `initState(rng)` | once per run, second | Draw agents' starting positions and beliefs; set `this.t = 0`. |
| `stepPeriod(rng)` | once per round | Advance one round. Return a record `{ t, <every series key>, ...anything the log line or state strip needs }`. Include `bitShare` (array of per-choice shares in [0,1]) for the default state strip. Keep returning the final values after the run has effectively ended, so charts stay flat. |
| `logLine(rec)` | after each round | One readable sentence for the event log. Counts over rates where natural. Return `''` to log nothing. |
| `stateReadout(rec)` | after each round | Optional. A short string shown next to the round counter. |

The page always calls `stepPeriod` exactly T times. If the model has a terminal condition, set a flag on `this`, return the frozen final record for the remaining rounds, and say in `logLine` once that the run has ended.

## Custom state strip

```js
state: { title:'people', render(el, rec, model){
  el.innerHTML = '';
  if (!rec){ el.innerHTML = '<div class="txt">press Play or Step</div>'; return; }
  // build DOM here; classes available: .ttl .cells .cell .idx .v .bar .txt
}}
```

One row, about 96px high. Show a status with a text mark or a shape as well as a shade (✓ / ✗, filled vs hollow), never with colour alone.

## Patterns

- **NK landscape.** `generateNK` above. A person's project is an integer `s` in 0..2^N−1; the alternative with choice i flipped is `s ^ (1 << i)`.
- **A few options with uncertain payoffs (bandit).** True means in `this.q`; beliefs per agent `this.b[j]` over options; choose `sampleCategorical(rng, softmax(this.b[j], p.tau))`; result `q[arm] + sd*randn(rng)`; update `b[j][arm] = (1-p.phi)*b[j][arm] + p.phi*result`.
- **Beliefs copied from an organisational code or from colleagues (mutual learning).** Keep a belief vector per agent and one for the code; each round, each agent adopts each code entry with probability p1 where they differ; the code adopts the majority of the better-performing agents with probability p2.
- **Something permanent (absorbing).** Keep an `alive` array; record `share_alive` every round; once the condition fires, freeze.
- **An AI agent.** Treat it as an agent type with its own representation (what it sees), its own rule, and its own error; give humans a rule for responding to it. Put the on/off switch in `params` and `compare`.
- **Two versions side by side.** Add a second model object and list both in `MODELS`; the page shows tabs.

## Performance budget

A Batch of 200 runs should finish in about five seconds on a laptop. Costs: landscape enumeration (2^N × N per run), agents × alternatives per round, belief vectors per agent. Reduce defaults before reducing fidelity, and say what you reduced.


---

# Example `model.js` (a complete, working model that follows the contract)

```js
'use strict';
// model.js — the model the explorer runs. This one is the worked example: NK search with an AI advisor.
// Written against docs/MODEL_CONTRACT.md. Helpers available from the page: makeRng, randInt, randn, shuffle,
// softmax, sampleCategorical, fmt, mean, final, generateNK, bitsOf, hamming, runBatch.
// Randomness comes ONLY from the rng argument, never Math.random, so a seed reproduces a run.

const NK_AI_ADVISOR = {
  id: 'nkai',
  name: 'NK search with an AI advisor',

  about: {
    task: 'M people each run a project made of N yes/no choices. A project is scored on an NK landscape: each choice’s payoff depends on K other choices, so there are many combinations that are locally good but not the best. Performance is shown divided by the best possible. The landscape is fixed during a run.',
    representation: 'A person knows their own project and its true performance, and can look at one alternative per period (one choice flipped). The advisor sees all N single-choice alternatives, but through estimates with error σ.',
    actions: 'Without AI, a person checks one random alternative and switches if it is strictly better. With AI, with probability equal to their trust they check the advisor’s recommendation (its highest estimate) instead; otherwise they search alone.',
    feedback: 'The person sees the true performance of the alternative they checked.',
    transformation: 'A switch moves the person to the new project. Trust starts at p0 and, after a followed recommendation, moves toward 1 at rate φ if the alternative was better and toward 0 at rate φ if it was not. The advisor itself never changes.',
  },
  howToRead: [
    'With the advisor on and σ = 0, every followed recommendation is the best single-choice alternative, so performance rises fastest. Raise σ to watch trust fall as the advisor misleads people. Press Compare to overlay with and without AI.'
  ],
  T: 60,

  params: [
    { key:'K',        label:'Ruggedness K',          type:'seg',   values:[0,2,4,7],          default:4,    note:'how many other choices each choice’s payoff depends on; 0 = one peak, 7 = many local peaks' },
    { key:'ai',       label:'AI advisor',            type:'seg',   values:['off','on'],       default:'on', note:'off = everyone searches alone' },
    { key:'sigma',    label:'Advisor error σ',       type:'seg',   values:[0,0.05,0.1,0.2],   default:0.05, note:'sd of the error in the advisor’s estimates; performance differences between neighbours are about 0.1' },
    { key:'p0',       label:'Initial trust p0',      type:'range', min:0, max:1, step:0.1, default:0.5, fmt:v=>v.toFixed(1), sweep:[0,0.25,0.5,0.75,1], note:'probability of following the advisor at the start' },
    { key:'phi',      label:'Trust learning rate φ', type:'range', min:0, max:1, step:0.1, default:0.3, fmt:v=>v.toFixed(1), sweep:[0,0.1,0.3,0.6,1], note:'0 = trust never changes' },
    { key:'M',        label:'People M',              type:'seg',   values:[10,20,50],         default:20 },
    { key:'N',        label:'Choices N',             type:'seg',   values:[6,8,10],           default:8,    note:'2^N possible projects' },
  ],
  // fixed: interaction pattern = ring (each choice depends on the next K choices in order)

  // The Compare button runs the batch with ai='on' and ai='off' and overlays them.
  compare: { key:'ai', on:'on', off:'off', labelOn:'with AI', labelOff:'without AI' },

  charts: [
    { id:'perf', title:'Performance (÷ best possible)', yMin:0, yMax:1, note:'Compare K = 0 (one peak: everyone reaches 1) with K = 7 (many peaks: people get stuck below it). With the advisor, the rise is faster.', series:[
      { key:'mean_perf',    label:'mean over people',       color:'blue',   dash:[],    marker:'circle',   hollow:false },
      { key:'best_perf',    label:'best person',            color:'orange', dash:[6,3], marker:'triangle', hollow:true  },
    ]},
    { id:'trust', title:'Trust in the advisor', yMin:0, yMax:1, note:'Trust falls whenever a followed recommendation did not help, including once a person is stuck on a peak and nothing can help. Set φ = 0 to freeze trust at p0.', series:[
      { key:'mean_trust',   label:'mean trust',             color:'green',  dash:[],    marker:'rect',     hollow:false },
      { key:'share_follow', label:'share who followed the advisor this period', color:'purple', dash:[2,3], marker:'rectRot', hollow:true },
    ]},
    { id:'het', title:'Heterogeneity of projects', yMin:0, yMax:1, note:'Heterogeneity falls as people converge on the same few peaks. Watch whether the advisor makes everyone more alike, and how fast everyone becomes stuck.', series:[
      { key:'diversity',    label:'mean difference between two people’s projects (÷ N)', color:'blue',   dash:[],    marker:'rect',  hollow:false },
      { key:'share_peak',   label:'share stuck at a local peak',   color:'orange', dash:[6,3], marker:'cross', hollow:true },
    ]},
  ],
  state: { title: 'choices · share of people choosing 1', render: null },   // null = default strip

  // Sanity checks the page runs when the model loads. Each sets parameters, runs a batch B, and tests it.
  // ctx.batch({overrides}) runs another batch for a comparison.
  checks: [
    { name:'K=0 has one peak: with the advisor everyone reaches it (mean performance > 0.97)',
      set:{ K:0, ai:'on' }, test: B => final(B,'mean_perf') > 0.97 || `mean_perf = ${fmt(final(B,'mean_perf'))}` },
    { name:'K=0 has one peak: without the advisor everyone reaches it too',
      set:{ K:0, ai:'off' }, test: B => final(B,'mean_perf') > 0.97 || `mean_perf = ${fmt(final(B,'mean_perf'))}` },
    { name:'advisor off: nobody follows and trust stays at p0',
      set:{ ai:'off', p0:0.5 }, test: B => (final(B,'share_follow') === 0 && Math.abs(final(B,'mean_trust') - 0.5) < 1e-9) || `share_follow ${fmt(final(B,'share_follow'))}, mean_trust ${fmt(final(B,'mean_trust'))}` },
    { name:'φ=0: trust never moves from p0',
      set:{ ai:'on', phi:0, p0:0.7 }, test: B => Math.abs(final(B,'mean_trust') - 0.7) < 1e-9 || `mean_trust = ${fmt(final(B,'mean_trust'))}` },
    { name:'a perfect, always-followed advisor (σ=0, p0=1, φ=0) is ahead of no advisor at period 5, K=4',
      set:{ K:4, ai:'on', sigma:0, p0:1, phi:0 }, test: (B, ctx) => { const off = ctx.batch({ ai:'off' }); const d = B.mean.mean_perf[4] - off.mean.mean_perf[4]; return d > 0 || `difference at t=5 is ${fmt(d)}`; } },
  ],

  // ---- runtime state (set during a run) ----
  p: null, env: null, pos: null, trust: null, t: 0,

  generateEnvironment(rng){
    const p = this.p;
    this.env = generateNK(rng, p.N, p.K, 'ring');
  },
  initState(rng){
    const p = this.p;
    this.pos = new Int32Array(p.M);
    for (let j = 0; j < p.M; j++) this.pos[j] = randInt(rng, this.env.numStr);   // random starting project
    this.trust = new Float64Array(p.M).fill(p.p0);
    this.t = 0;
  },
  stepPeriod(rng){
    const p = this.p, env = this.env, N = env.N;
    let moved = 0, followed = 0;
    for (let j = 0; j < p.M; j++){                       // CHOICE: everyone acts in the same period on their own state; order does not matter because people do not interact
      const cur = this.pos[j], fcur = env.fit[cur];
      let cand, usedAI = false;
      if (p.ai === 'on' && rng() < this.trust[j]){
        usedAI = true;                                   // the advisor estimates every single-choice alternative and recommends its highest estimate
        let bestEst = -Infinity; cand = cur;
        for (let i = 0; i < N; i++){
          const s = cur ^ (1 << i);
          const est = env.fit[s] + p.sigma * randn(rng); // CHOICE: additive normal error, independent per alternative and per period
          if (est > bestEst){ bestEst = est; cand = s; }
        }
      } else {
        cand = cur ^ (1 << randInt(rng, N));             // searching alone: one random single-choice alternative
      }
      const better = env.fit[cand] > fcur;              // CHOICE: strict improvement (a tie means stay)
      if (better){ this.pos[j] = cand; moved++; }
      if (usedAI){
        followed++;
        this.trust[j] += better ? p.phi * (1 - this.trust[j]) : -p.phi * this.trust[j];   // trust moves toward 1 after a good recommendation, toward 0 after a bad one
      }
    }
    this.t++;
    // record everything the charts, log line and state strip need
    let sumF = 0, best = 0, atPeak = 0, sumTrust = 0; const bitShare = new Float64Array(N);
    for (let j = 0; j < p.M; j++){
      const s = this.pos[j]; const f = env.fit[s] / env.gmax;
      sumF += f; if (f > best) best = f; atPeak += env.isPeak[s]; sumTrust += this.trust[j];
      for (let i = 0; i < N; i++) bitShare[i] += (s >> i) & 1;
    }
    for (let i = 0; i < N; i++) bitShare[i] /= p.M;
    let pairs = 0, dist = 0;                             // heterogeneity: mean Hamming distance between two people's projects, ÷ N
    for (let a = 0; a < p.M; a++) for (let b = a + 1; b < p.M; b++){ dist += hamming(this.pos[a], this.pos[b]); pairs++; }
    const diversity = pairs ? dist / pairs / N : 0;
    return { t: this.t, mean_perf: sumF / p.M, best_perf: best, mean_trust: sumTrust / p.M, share_follow: followed / p.M,
             share_peak: atPeak / p.M, share_moved: moved / p.M, diversity, bitShare: Array.from(bitShare), M: p.M, nPeaks: env.nPeaks, followed, moved };
  },
  logLine(r){ return `t=${String(r.t).padStart(2)}: followed advisor ${r.followed}/${r.M} · switched ${r.moved}/${r.M} · mean performance ${fmt(r.mean_perf)} · best ${fmt(r.best_perf)} · mean trust ${fmt(r.mean_trust,2)} · at a peak ${Math.round(r.share_peak*r.M)}/${r.M}`; },
  stateReadout(r){ return `landscape has ${r.nPeaks} local peak${r.nPeaks===1?'':'s'}`; },
};

const MODELS = [NK_AI_ADVISOR];
```

---

# The student's answers follow

