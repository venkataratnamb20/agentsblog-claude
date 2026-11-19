# Agents Blog

The single rules file for every Claude Code session on this project (Claude Code is the only tool in use). Detail lives in `docs/` and is linked, not copied.

## Purpose
A research-backed blog on AI agents for engineers building production agentic systems. Agents build the site and write the content; Venkat (human owner and approver) approves every key decision.
- Phase 1: 19 Nov 2026 to 5 Mar 2027. Launch: 14 Dec 2026.
- Goals: G1 launch by 14 Dec; G2 10 verified posts by 15 Feb 2027; G3 100 confirmed subscribers by 26 Feb; G4 1,000 monthly readers in February.
- Task source: Asana project "Agents blog" (gid 1220688987014018). Each task lists owner, reviewer, approver and acceptance criteria.

## Stack
Astro 5, TypeScript (strict), MDX, Vitest, ESLint, Prettier, npm, Node 22 in CI. Decision and Windows notes: `docs/adr/0001-core-tech-stack.md`. Pure logic lives in `src/lib/` and is unit-tested first. Posts live in `content/posts/` and start as `draft: true`.

## Folder map
| Path | Purpose |
|---|---|
| `src/` | Site code; `src/lib/` holds pure logic |
| `content/posts/` | Blog posts (Markdown or MDX) |
| `tests/` | `unit/`, `integration/`, `e2e/`, `bdd/` |
| `docs/` | `adr/`, `guidelines/`, `agents/`, `specs/`, `team.md` |
| `research/` | Research briefs and notes |
| `scripts/` | Automation (`scan-secrets.mjs`, `clean.mjs`) |
| `progress/` | Local mirror of Asana status |
| `.claude/` | Subagents, skills, commands, settings, hooks |
| `.github/` | CI, PR and issue templates, CODEOWNERS |

## Commands
Use `make <target>` (GNU make) or `./make.ps1 <target>` (Windows PowerShell), not raw tool calls:
`setup dev lint format typecheck test test-e2e test-bdd coverage build preview audit release clean`.
Also `npm run secrets:scan` and `npm run changelog`.

## Git workflow
- `main` is production (tagged releases); `develop` is staging; both are protected and take PRs only.
- Branch from `develop` as `feature/<asana-task-id>-<slug>`; one task = one branch = one PR; squash into `develop`.
- Conventional Commits, enforced by the commit hook and CI on the PR title and commits.
- Every PR links its Asana task. Releases and hotfixes use the `release` and `hotfix` skills.
- Detail: `docs/guidelines/git-workflow.md`.

## Coding standards
- Clean Code and SOLID; functions at most 40 lines, complexity at most 10, zero lint warnings.
- TDD: show the failing test first (red), then green, then refactor.
- TypeScript strict; Python only if ever needed (PEP 8, type hints, Google docstrings).
- Coverage: 100% on `src/lib`, 80% floor in CI.
- Pick data structures by access pattern and state complexity on hot paths.
- Detail: `docs/guidelines/code-quality.md`.

## Definition of Done
- Every acceptance criterion is met, with evidence (commit or PR link, command output, file path).
- Tests passed first; lint, format, typecheck, build and CI are green; no secrets.
- The PR links the Asana task; docs are updated; the named reviewer approved (or Venkat waived it).
- Detail and templates: `docs/guidelines/operating-model.md`.

