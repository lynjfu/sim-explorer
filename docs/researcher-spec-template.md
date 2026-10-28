# Model spec for an interactive explorer

Fill in what you can and hand this to Claude together with the `sim-explorer` skill (or paste it into the chat with the instruction "build the explorer for this"). Leave a slot blank or write "not sure" if you do not know; you will be asked. If code exists, point to it: the code wins over prose where they differ.

The first four slots follow Puranam, Stieglitz, Osman and Pillutla (2015): every model of bounded rationality has a task environment, a representation of it inside the agent, a choice rule, and a transformation that updates the agent or the environment after the choice.

---

**Model name** (two to four words):

**The question this explorer is for** (one sentence: "does X happen when Y, because Z"):

**Reference code** (path and function signature, or "none"):

---

## 1. Task environment
What is objectively there: the set of possible actions and the payoff of each.
- Landscape type (NK with N bits and K interactions; a set of arms with payoffs; something else):
- N, K, how bits interact (adjacent ring / random partners), what the payoff is:
- Does the environment change during a run? What changes it?

## 2. Representation
What each agent knows or believes, as distinct from what is true.
- Scope: which actions can an agent consider in one period (all / one-bit neighbours / one random neighbour / only what has been revealed)?
- Accuracy: does the agent see the true payoff, a noisy signal, or a learned belief? If a belief, how is it initialised?

## 3. Choice rule
The rule that turns the representation into an action. Write it as a formula or an exact sentence.
- Comparison: strict `>` or weak `≥`? Against what (current position / aspiration / best alternative)?
- Deterministic or probabilistic (softmax with τ, ε-greedy, satisficing)? Default τ or ε?
- One rule per agent type if types differ:

## 4. Transformation and feedback
What changes after the choice.
- Agent position:
- Beliefs (update rule, e.g. `b ← (1−φ)b + φ·x`):
- Environment or other agents:
- Absorbing states (defection, exit, lock-in) and what triggers them:
- Order of operations within a period (all agents at once on the old state, or one after another on the updated state):

## 5. Agents
- Types and counts:
- How starting positions and beliefs are drawn:
- Any special agent (presenter, firm, focal organisation) and how it is placed:

## 6. Time
- One period is: (one sentence)
- Number of periods T:
- What ends a run early, and what is the outcome then:

## 7. Parameters to expose (four to seven)
| name in code | label | values to offer (or range and step) | default | note | sweep? |
|---|---|---|---|---|---|
| | | | | | |

Fixed constants (not exposed):

## 8. Outcomes to chart (two to four charts, one to three series each)
| chart | series | how computed each period | range |
|---|---|---|---|
| | | | |

Headline outcome (the single number to compare with reference code and to report in sweeps):

## 9. State strip
What a glance at the current state should show (default: per-bit share of agents holding 1):

## 10. Randomness
Every place the model draws a random number:

## 11. Known result for cross-checking
One parameter setting and its known outcome from the reference code (with run count), or "none":

---

**What I expect to happen, and why** (your hypothesis; it does not shape the code, it tells the explorer what to look for):
