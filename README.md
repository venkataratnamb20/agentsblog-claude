# Agents Blog

A research-backed blog on AI agents for engineers building production agentic systems. Produced by a team of AI agents; the human owner approves every key decision.

- Phase 1: 19 Nov 2026 – 5 Mar 2027. Launch: 14 Dec 2026.
- Rules for agents: [AGENTS.md](AGENTS.md) (Claude Code also reads [CLAUDE.md](CLAUDE.md)).

## Layout
| Path | Purpose |
|---|---|
| `docs/guidelines/` | Detailed rules (git workflow, code quality) |
| `docs/agents/` | Roster, RACI, capability matrix |
| `docs/adr/` | Architecture decision records |
| `docs/specs/` | PRD, SRS, architecture, test plan |
| `research/` | Reference notes and research briefs |
| `content/posts/` | Blog posts (Markdown/MDX) |
| `src/` | Site source |
| `tests/` | `unit/`, `integration/`, `e2e/`, `bdd/` |
| `scripts/` | Automation |
| `.claude/` | Claude Code harness config (subagents, skills, commands, settings, hooks) |
| `.github/` | CI workflows, PR and issue templates |

## Commands
Run `make help` (GNU make) or `./make.ps1 help` (native Windows PowerShell). Targets: setup, dev, lint, format, typecheck, test, test-e2e, test-bdd, coverage, build, preview, audit, release, clean.

Stack-specific targets are stubs until the tech stack ADR is approved.

## Contributing
Branch from `develop` as `feature/<task-id>-<slug>`, open a PR, and follow [docs/guidelines/git-workflow.md](docs/guidelines/git-workflow.md).
