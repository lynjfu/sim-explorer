# Example answers: people searching for a good project, with an AI advisor

These are the answers, written the way a student would write them, that produced the built-in model (`model.js` in this folder). Compare them with `ASSUMPTIONS.md` to see what the assistant had to add.

## 0. The setting

A product organisation where each person runs their own project, and the firm has bought an AI tool that suggests improvements to a project. I want to know whether people end up with better projects when the AI is there, and whether that still holds when the AI is sometimes wrong and people stop trusting it.

## 1. Task environment

Each project is a set of yes/no choices, say eight of them (which features to build, which customers to target). How well a project performs depends on the combination: a choice that is good with one set of other choices can be bad with another, so there are many combinations that are locally good but not the best. The task does not change during the simulation. The more the choices interact, the harder the search; I want to be able to vary that.

## 2. Representation

A person knows their own project and how well it is doing. Each round they can look at one alternative that differs from theirs in a single choice and see how well that alternative would do. They cannot see the whole space of projects.

## 3. Actions

Each round, a person checks one alternative. If it is better than what they have, they switch to it; otherwise they keep what they have. Without the AI, the alternative they check is picked at random. With the AI, they can instead check the alternative the AI recommends.

## 4. Feedback

After checking, the person knows the true performance of the alternative and of their own project, so they know whether the switch helped. That is all the feedback there is.

## 5. Transformation

The person's project changes when they switch. Their trust in the AI changes too: if the AI's recommendation turned out better than what they had, they trust it more next time; if it did not, they trust it less. Nothing is permanent and nobody leaves.

## 6. The agents (folded into question 1 in the current form; kept here as written)

Twenty people, all the same type, each starting with a random project. They do not talk to each other or see each other's projects. I would like to be able to change the number of people.

## 7. The AI agent (or agents)

The AI can look at all the single-choice alternatives to a person's project at once, which a person cannot. It estimates how well each would do and recommends the one it thinks is best, but its estimates can be off by some amount; I want to vary how wrong it is. People follow the recommendation with a probability equal to how much they trust it, starting from some initial trust level. The AI itself does not learn. "Without AI" is the same twenty people with the same rules, each checking one random alternative per round.

## 8. What you expect

I expect the AI to get people to good projects faster, because it looks at every alternative instead of one. I expect that when the AI is noisy, trust will fall and people will go back to searching on their own, so the advantage disappears. I am not sure whether the AI changes where people end up, or only how fast they get there.
