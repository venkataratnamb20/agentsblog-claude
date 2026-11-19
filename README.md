# Agents Blog

A research-backed blog on AI agents for engineers building production agentic systems. Produced by a team of AI agents; the human owner approves every key decision.

- Phase 1: 19 Nov 2026 - 5 Mar 2027. Launch: 14 Dec 2026.
- Licence: none granted yet, all rights reserved until Venkat chooses one.
- Rules for agents: [CLAUDE.md](CLAUDE.md). Contributing: [CONTRIBUTING.md](CONTRIBUTING.md). Security: [SECURITY.md](SECURITY.md).

## Quick start

```bash
make setup   # install dependencies and the commit hooks
make test    # run the unit tests
```

On Windows PowerShell without GNU make, use `./make.ps1 setup` and `./make.ps1 test`. Run `make help` to list every target.

If PowerShell refuses to run `make.ps1`, allow local scripts for your user once: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.

## Install

Prerequisites: Git and Node.js 22 or newer.

### Windows

Run `winget install Git.Git OpenJS.NodeJS.LTS`, then use `./make.ps1 <target>` in PowerShell (no WSL needed). GNU make is optional.

### macOS

Run `brew install node@22`. The Xcode command line tools provide `git` and `make`.

### Linux

Install Git, make and Node.js 22 from your package manager, or use nvm.

## Layout

| Path | Purpose |
|---|---|
| `src/` | Site code; `src/lib/` holds pure logic |
| `content/posts/` | Blog posts (Markdown or MDX) |
| `tests/unit/`, `tests/integration/`, `tests/e2e/`, `tests/features/` | Unit, integration, end-to-end and BDD feature tests |
| `docs/prd/`, `docs/srs/` | Product requirements and requirements spec |
| `docs/adr/` | Architecture decision records |
| `docs/guidelines/`, `docs/agents/`, `docs/runbooks/` | Rules, the capability matrix, runbooks |
| `docs/team.md` | Roster and RACI (a cross-cutting file that sits directly in `docs/`) |
| `public/` | Static files served as they are |
| `progress/` | Local mirror of Asana status |
| `research/` | `sources/`, `briefs/`, `notes/` |
| `scripts/` | Automation: the task runner, secret scan, clean |
| `.claude/` | Claude Code harness (subagents, skills, commands, settings, hooks) |
| `.github/` | CI, PR and issue templates, CODEOWNERS |

## Commands

| Target | What it does |
|---|---|
| `setup` | Install dependencies from the lockfile |
| `dev` | Start the dev server |
| `lint` | Lint with ESLint (zero warnings allowed) |
| `format` | Format all files with Prettier |
| `typecheck` | Type-check the site with `astro check` |
| `test` | Run the unit tests |
| `coverage` | Run the tests with the coverage thresholds |
| `build` | Build the static site |
| `preview` | Preview the built site locally |
| `audit` | Audit dependencies for high-severity issues |
| `clean` | Remove generated output |
| `test-e2e` | End-to-end tests; available after the task "Automated test suite: unit, integration, E2E & visual regression" |
| `test-bdd` | BDD feature tests; available after the task "Automated test suite: unit, integration, E2E & visual regression" |
| `release` | Cut a release with the `release` skill; available after the task "Production deployment & DNS cutover" |

Note: `audit` currently reports advisories in the Astro toolchain, so it can exit non-zero; the decision is tracked in Asana.

A target that cannot work yet exits with a clear message instead of doing nothing. The decision behind the runner: [docs/adr/0002-task-runner.md](docs/adr/0002-task-runner.md).
