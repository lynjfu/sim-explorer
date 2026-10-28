# Layout and behaviour of the explorer

This is the pattern distilled from two working explorers: a live in-browser simulation explorer for an NK model and a two-armed bandit (one tab each, parameters on the left, Reset/Step/Play/Loop/Avg, charts, a dimension strip, an event log), and a results explorer that loads precomputed sweep data from MATLAB into tabs with parameter pills and per-hypothesis panels. The template implements the first kind and adds the parts of the second that can be computed live (batch means with bands, one-parameter sweeps, CSV out, notes).

## Regions

```
┌ top bar: model name · tabs (one per model object) · hint ───────────────────────────┐
├ left (300px) ──────────┬ right ─────────────────────────────────────────────────────┤
│ Model (about text,     │ controls: Reset Step Play Loop · speed · seed · Batch [S]   │
│   Puranam mapping)     │           Sweep [param] · Copy CSV · t = 12 / 60 · readout │
│ How to read (per-chart │ charts: 1–4 cards, auto-fit grid, Chart.js                 │
│   encodings in words)  │ sweep area (hidden until a sweep runs)                     │
│ Parameters (seg /      │ state strip (~96px): glance at the current run             │
│   slider / select)     │ event log (~110px, newest line emphasised)                 │
│ Notes (localStorage)   │ csv box (hidden until Copy CSV)                            │
└────────────────────────┴────────────────────────────────────────────────────────────┘
```

At widths under 760px the two columns stack and the page scrolls.

## Why each region exists

- **About with the Puranam mapping**: a reader with no session context can tell what the agents are, what they know, how they choose, what updates. This is the text the researcher will later paste into a methods section, so it must be exact.
- **How to read**: every encoding is stated in words, every time. A reader who cannot see colour must be able to read the charts from this text alone.
- **Parameters as buttons rather than free text**: the values offered are the values the researcher will sweep, so the explorer and the production sweep share a grid. Sliders are for continuous parameters that the researcher wants to feel, not sweep.
- **Seed**: a run that showed something interesting can be replayed and shown to a co-author. The log's first line records the seed and all parameter values.
- **Step**: one period at a time with the state strip and the log line, for checking a mechanism against a hand-traced example.
- **Play / Loop**: watching many runs in succession is how the researcher learns the distribution of paths, not just the mean.
- **Batch**: mean ± 1 sd across S runs, on the same charts, so a single run can be judged against the ensemble. Final-period means are written to the log.
- **Sweep**: final-period outcome against one parameter, S runs per value, as the first look at where the interesting region is. Not a substitute for the production sweep: it uses the current values of all other parameters.
- **State strip**: the one-row picture of "where is everyone now". Default is the per-bit share of agents holding 1, with the majority value shown; sequential-reveal models box the revealed bit; bandit models show arms with pull shares.
- **Event log**: the trace a reviewer would ask for. One line per period, readable aloud.
- **Copy CSV**: batch and sweep results leave the page as text so they can be checked against MATLAB output. The artifact viewer blocks downloads, so this copies to the clipboard and shows the text.
- **Notes**: per-browser scratchpad, wrapped in try/catch; it is a convenience, not a record.

## Behaviours

| Action | Effect |
|---|---|
| Change a parameter | Stop; new seed (or the typed seed); new environment and agents; charts cleared; log shows seed and parameters; autoplay from t=1. |
| Reset | Same as above but paused. |
| Step | Pauses play, advances one period, updates charts, state strip, log, readout. If a batch or sweep is showing, starts a fresh single run first. |
| Play / Pause | Toggles. At the end of a run, Play starts a new run. |
| Loop | Runs continuously, new run after each finish, until pressed again. |
| speed | Delay between periods (left = slow). |
| Batch | Runs S independent runs headlessly; charts show mean with ±1 sd band; counter says "mean of S runs ± 1 sd"; log shows timing and final-period means; CSV becomes available. |
| Sweep | For each value of the chosen parameter, a batch of S; the sweep area shows final-period mean ± 1 sd per series against the values; log and CSV hold the table. The parameter is restored afterwards. |
| Tabs | Switch between model objects. Each has its own parameters, charts and state strip. |

## What the chrome does not do

- It does not persist results between page loads (notes only).
- It does not run production-scale sweeps. Hundreds of runs, not tens of thousands.
- It does not read external data files. If the researcher wants a results explorer over MATLAB output, that is a different page: a static page that loads JSON exported from MATLAB (`jsonencode`) and renders panels per hypothesis with parameter pills. The model contract does not cover that, and this skill should say so rather than stretch.

## Visual conventions

- Series: line style and marker first, Okabe-Ito colour second. See `figures.md`.
- Hollow markers mean a comparison or baseline series; filled markers mean the focal series.
- The state strip encodes status with a text mark or shape as well as a shade.
- Type: a sans face for the page, a monospace face for every number, so columns of digits align.
- Both light and dark themes are defined through tokens; chart text takes its colour from the tokens at build time.
