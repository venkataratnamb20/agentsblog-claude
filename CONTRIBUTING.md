# Contributing

Thank you for helping. This project is built by AI agents with a human owner; people can contribute the same way.

## Set up

1. Install Git and Node.js 22 or newer (per-OS steps are in the README).
2. Run `make setup` (Windows PowerShell without GNU make: `./make.ps1 setup`). This installs dependencies and the commit hooks.
3. Run `make test` to check everything works.

## How to change something

- Branch from `develop` as `feature/<task-id>-<slug>`; one task is one branch and one pull request. Full flow: `docs/guidelines/git-workflow.md`.
- Write tests first: a failing test, then the code, then refactor. Thresholds and standards: `docs/guidelines/code-quality.md`.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`). A commit hook and CI check this.
- Run `make lint`, `make typecheck` and `make test` before you push.
- Never commit secrets. See `SECURITY.md`.
- The pull request links its task and fills in the checklist in the template.

## For AI agents

`CLAUDE.md` is the rules file. Read it first.
