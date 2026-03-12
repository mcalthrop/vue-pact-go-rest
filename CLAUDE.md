# CLAUDE.md

Project-specific instructions for Claude Code.

## Node version

Always run `source ~/.zshrc && nvm install` before executing any `pnpm` or `node` commands, to ensure the correct Node version is active.

## Code organisation

Each function should live in its own file. Test files live adjacent to the source file they test, mirroring the name (e.g. `fetchRecipes.ts` → `fetchRecipes.spec.ts`).
