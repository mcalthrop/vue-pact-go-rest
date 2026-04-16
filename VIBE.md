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

More specifically, I found that I used Claude and Copilot together really effectively:

- prompt Claude to implement the next task in the plan
- review the code locally, and prompt Claude to make changes
- Claude then creates a branch, makes a commit, and raises a PR
- the GitHub repo is configured so that Copilot automatically reviews a non-draft PR
- once the Copilot review is complete, I instruct Claude to check if Copilot's PR comments need actioning

I found that Copilot would often pick up code issues with the code that Claude generated.

For example:

- Copilot [flagged the use of a deprecated transitive dependency](https://github.com/mcalthrop/vue-pact-go-rest/pull/2#discussion_r2924559176); I instructed Claude to [raise a new PR](https://github.com/mcalthrop/vue-pact-go-rest/pull/3) to address the issue.
- Copilot flagged that [serving a directory with `http.FileServer` enables directory listings](https://github.com/mcalthrop/vue-pact-go-rest/pull/30#discussion_r2940933659).

## Decisions

- **No SSR**:
  - Planned a Vue SSR refactor using Vite SSR + a custom Express server
  - Doing SSR with plain Vue.js requires substantial boilerplate
  - The idiomatic solution is Nuxt.js, but that would mean migrating away from Vue.js
  - Since the goal is to stay with Vue.js, SSR was dropped
- **No main deployments**:
  - My first complete solution included deploying to ephemeral environments and a main deployment
  - this proved incredibly time-consuming, so I decided to remove it from the requirements to limit the scope

## Learnings

- Had to ask Claude to generate types from OpenAPI spec rather than hand-coding them – for both front end and API
- Also instructed it to add CI checks to validate the above
- I took the approach of keeping my suggested changes to a minimum so that I can better evaluate what Claude produced at the end of the process
- Claude is costing me $20-30 per day
- I had to make quite a few changes to the code that Claude generated, and updated the plan along the way – but I almost always prompted Claude to make those changes, with a few rare exceptions
- Things were going pretty smoothly until I got to the task to write the CI pipelines: I had to prompt Claude to make a lot of changes to the initial code that Claude generated
