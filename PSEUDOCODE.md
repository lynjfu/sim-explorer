# Pseudocode: NK search with an AI advisor

The built-in example's code (`model.js`), step by step in plain words. Generated from the `pseudocode` field of `model.js` by `scripts/build_prompt.sh`; do not edit by hand. In the explorer, press **Pseudocode** on the left to see the pseudocode of whichever model is running.

```text
PARAMETERS
  K ruggedness · ai on/off · σ advisor error · p0 initial trust · φ trust learning rate
  M people · N choices · T = 60 periods

ONCE PER RUN: the task environment
  draw an NK landscape:
    every project is N yes/no choices (2^N projects)
    each choice's payoff depends on itself and the next K choices, in a ring
    payoff of choice i, for each setting of those K+1 choices ← uniform draw in [0,1)
    performance of a project ← mean of its N payoffs
    best ← the highest performance of any project

ONCE PER RUN: the people
  for each person j = 1..M:
    project[j] ← a random project
    trust[j]   ← p0
  t ← 0

EACH PERIOD (repeated T times)
  for each person j = 1..M:
      (everyone acts on their own project; order does not matter)
    current ← project[j]
    if ai = on and a uniform draw in [0,1) < trust[j]:
        (follow the advisor this period)
      for each choice i = 1..N:
        alternative ← current with choice i flipped
        estimate    ← true performance of alternative + σ × a standard normal draw
      candidate ← the alternative with the highest estimate
    else:
        (search alone)
      candidate ← current with one random choice flipped
    better ← performance of candidate > performance of current
        (strictly greater: a tie means stay)
    if better: project[j] ← candidate
    if this person followed the advisor:
      if better: trust[j] ← trust[j] + φ × (1 − trust[j])     (toward 1)
      else:      trust[j] ← trust[j] − φ × trust[j]           (toward 0)
  t ← t + 1

  RECORD for the charts
    mean_perf    ← mean over people of performance(project) ÷ best
    best_perf    ← highest performance(project) ÷ best
    mean_trust   ← mean of trust
    share_follow ← share of people who followed the advisor this period
    diversity    ← mean over all pairs of people of
                     (number of choices on which their projects differ) ÷ N
    share_peak   ← share of people whose project is a local peak
                     (no single flip improves it)
```
