# CLAUDE.md

Project-specific instructions for Claude Code.

## Node version

Always use `zsh -i -c "..."` when running any `pnpm`, `node`, or `git` commands that may invoke Node (e.g. Husky hooks), to ensure the correct Node version from `.nvmrc` is active.

## Code organisation

Each function should live in its own file. Test files live adjacent to the source file they test, mirroring the name (e.g. `fetchRecipes.ts` → `fetchRecipes.spec.ts`).
