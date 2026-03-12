# Requirements

The overall requirements of this project are to build an app that combines a front end and REST API that are both driven by an OpenAPI spec, and contract-tested with Pact.

## Architecture

The architecture must satisfy the following requirements:

- have a front end built using VueJS
- have a back end REST API built using Go
- use an OpenAPI spec as the single source of truth for both API and front end
- use [Pact Broker](https://docs.pact.io/getting_started/sharing_pacts) for contract testing & validation
- store all the code in a single repo
- use Turborepo as the monorepo management tool
- use GitHub actions for running tests, verifying code linting and formatting, and for deployment
- all code to have 100% code coverage, with validation of code coverage as part of CI pipeline process

## The app

This section describes what the app will do, and how it will look.

### Functionality

The resulting front end app must do the following:

- home page
  - shows a list of bread recipes
  - each bread recipe will contain a minimal overview of the recipe, including a photo
  - when the recipe is clicked, the full recipe will be displayed
- recipe page
  - displays all information required to make that particular type of bread
  - includes a larger version of the same photo as was on the home page

### Look and feel

The look and feel of the app must:

- have a clean and contemporary style
- be minimalist in design
- use colours consistent with the purpose of the website
- be responsive to different devices used to view the website

## Technical requirements

### Front end

The front end must satisfy the following requirements:

- contains README.md file with instructions on how to use the repo
- uses pnpm as package manager
- always pins packages to exact versions (NEVER use `^` or `~`)
- has explicit definition of node version required, using `nvm` and `engines` section of `package.json`
- built using VueJS with TypeScript
- uses accepted best practices for VueJS and TypeScript
- 100% test coverage using Vite
- has strict linting and formatting rules
- uses GitHub actions for:
  - enforcement of node version
  - code validation, formatting
  - deployment
- uses Husky for `pre-commit` and `pre-push` validation
- uses the back end REST API for data retrieval
- uses the OpenAPI spec to enforce strict typing of API calls

### Back end API

The back end API must satisfy the following requirements:

- contains README.md file with instructions on how to use the repo
- written in Go
- exposes a REST API
- uses accepted best practices for Go
- has 100% test coverage
- stores API data statically (no databases)
- is written in an abstracted manner so that data could be fetched from another source (could be a database, or maybe a CMS)
- uses GitHub actions used for code validation, formatting, and deployment

### Pact broker

The Pact broker will be self-hosted, so we will need to use the [self-hosted Pact broker](https://docs.pact.io/getting_started/sharing_pacts).
