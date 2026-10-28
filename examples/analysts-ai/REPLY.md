# What the assistant replied

This is the reply an assistant produced from `ANSWERS.md` and `PROMPT.md` alone, with no access to anything else (trial on 28 October 2026; the assistant was a Claude model, so the prompt has not yet been tried with ChatGPT or Gemini). Its `about` text was later shortened to the five-step form now required by the contract; otherwise the model it wrote, `model.js` here, passed the page self-check unchanged: all four of its own checks, seed reproduction, every parameter extreme, 50 runs in 19 ms.

---

You asked me to build without questions, so the card is at the top instead of being shown for confirmation. Everything marked ASSUMED is listed again, in plain words, under "Assumptions" below.

## The card

| # | Slot | What I settled on | Mark |
|---|---|---|---|
| 1 | Task | Five approaches with fixed true success rates 0.70, 0.55, 0.50, 0.40, 0.30 (approach 1 is clearly best; the others are worse by different amounts). A project succeeds or fails at that rate. Nothing changes during a run. | GIVEN (five, one best, fixed, success/fail) · ASSUMED (the numbers) |
| 2 | Representation | Each analyst holds one impression per approach, a number between 0 and 1, from their own projects only. All five start at 0.5. | GIVEN (own impressions, no opinion) · ASSUMED (0.5 start) |
| 3 | Actions | Each round, with the AI on, an analyst first follows the AI with probability p. If not following: they pick the approach with their highest impression (a tie between impressions is broken at random); but with probability ε they instead try one of the other four approaches at random. | GIVEN (mostly best, sometimes random, follow with fixed probability) · ASSUMED (follow draw comes first; random try is one of the other four; ties at random) |
| 4 | Feedback | The analyst sees only whether their own project succeeded (1) or failed (0). | GIVEN |
| 5 | Transformation | The impression of the approach used moves a fraction φ of the way toward the result. Nothing else changes; nobody leaves. Everyone acts in the same round on their own impressions, so order does not matter. | GIVEN (moves part way, nothing else) · ASSUMED (φ default 0.3) |
| 6 | Agents | M analysts (default 30), all the same type, no contact with each other. | GIVEN |
| 7 | AI | Sees every analyst's result. At the start of each round it recommends the approach with the highest pooled success rate (successes ÷ projects over everyone, all previous rounds). An approach nobody has tried yet counts as 0.5; ties are broken at random. Never wrong on purpose; keeps learning from every project, followed or not. "Without AI" = the same analysts, same rules, with the follow step removed. | GIVEN (pooled data, best pooled rate, fixed follow probability, keeps learning, meaning of "without AI") · ASSUMED (untried counts as 0.5; ties at random; one recommendation per round for everyone) |
| 8 | Time | One round: every analyst does one project, picks an approach, sees the result, updates their impression; then the AI's data grows. 100 rounds. Nothing ends a run early. | GIVEN (one project each per round, nothing ends it) · ASSUMED (100 rounds) |
| 9 | Parameters | AI on/off; follow probability p (0.25, 0.5, 0.75, 1; default 0.5); random-try probability ε (0, 0.05, 0.1, 0.25; default 0.1); impression step φ (slider 0 to 1; default 0.3); analysts M (10, 30, 100; default 30). | GIVEN (which five) · ASSUMED (values and defaults) |
| 10 | Outcomes | Chart 1: share of analysts using the best approach (solid, filled) and whether the AI is recommending the best approach (dashed, hollow; in a Batch this becomes the share of runs). Chart 2: share of this round's projects that succeeded (solid, filled) and the average true success rate of the approaches chosen (dashed, hollow; the same thing without the coin-flip noise). Chart 3: share who followed the AI and share who tried one at random. Headline: share using the best approach at the end. | GIVEN (the two quantities, the headline) · ASSUMED (the extra lines) |
| 11 | State strip | For each of the five approaches (1 = best), the share of analysts who used it this round. | ASSUMED (default strip) |
| 12 | Randomness | Tie-breaks among impressions; the follow draw; the random-try draw and which approach; the project's success; the AI's tie-break. The true rates and the starting impressions are fixed, not drawn. | — |

