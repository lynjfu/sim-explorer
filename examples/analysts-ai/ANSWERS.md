*(These answers were the input to a trial of the prompt, written on an earlier version of the assignment form that asked about the AI agent as a separate question 7 and about outcomes as question 8. The current form asks for the AI within each stage, and never asks about outcomes.)*

Just build it; do not ask me questions, make the usual assumptions and tell me what they were.

## 0. The setting
A consulting firm where each analyst picks one of five standard approaches for each client project. The firm has an AI tool that recommends an approach. I want to know whether analysts end up using the best approach more often when the AI is there.

## 1. Task environment
There are five approaches. Each has a true success rate that nobody knows (one is clearly best, the others are worse by different amounts; you choose the numbers). A project either succeeds or fails. Nothing about the approaches changes over time.

## 2. Representation
Each analyst keeps a running impression of how good each approach is, based only on their own past projects. They start with no particular opinion (you choose how to represent that).

## 3. Actions
Each round every analyst does one project and must pick one approach. Mostly they pick the one they currently think is best, but sometimes they try another one at random so they do not get stuck; you choose how often. With the AI, an analyst can instead take the AI's recommendation.

## 4. Feedback
After the project, the analyst sees whether it succeeded or failed. That is all.

## 5. Transformation
The analyst's impression of the approach they used moves part of the way toward the result (success or failure); you choose how far. Nothing else changes and nobody leaves.

## 6. The agents
Thirty analysts, all the same type. They do not talk to each other.

## 7. The AI agent
The AI sees the results of every analyst's projects, not just one analyst's, so it has far more data. It recommends the approach with the best success rate in all the data so far. It is not wrong on purpose, but early on it has little data, so it can recommend a poor approach. Analysts follow the AI with a fixed probability that I want to vary. The AI keeps learning from the pooled data. "Without AI" means the same thirty analysts learning only from their own projects.

## 8. What to measure, and what to be able to change
Plot the share of analysts using the best approach each round, and the average success rate of the projects done that round. The outcome I care about is the share using the best approach at the end. Buttons for: AI on or off, how often analysts follow the AI, how often they try something at random, how fast impressions move, and the number of analysts.

## 9. What you expect
I expect the AI to get everyone to the best approach faster because it pools the data. But I wonder whether, if everyone follows the AI, the firm stops trying the other approaches and could lock in on a wrong one early.
