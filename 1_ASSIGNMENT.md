# Simulation assignment

Answer the questions below in writing, then follow the steps in `README.md` (copy `2_PROMPT.md` into your AI assistant, paste your answers underneath, load what it writes into the explorer page). Write for a smart colleague, not for a programmer.

## Role of computational simulations in organizational learning research

Unlike a formal (economic) model, simulations allow for the agents to update their beliefs with every period, and act differently in the next one. Consequently, the value of computational simulations is generally to explore organizational learning, as it allows us to simulate what happens when agents update their perception of the world and actions in it over time, based on the feedback they receive.

## Setting up a computational simulation of organizational learning

Accordingly, all computational simulations follow a fairly standard format, as described in Puranam et al. (2015).

1. **Define the task environment:** What's the nature of the task agents have to accomplish? Is it to find the best choice on a multi-armed bandit (e.g. Denrell & March, 2003)? Is it to find the highest peak on the landscape (e.g. Levinthal 1997)? Is it to coordinate on taking the same action (e.g. Kocak et al. 2023)? How many agents are tackling this problem, and are they of different types (e.g. manager vs. employee)?

   *Be specific where you can:* how many agents, and how many of each type; how many options or choices there are (for a landscape, the number of choices N and how strongly they interact, K; for a bandit, the number of arms); whether the task changes during a run. Anything you leave out, the assistant will set to a usual value and tell you what it chose.

2. **Define their representation of the task:** What can agents see of the overall task, that impacts how they solve it? Do they explore around a baseline solution that their manager gives them (e.g. March 1991)? Do they explore relative to what their neighbors in their department of the organization know (e.g. Fang et al. 2010)? Do they only see a portion of all the possible actions the firm can do (e.g. Rivkin & Siggelkow, 2003)?

   *Be specific where you can:* how many alternatives an agent can consider in one period (one, a few nearby, all); whether it sees the true value of an alternative or its own estimate, and if an estimate, where that starts; who sees whom, if agents see each other at all.

3. **Define what actions can be taken:** How do agents decide what to do from a set of options? Do they randomly explore amongst all alternatives, or exploit what they already know (e.g. March, 1991)? Can they long jump to wildly different configurations of activities (e.g. Levinthal 1997)? Can they change who they are connected to (e.g. Anjos & Reagans, 2013)?

   *Be specific where you can:* the rule, as a sentence (take the best thing seen; try something at random one time in ten; switch only if strictly better); what a tie does; how often, roughly, agents explore rather than exploit.

4. **Define the feedback that agents receive:** When agents take an action, what is the feedback they receive about what this action resulted in? Do they see the direct consequence of their choices, such as the full value of the idea they proposed (e.g. Levinthal 1997)? Is this feedback mediated through a manager, such as their choice being elevated by a manger or not (e.g. March 1991)? Is the feedback obfuscated by the choices others are simultaneously making in the organization (e.g. Rivkin & Siggelkow)?

   *Be specific where you can:* what exactly is observed (the true value, a noisy version, only success or failure, only whether someone approved); how noisy; whether agents also see others' results.

5. **Define the transformation process:** Upon receiving this feedback, how does this change agents' representation (2) or set of options they choose from (3)? Do they weight recent feedback more than earlier feedback (e.g. Denrell et al. 2004)? Do they incorporate more of what others in the organization know (e.g. Knudsen & Srikanth, 2016)?

   *Be specific where you can:* how far a new result moves a belief (all the way, a third of the way); whether anything becomes permanent (an agent leaves, a decision locks in) and what triggers it; whether agents act all at once on the situation at the start of the period or one after another; how many periods a run should last.

6. Repeat accordingly.

## Your task

Develop a simulation that incorporates AI as an agent (or multiple agents) alongside human agents. Consider what type of organizational context AI is to be used in, and how each agent type is likely to interact with one another. Develop 2 simulations: one with the AI agent(s) and one without.

Provide about 3-5 sentence answers for each of the above questions and for the two below. Then copy everything in `2_PROMPT.md` into your AI assistant (Claude, ChatGPT, Gemini or another), paste your answers underneath, and load the `model.js` it writes into the explorer page at https://carolynjfu.com/sim-explorer/ (the steps are in `README.md`). The "with" and "without" simulations are one model with the AI switched on or off; the page's Compare button overlays the two.

7. **The AI agent (or agents):** Answer the five questions above for the AI as an agent type of its own. What can the AI see that a human cannot (more options at once, everyone's past results, more history)? How does it decide what to do or what to recommend? Is it always right, or can it be wrong, and by how much? How do the human agents respond to it: always follow it, follow it with some probability, follow it only when it has worked before? Does the AI itself change over time? Finally, say what "without AI" means: the same human agents doing the same task alone, with everything else unchanged.

8. **What you expect:** What do you think will happen with the AI compared with without it, and why? This does not shape the code; it tells you what to look for when you run it, and it is what you will compare against what you actually see.

You do not need to say what to measure. Every explorer shows the same two things over time: the performance of the system (how well the agents are doing at the task, averaged over agents), and, where it applies, the heterogeneity of the agents (how different they are from one another). The assistant may add one chart about the AI itself (how many follow it, how accurate it is).

## Example

Two worked examples are in `examples/`: `ai-advisor` (people searching for a good project with an AI advisor; the model the explorer page shows by default) and `analysts-ai` (analysts choosing among five approaches with an AI that pools everyone's results). Each has the written answers, the `model.js` that came out, and the assistant's reply.

## References

Koçak, Ö., Levinthal, D. A., & Puranam, P. (2023). The dual challenge of search and coordination for organizational adaptation: How structures of influence matter. *Organization Science*, 34(2), 851-869.

Puranam, P., Stieglitz, N., Osman, M., & Pillutla, M. M. (2015). Modelling bounded rationality in organizations: Progress and prospects. *Academy of Management Annals*, 9(1), 337-392.

<!-- The reference list in Simulation guidelines.docx ends with "…"; the works cited in the questions above are not yet listed here. -->
