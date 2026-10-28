# What the assistant added, and what the checks found

This is the delivery note that accompanies `model.js`: the slots the answers left open and how they were filled, the small choices made in the code, and the numbers from the self-check. It is what a student should expect to receive alongside their own model.

## Assumptions (slots the answers did not settle)

| Slot | Assumption, in plain words | Why this one |
|---|---|---|
| Task: how performance is scored | Each of the N choices contributes a score between 0 and 1 that depends on that choice and on the K choices after it in order; a project's performance is the average of the N contributions, shown divided by the best possible. | This is the standard "NK landscape" used for interacting choices (Levinthal 1997). |
| Actions: ties | A person switches only if the alternative is strictly better; an equal alternative means stay. | The usual rule; it stops people wandering between equal projects. |
| AI: how it errs | The AI's estimate of each alternative is the true performance plus a random error with spread σ, drawn fresh for every alternative every round. | The simplest way to make "sometimes wrong, by some amount" a single knob. |
| Transformation: how trust moves | After a followed recommendation, trust moves a fraction φ of the way toward 1 if the alternative was better, and a fraction φ of the way toward 0 if it was not. | The usual "move part of the way" learning rule (as in March 1991, Denrell and March 2001); φ = 0 switches learning off. |
| Time | One round = every person checks one alternative. 60 rounds. Nothing ends a run early. | Long enough for everyone to stop moving at K = 4. |
| Order within a round | Everyone acts at the same time; since people do not interact, order makes no difference. | Follows from "they do not see each other". |
| Values offered | K ∈ {0, 2, 4, 7}; σ ∈ {0, 0.05, 0.1, 0.2}; p0 and φ as sliders from 0 to 1; M ∈ {10, 20, 50}; N ∈ {6, 8, 10}. | Differences in performance between neighbouring projects are about 0.1, so σ = 0.05 is mild noise and 0.2 is heavy. |

## Choices marked in the code (`// CHOICE:`)

- Everyone acts in the same round on their own state (no interaction, so order is immaterial).
- Additive normal error in the AI's estimates, independent per alternative and per round.
- Strict improvement rule (a tie means stay).

## Self-check results (from `scripts/smoke_test.sh`, 50 runs, 28 October 2026)

The charts follow the standard set: system performance over time, heterogeneity of the agents over time (here the mean difference between two people's projects, as a share of N), and one chart about the AI (trust and following).

| Check | Result |
|---|---|
| Seed reproduces a run; every series numeric | passed |
| Every parameter at its extremes runs | passed |
| 50 runs at defaults | 13 ms; a Batch of 200 is about 0.1 s |
| K = 0 (one peak): everyone reaches it, with the AI | passed (mean performance > 0.97) |
| K = 0: everyone reaches it, without the AI | passed |
| AI off: nobody follows, trust stays at p0 | passed |
| φ = 0: trust never moves | passed |
| Perfect, always-followed AI is ahead of no AI at round 5, K = 4 | passed |

Final-period batch means at the defaults (K = 4, AI on, σ = 0.05, p0 = 0.5, φ = 0.3, M = 20, N = 8; 50 runs):

| Series | mean ± sd |
|---|---|
| mean performance ÷ best | 0.910 ± 0.030 |
| best person | 0.999 ± 0.006 |
| mean trust | 0.045 ± 0.004 |
| mean difference between two people's projects ÷ N (heterogeneity) | 0.461 ± 0.038 |
| share stuck at a local peak | 1.000 ± 0.000 |

## A finding the checks surfaced

Mean trust ends near zero at the defaults. The reason is in the rule, not a bug: once a person sits on a local peak, no single-choice alternative is better, so every recommendation they follow "fails" and trust falls toward zero. Trust therefore measures "the AI helped me last time" rather than "the AI is accurate". Whether that is the mechanism the student meant is a question for the student; an alternative is to update trust only when a better alternative existed. The explorer makes this visible in the Trust chart within the first run.