What one round is: every analyst picks an approach (following the AI or using their own rule), does one project, sees success or failure, and moves their impression of that approach toward the result; the AI then adds all M results to its pooled data. Log line, each round: which approach the AI recommended, how many followed it, how many tried one at random, how many used the best approach, how many succeeded (all as counts out of M).

## 1. model.js

[code block: the complete model.js]

## 2. How to run it

Open the explorer page your instructor gave you, press "Load model", paste the whole code block, press "Load pasted code". The page runs a self-check. If the chip at the top says "self-check: passed", the model is running. If it says "failed", open the report and paste it back to me with the words "please fix this". I cannot run the code here, so the page's self-check is what does the checking.

## 3. Assumptions (every ASSUMED slot)

1. **True success rates** 0.70, 0.55, 0.50, 0.40, 0.30, fixed for every run. You said one is clearly best and the others worse by different amounts; these are the numbers I chose. They sit in a `// fixed:` constant at the top of the file if you want others.
2. **"No particular opinion"** = every impression starts at 0.5, the middle of the 0 to 1 scale. Ties between equal impressions are broken at random, so in round 1 analysts spread over all five approaches.
3. **How often analysts try something at random**: ε = 0.1 by default (one project in ten), with buttons for 0, 0.05, 0.1 and 0.25. This is the usual range in simulations of this kind.
4. **A random try is one of the other four approaches**, never the one they already favour, since you said "try another one".
5. **How far impressions move**: φ = 0.3 of the way toward the result by default (a slider from 0 to 1). This is the usual kind of rule in learning simulations (for example Denrell and March 2001 use the same move-part-way updating).
6. **Order of the decision with the AI on**: the analyst first decides whether to follow the AI (probability p). Only an analyst who does not follow uses their own pick-best-or-try-random rule. So at p = 1 nobody ever tries anything at random, which is exactly the lock-in situation you asked about.
7. **What the AI does before it has data**: an approach nobody has tried yet counts as 0.5 in its ranking, and ties are broken at random. The AI's recommendation is computed once at the start of each round from all results up to the previous round, so everyone who follows in a round gets the same recommendation.
8. **Round count**: 100 rounds per run. Nothing ends a run early.
9. **Follow probability** buttons 0.25, 0.5, 0.75, 1 (default 0.5). **Analysts** 10, 30, 100 (default 30).
10. **Extra plotted lines** that you did not ask for but that need no new mechanism: "AI recommends the best approach" (so you can see lock-in directly) and "average true success rate of the approaches chosen" (the smooth version of your noisy success-rate line). The third chart (who followed, who tried at random) is there so the self-checks have something to test.

## 4. CHOICE list (small decisions marked `// CHOICE:` in the code)

- True rates are fixed numbers, not drawn at random each run. Alternative: draw them fresh each run.
- The AI's recommendation is computed once at the start of the round. Alternative: update after each analyst within the round, so later analysts see a slightly better-informed AI.
- The follow draw comes before the own rule. Alternative: the AI replaces only the "pick my best" step, so a following analyst could still try something at random with probability ε.
- Ties between impressions are broken at random. Alternative: lowest-numbered approach wins.
- A random try excludes the current favourite. Alternative: any of the five.

## 5. What to look at first

1. **Your main expectation (AI gets everyone there faster).** Leave the defaults (p = 0.5, ε = 0.1) and press Compare. Look at the "share using the best approach" line with AI against without AI in the first 20 rounds, and at the end.
2. **Your worry (lock-in when everyone follows).** Set "Follow the AI" to 1 and press Batch. Watch the dashed "AI recommends the best approach" line: in a batch it is the share of runs where the AI is pointing at approach 1. If it flattens below 1, those runs have locked in on a wrong approach and nothing in the model can get them out, because only the recommended approach gets new data. Then press Compare: at p = 1 the "without AI" analysts are still trying things at random, so see which side is ahead at round 100.
3. **Sweep the follow probability** (Sweep on "Follow the AI") to see whether there is a middle value that gets the speed of the AI without the lock-in. Whether there is, I do not know; run it and see.
