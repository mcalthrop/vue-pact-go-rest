# Vibe

This repo is an exercise in vibe coding.

## Motivation

I have never used the VueJS framework, and never developed in Golang.

I've heard really good things about both, and I want to develop my Claude-wrangling skills.

So I figured it was a great opportunity to combine all three.

## Approach

I created a new repo, and started off with this list of requirements:
[REQUIREMENTS.md](./REQUIREMENTS.md)

And this instructions file:
[INSTRUCTIONS.md](./INSTRUCTIONS.md)

Then I pointed Claude at the instructions file, and away we went.

You can see the plan that Claude created:
[PLAN.md](./PLAN.md)

## Process

This is the overall process I ended up using:

1. Instruct Claude
2. Review generated code
3. Learn from the good bits
4. Repeat

## Learnings

- Claude initially used an npm package that was not well maintained, and contained security vulnerabilities – these were highlighted by Copilot on GitHub
- Had to ask Claude to generate types from OpenAPI spec rather than hand-coding them – for both front end and API
- GitHub Copilot caught a few potential code issues, and left PR comments – Claude had not spotted these
- I told Claude to implement the changes that Copilot had added as PR suggestions, and it managed that fine (by using the `gh` CLI)
- I took the approach of keeping my suggested changes to a minimum so that I can better evaluate what Claude produced at the end of the process
- I’ve used about $100 in Claude tokens so far
- I had to make quite a few changes to the code that Claude generated, and updated the plan along the way – but I almost always prompted Claude to make those changes, with a few rare exceptions
- Things were going pretty smoothly until I got to the task to write the CI pipelines: I had to make a lot of changes to the initial code that Claude generated
