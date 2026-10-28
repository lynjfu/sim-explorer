# Chart and accessibility rules

Every chart must be readable by someone who cannot see colour at all. Colour is only ever an extra layer. These rules are binding for every series in every chart the explorer draws, and for the state strip.

1. **Encode every distinction without colour first.** Line style (solid / dashed / dotted), marker shape (circle / triangle / square / diamond), marker fill (filled vs hollow). Only then add colour. Within one chart no two series may share both dash pattern and marker.
2. **Colour comes from the Okabe-Ito tokens**, in this order: blue `#0072B2`, orange `#D55E00`, green `#009E73`, yellow `#F0E442`, sky `#56B4E9`, purple `#CC79A7`. Never red against green. The template exposes these as `--oi-*` tokens and the series `color` field takes the name.
3. **State the encoding in words, every time.** The chrome generates, for each chart, a line such as "mean over agents: solid blue line, filled circles · best agent: dashed orange line, hollow triangles", placed under the chart and in the "How to read" block. It is built from the series fields, so fill `label`, `dash`, `marker`, `hollow`, `color` for every series. Do not rely on the Chart.js legend alone.
4. **Focal vs comparison.** The focal series is a solid line with filled markers; a baseline, counterfactual or reference series is dashed with hollow markers. When overlaying a live run on reported values, the reported values are large hollow markers without a line.
5. **Batch bands.** The ±1 sd band is a light fill of the series colour at low opacity, with no border; it is excluded from the legend and tooltip. Say "mean ± 1 sd" in the counter and the sweep title, never "confidence interval".
6. **Axes to scale.** Fixed y ranges per chart (`yMin`, `yMax`) so a run and its batch are comparable. Shares and normalised fitness run 0 to 1. Counts get their natural maximum (M agents, N bits).
7. **Markers thinned.** On period charts, markers appear on roughly every twelfth point so dashes and shapes stay legible; on sweep charts every point gets a marker.
8. **No judgment colours** (good/bad, match/differ) unless the researcher asks. If asked, keep the judgment in marks (✓ / ✗) and grey shading, with the rule stated in words.
9. **State strip**: a status is shown by a text mark or shape and a shade together, never a shade alone. Example: a defected agent is a hollow cell with "✗"; an agent at the presenter's value is a filled cell with "1".
10. **Check in greyscale.** Before delivering, imagine every chart with colour removed. If any two series become indistinguishable, fix the dash or marker, not the palette.

## Series spec quick reference

| Role | dash | marker | hollow | colour |
|---|---|---|---|---|
| first focal series | `[]` | circle | false | blue |
| second focal series | `[]` | rect | false | green |
| comparison of the first | `[6,3]` | triangle | true | orange |
| comparison of the second | `[2,3]` | rectRot | true | purple |

## Chart choice

- Period charts (x = period) for anything that evolves: fitness, shares, survivors, pull rates, belief error.
- A per-period rate that is 0 or 1 in a single run (an agent's arm choice) is fine; in batch it becomes a probability.
- Terminal outcomes (success, reach) are recorded as a series frozen at the final value so the sweep reports them.
- Keep to two to four charts. If the researcher wants more, ask which two matter for the question stated in `about`.