## Agent completion protocol
1. **Check dependencies first.** Start a task only when every task it depends on is complete (Asana shows open ones as "Waiting on"). Gates: 1 Specification waits for M0; 2 Design for M1; 3 Build for M2; 4 Quality for M3; 5 Deployment for M4; 6 Content and 7 Growth for M1; 8 Operations and 9 Measurement for M5. If a dependency is open, pick another ready task; if already started, stop, set Task Progress to Waiting and comment `BLOCKED: waiting on <gate or task>`.
2. **Start:** set Task Progress to In Progress and work on a feature branch.
3. **Subtasks:** complete your own `[Role]` subtasks once their output is committed. Never complete a `[Venkat]` subtask or another role's.
4. **Blocked:** set Waiting and comment `BLOCKED: <item> needs <person or decision>`; carry on with what you can.
5. **Ready for review:** comment `READY FOR REVIEW` with the Done-when list and evidence for each item.
6. **Review:** the named reviewer (its subagent or a fresh session, never the session that did the work) comments `REVIEW: APPROVED` or `REVIEW: CHANGES REQUESTED: <list>`. Venkat may waive a review in writing; record the waiver.
7. **Approval:** if the task has a `[Venkat]` subtask, wait for him to complete it.
8. **Complete:** when every subtask is done, every Done-when item has evidence, the review is approved and any approval is given, set Task Progress to Done and mark the task complete.
9. Never mark a task complete with open items, change acceptance criteria, or add, remove or work around a dependency; propose changes in a comment for Venkat.
10. "Committed" means in git with a conventional message, through a feature branch and a PR into `develop`.

## Approval gates
Stop and ask Venkat before: spending money, creating accounts, production deploys, DNS changes, publishing posts, posting on social media or communities, sending messages, granting access, deleting data, force-pushing, anything touching secrets. Format and guardrails: `docs/guidelines/approval-gates.md`. `.claude/settings.json` asks before merges, tags and releases and denies force pushes; hooks block secrets and run tests before commits.

## Do not touch
- `.env*`, key files and `secrets.*` or `credentials.*` data files: never read, write or print them.
- `main` and `develop` directly, and any ruleset or branch protection: propose changes in an Asana comment.
- `package-lock.json` by hand, `.husky/_/`, `dist/` and `.astro/`.
- Another role's acceptance criteria or dependencies.
- `.claude/settings.json` and `.claude/hooks/`: changes need a Security Engineer review.

## Content rules
- Front-matter: `title` (70 characters or fewer), `description` (160 or fewer), `date`, `tags`, and `draft: true`. `npm run check:content` must pass; it also fails on images without alt text.
- Never set `draft: false` without Venkat's approval. Production builds exclude drafts; staging is `noindex` unless `ALLOW_INDEXING=true`.
- Every claim in a post has a source, every code sample was run, every image has alt text.
- Run the `seo-audit` skill before a post goes to review; SEO helpers live in `src/lib/seo.ts`.

## Skills and subagents
| Need | Use |
|---|---|
| A new post | `new-post` skill, then the writer, editor and SEO subagents |
| Review a PR | `review-pr` skill through the `code-reviewer` subagent |
| Security review | `security-check` skill through the `security-engineer` subagent |
| Gate decision | `gate-check` skill through `pm-orchestrator` |
| Release or hotfix | `release` or `hotfix` skill (tags and merges ask first) |
| Status or hand-off | `/status` and `/handoff` |

## Working on Windows
- Use `./make.ps1`, forward slashes in docs and no symlinks. `.gitattributes` enforces LF endings.
- `astro check` and `astro build` can be blocked by Windows Application Control on some machines; CI is the reference result.

## Docs
- Team, roster and RACI: `docs/team.md`
- Operating model: `docs/guidelines/operating-model.md`
- Approval gates and guardrails: `docs/guidelines/approval-gates.md`
- Secrets and access: `docs/guidelines/secrets-and-access.md`
- Code quality: `docs/guidelines/code-quality.md`
- Git workflow: `docs/guidelines/git-workflow.md`
- Capability matrix: `docs/agents/capability-matrix.md`

## Claude Code setup
Subagents for all 14 roles are in `.claude/agents/` (reviewers are read-only); skills `new-post`, `review-pr`, `security-check`, `seo-audit`, `gate-check`, `release`, `hotfix`; commands `/status` and `/handoff`; hooks `block-secrets`, `pre-commit-gate`, `log-actions`. Use the reviewer subagents for reviews.
