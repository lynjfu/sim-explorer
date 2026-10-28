# Simulation assignment

Answer the questions below in writing, then follow the steps in `README.md`: copy `2_PROMPT.md` into your AI assistant, paste your answers underneath, save the `model.js` it writes into your downloaded copy of this folder, and open `index.html`. Write for a smart colleague, not for a programmer.

## Role of computational simulations in organizational learning research

Unlike a formal (economic) model, simulations allow for the agents to update their beliefs with every period, and act differently in the next one. Consequently, the value of computational simulations is generally to explore organizational learning, as it allows us to simulate what happens when agents update their perception of the world and actions in it over time, based on the feedback they receive.

## Setting up a computational simulation of organizational learning

Accordingly, all computational simulations follow a fairly standard format, as described in Puranam et al. (2015).

1. **Define the task environment:** What's the nature of the task agents have to accomplish? Is it to find the best choice on a multi-armed bandit (e.g. Denrell & March, 2001)? Is it to find the highest peak on the landscape (e.g. Levinthal 1997)? Is it to coordinate on taking the same action (e.g. Kocak et al. 2023)? How many agents are tackling this problem, and are they of different types (e.g. manager vs. employee)?

   *Be specific where you can:* how many agents, and how many of each type; how many options or choices there are (for a landscape, the number of choices N and how strongly they interact, K; for a bandit, the number of arms); whether the task changes during a run. Anything you leave out, the assistant will set to a usual value and tell you what it chose.

2. **Define their representation of the task:** What can agents see of the overall task, that impacts how they solve it? Do they explore around a baseline solution that their manager gives them (e.g. March 1991)? Do they explore relative to what their neighbors in their department of the organization know (e.g. Fang et al. 2010)? Do they only see a portion of all the possible actions the firm can do (e.g. Rivkin & Siggelkow, 2003)?

   *Be specific where you can:* how many alternatives an agent can consider in one period (one, a few nearby, all); whether it sees the true value of an alternative or its own estimate, and if an estimate, where that starts; who sees whom, if agents see each other at all.

3. **Define what actions can be taken:** How do agents decide what to do from a set of options? Do they randomly explore amongst all alternatives, or exploit what they already know (e.g. March, 1991)? Can they long jump to wildly different configurations of activities (e.g. Levinthal 1997)? Can they change who they are connected to (e.g. Anjos & Reagans, 2013)?

   *Be specific where you can:* the rule, as a sentence (take the best thing seen; try something at random one time in ten; switch only if strictly better); what a tie does; how often, roughly, agents explore rather than exploit.

4. **Define the feedback that agents receive:** When agents take an action, what is the feedback they receive about what this action resulted in? Do they see the direct consequence of their choices, such as the full value of the idea they proposed (e.g. Levinthal 1997)? Is this feedback mediated through a manager, such as their choice being elevated by a manger or not (e.g. March 1991)? Is the feedback obfuscated by the choices others are simultaneously making in the organization (e.g. Rivkin & Siggelkow, 2003)?

   *Be specific where you can:* what exactly is observed (the true value, a noisy version, only success or failure, only whether someone approved); how noisy; whether agents also see others' results.

5. **Define the transformation process:** Upon receiving this feedback, how does this change agents' representation (2) or set of options they choose from (3)? Do they weight recent feedback more than earlier feedback (e.g. Denrell et al. 2004)? Do they incorporate more of what others in the organization know (e.g. Knudsen & Srikanth, 2014)?

   *Be specific where you can:* how far a new result moves a belief (all the way, a third of the way); whether anything becomes permanent (an agent leaves, a decision locks in) and what triggers it; whether agents act all at once on the situation at the start of the period or one after another; how many periods a run should last.

6. Repeat accordingly.

## Your task

Develop a simulation that incorporates AI as an agent (or multiple agents) alongside human agents. Consider what type of organizational context AI is to be used in, and how each agent type is likely to interact with one another. Develop 2 simulations: one with the AI agent(s) and one without.

