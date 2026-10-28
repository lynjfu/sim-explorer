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