Provide about 3-5 sentence answers for each of the above questions, specifically identifying the answers for the AI agent(s) as well as for the human agents: what the AI can see that a human cannot, how it decides or recommends, whether and how it can be wrong, how the human agents respond to it, and whether it changes over time. State what "without AI" means (the same human agents doing the same task alone, with everything else unchanged). Then answer question 7.

7. **What you expect:** What do you think will happen with the AI compared with without it, and why? This does not shape the code; it tells you what to look for when you run it, and it is what you will compare against what you actually see.

Then copy everything in `2_PROMPT.md` into your AI assistant (Claude, ChatGPT, Gemini or another), paste your answers underneath, save the `model.js` it writes into your downloaded copy of this folder, and open `index.html` (the steps are in `README.md`). The "with" and "without" simulations are one model with the AI switched on or off; the page's Compare button overlays the two.

You do not need to say what to measure. Every explorer shows the same two things over time: the performance of the system (how well the agents are doing at the task, averaged over agents), and, where it applies, the heterogeneity of the agents (how different they are from one another). The assistant may add one chart about the AI itself (how many follow it, how accurate it is).

## Reflecting on the results

Once your explorer runs, work with it, then write up what you found.

8. **Refine the model.** Watch single runs with Step and compare with and without the AI. Where the agents do something you did not intend, or a chart does not show what you need, say so to the same AI assistant in the same chat ("when an agent ties, it should stay, not switch"; "plot the share of agents following the AI instead of trust"; "add a setting for how noisy the AI is") and replace `model.js` with the new version it gives you. Everything about your model can be changed this way: the agents' rules, the settings on the left, which quantities are charted and how they are labelled, the strip and the log. The page itself (its layout, its buttons, and the fact that every chart is a line over periods) stays the same for everyone. Keep a short list of what you changed and why.

9. **What did you learn?** What did this exercise teach you about modelling organizational learning, and about where your intuition in question 7 was right or wrong? What paper might you write on the role of AI in organizational learning: what would be its question, its mechanism, and the result you would need to show?

## Example

Two worked examples are in `examples/`: `ai-advisor` (people searching for a good project with an AI advisor; the model the explorer page shows by default) and `analysts-ai` (analysts choosing among five approaches with an AI that pools everyone's results). Each has the written answers, the `model.js` that came out, and the assistant's reply.

## References

Anjos, F., & Reagans, R. (2013). Commitment, learning, and alliance performance: A formal analysis using an agent-based network formation model. *The Journal of Mathematical Sociology*, 37(1), 1-23.

Denrell, J., Fang, C., & Levinthal, D. A. (2004). From T-mazes to labyrinths: Learning from model-based feedback. *Management Science*, 50(10), 1366-1378.

Denrell, J., & March, J. G. (2001). Adaptation as information restriction: The hot stove effect. *Organization Science*, 12(5), 523-538.

Fang, C., Lee, J., & Schilling, M. A. (2010). Balancing exploration and exploitation through structural design: The isolation of subgroups and organizational learning. *Organization Science*, 21(3), 625-642.

Knudsen, T., & Srikanth, K. (2014). Coordinated exploration: Organizing joint search by multiple specialists to overcome mutual confusion and joint myopia. *Administrative Science Quarterly*, 59(3), 409-441.

Koçak, Ö., Levinthal, D. A., & Puranam, P. (2023). The dual challenge of search and coordination for organizational adaptation: How structures of influence matter. *Organization Science*, 34(2), 851-869.

Levinthal, D. A. (1997). Adaptation on rugged landscapes. *Management Science*, 43(7), 934-950.

March, J. G. (1991). Exploration and exploitation in organizational learning. *Organization Science*, 2(1), 71-87.

Puranam, P., Stieglitz, N., Osman, M., & Pillutla, M. M. (2015). Modelling bounded rationality in organizations: Progress and prospects. *Academy of Management Annals*, 9(1), 337-392.

Rivkin, J. W., & Siggelkow, N. (2003). Balancing search and stability: Interdependencies among elements of organizational design. *Management Science*, 49(3), 290-311.
