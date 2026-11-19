# Capability matrix: Claude Code (primary harness)

- **Status:** audit closed 19 Nov 2026 (Venkat confirmed the setup and waived the review). Gap status updated after the harness build (see the end of this file).
- **Asana task:** Audit AI team & harness capabilities (gid 1220694720088833).
- **Owner decision (Venkat, chat, 19 Nov 2026):** Claude Code is the only tool for this project. Nothing is set up for Cursor, Codex or Antigravity, so they are not in this matrix.

## Scope

Claude Code only. `CLAUDE.md` is the single rules file (the former `AGENTS.md` was merged into it). Other tools are not audited, set up or tested.

## Claude Code version and default model

| Item | Value | How checked |
|---|---|---|
| Claude Code version | 2.1.328 | `claude --version` |
| Default model | not pinned: `~/.claude/settings.json` has no `model` key, so the desktop app's selection applies. This session runs `claude-sonnet-5-5` (Sonnet 5.5) | user settings keys; session info |
| Plugins enabled | `ecc@ecc` 2.2.3 (user scope) | `claude plugin list` |

Also on the dev machine: Node 26.13.1 (CI uses Node 22), npm 11.20.0, Git 2.56.1.

## User-level config check (`~/.claude`): no clashes

- `settings.json` contains only `autoUpdatesChannel`, `enableWorkflows`, `enabledPlugins` and `extraKnownMarketplaces`: no permission rules, no hooks and no model override of its own.
- No user-level `CLAUDE.md`, `agents/` or `commands/`. One user-level skill folder (`skills/learned`).
- The project defines nothing that overlaps with these, so the project files take effect without conflict.

## Legend

- **Av** Available: in this repo, or enabled in this Claude Code install and usable now.
- **Re** Reuse: exists in a Claude plugin or connector; needs adoption, authorisation or copying into the project.
- **Mi** Missing: nothing exists; listed as a gap below.
- **NA** Not applicable.
- Columns: **A** subagent, **S** skills, **C** slash commands, **MCP** servers, **H** hooks, **P** permissions, **M** model.

Claude Code install checked: `ecc@ecc` plugin 2.2.3 (user scope, enabled) plus the skills and connectors the claude.ai account provides in this session (engineering, design, design-skills, zizi-skills, searchfit-seo, product-management, marketing, data, social-media-skills and others).

## Project-level baseline

| Asset | Status | Evidence |
|---|---|---|
| `CLAUDE.md` (single rules file) | Av | purpose, stack, commands, git flow, Definition of Done, completion protocol, approval gates |
| `.claude/skills/` | Av | 7 skills |
| `.claude/agents/` | Av | 14 subagents |
| `.claude/commands/` | Av | `/status`, `/handoff` |
| `.claude/settings.json` (permissions, hooks) | Av | allow, ask and deny rules; hooks `block-secrets`, `pre-commit-gate`, `log-actions` |
| `.mcp.json` | Mi | does not exist |
| Git hook `commit-msg` (Conventional Commits) | Av | `.husky/commit-msg` |
| CI, CODEOWNERS, PR template | Av | `.github/` |

Observation: the `ecc` plugin's "Fact-Forcing Gate" is user-level and not in the repo. The repo's own hooks (`block-secrets`, `pre-commit-gate`, `log-actions`) are, so a fresh clone carries them.

## Role × Claude Code feature matrix

| Role | A | S | C | MCP | H | P | M |
|---|---|---|---|---|---|---|---|
| PM Orchestrator | Av | Re | Re | Av | Av | Av | Av |
| Product Strategist | Av | Re | Re | Av | Av | Av | Av |
| Solution Architect | Av | Re | Re | Av | Av | Av | Av |
| UX/UI Designer | Av | Re | Re | Re | Av | Av | Av |
| Frontend Engineer | Av | Re | Re | Av | Av | Av | Av |
| DevOps & SRE | Av | Re | Mi | Re | Av | Av | Av |
| QA Engineer | Av | Re | Re | Av | Av | Av | Av |
| Security Engineer | Av | Re | Re | Mi | Av | Av | Av |
| Code Reviewer | Av | Re | Re | Re | Av | Av | Av |
| SEO & Analytics | Av | Re | Mi | Re | Av | Av | Av |
| Research Analyst | Av | Re | Mi | Re | Av | Av | Av |
| Technical Writer | Av | Re | Mi | Av | Av | Av | Av |
| Technical Editor | Av | Mi | Mi | Mi | Av | Av | Av |
| Growth & Community | Av | Re | Re | Re | Av | Av | Av |
| Venkat (human approver) | NA | NA | NA | Av | NA | NA | NA |

Notes on the cells:

- **A = Av**: each role has a project subagent in `.claude/agents/` (provisional until the roster and RACI are approved).
- **H = Av**: repo-level hooks exist (`.claude/hooks/`: secret blocking and a pre-commit gate) plus the git `commit-msg` hook and CI. Hooks for deploy, DNS, publish, spend and post do not exist because that tooling does not exist yet.
- **P = Av**: `.claude/settings.json` has allow, ask and deny rules. Per-role limits come from each subagent's tools allow-list; path-level limits (for example the writer touching only `content/posts/`) are by instruction only.
- **M = Av**: all roles use `model: inherit`, the default model Venkat confirmed.
- **S, C, MCP**: unchanged; **Re** still means reuse from a plugin or connector, and the 7 project skills and 2 commands are listed in the gap status below.

## What each role needs, and what exists to reuse

| Role | Needs (skills, tools, permissions) | Reuse candidates in this Claude Code install |
|---|---|---|
| PM Orchestrator | planning, status updates, gate checks; Asana; read repo, write `progress/` and docs, comment in Asana; no deploys | skills `engineering:standup`, `zizi-skills:project-manager`, `status-update`, `orchestration`, `ecc:plan-orchestrate`; commands `/ecc:plan`; agents `ecc:planner`, `ecc:loop-operator`; MCP Asana, Notion (connected) |
| Product Strategist | PRD, SRS, topic backlog, research synthesis; write `docs/prd/`, `docs/srs/` | `product-management:write-spec`, `brainstorm`, `roadmap-update`, `synthesize-research`, `zizi-skills:idea-refine`; `/ecc:plan-prd`; MCP Notion, Asana; no subagent |
| Solution Architect | ADRs, architecture, content model; write `docs/adr/`, `docs/prd/`, `docs/srs/` | `engineering:architecture`, `system-design`, `ecc:architecture-decision-records`; `/ecc:feature-dev`; agents `ecc:architect`, `ecc:code-architect`; MCP MDN, draw.io |
| UX/UI Designer | brand, IA, design system, WCAG 2.2 AA spec; paid assets need Venkat | `design:*`, `design-skills:*`, `frontend-design:frontend-design`, `ecc:design-system`; `/ecc:gan-design`; agent `ecc:a11y-architect`; MCP Miro, draw.io, Unsplash connected; Figma and Canva need authorisation |
| Frontend Engineer | Astro, TypeScript, MDX, TDD; write `src/`, `tests/`; no deploys | `ecc:frontend-patterns`, `ecc:vite-patterns`, `ecc:tdd-workflow`; `/ecc:feature-dev`, `/ecc:build-fix`; agents `ecc:typescript-reviewer`, `ecc:build-error-resolver`; MCP MDN, Playwright, chrome-devtools |
| DevOps & SRE | CI/CD, hosting, caching, monitoring, backups, runbooks; `.github/`, `scripts/`; production deploys and DNS need Venkat | skills `engineering:deploy-checklist`, `incident-response`, `zizi-skills:infrastructure`, `monitoring`, `ecc:deployment-patterns`; no command or subagent; GitHub MCP connector failed to connect (the `gh` CLI works instead); Datadog and PagerDuty need authorisation |
| QA Engineer | TDD, BDD, E2E, accessibility tests; write `tests/` | `engineering:testing-strategy`, `zizi-skills:tdd-skill`, `ecc:e2e-testing`, `ecc:browser-qa`; `/ecc:test-coverage`; agents `ecc:tdd-guide`, `ecc:e2e-runner`, `ecc:pr-test-analyzer`; MCP Playwright, chrome-devtools (Playwright and Cucumber are not installed in the project) |
| Security Engineer | threat model, secret scanning, headers, dependency audit; read all, write security docs and CI | built-in `security-review`, `ecc:security-review`, `zizi-skills:security-and-hardening`; `/ecc:security-scan`; agent `ecc:security-reviewer`; no scanner MCP; no secret-scan hook |
| Code Reviewer | PR review against the checklist; comment and review only, no pushes to protected branches | `code-review`, `engineering:code-review`, `ecc:code-review`; `/ecc:code-review`, `/ecc:review-pr`; agents `ecc:code-reviewer`, `ecc:silent-failure-hunter`, `ecc:commit-reviewer`; GitHub MCP failed (use `gh`); no review-gate hook |
| SEO & Analytics | SEO spec and audit, analytics, KPI dashboard; read analytics, write SEO config | `searchfit-seo:*`, `ecc:seo`, `marketing:seo-audit`; agents `searchfit-seo:seo-auditor`, `ecc:seo-specialist`; Ahrefs, Similarweb, Amplitude need authorisation; analytics provider not chosen yet |
| Research Analyst | research pipeline, briefs, reference library; write `research/` | `anthropic-skills:deep-research`, `ecc:deep-research`, `tavily:*`, `ecc:exa-search`, built-in web search and fetch; Notion for the library; no arXiv or RSS alerts, no Zotero |
| Technical Writer | drafts with diagrams and runnable code; write `content/posts/` as `draft: true` only | `anthropic-skills:docs`, `ecc:article-writing`, `zizi-skills:plain-language`, `engineering:documentation`; MCP draw.io, Miro; no command or subagent |
| Technical Editor | fact-check, code verification, style guide, templates; set draft status, publishing needs Venkat | nothing suitable: no fact-check or source-verification skill and no style guide (`plain-language` helps only partly) |
| Growth & Community | newsletter, LinkedIn/X drafts, outreach; drafts only, sending and posting need Venkat | `social-media-skills:*`, `marketing:*`, `ecc:crosspost`, `ecc:social-publisher`, `ecc:content-engine`; `/ecc:marketing-campaign`; agent `ecc:marketing-agent`; Klaviyo needs authorisation, HubSpot connector failed, newsletter provider not chosen |
| Venkat | approvals, accounts, spending, production deploys, publishing | Asana and GitHub web; MCP Asana connected |

## Gaps and their status

Found by the audit on 19 Nov 2026; status after the harness build.

| # | Gap | Status | Evidence and what remains |
|---|---|---|---|
| 1 | Subagents | Closed | 14 files in `.claude/agents/` with name, trigger description, tools allow-list and `model: inherit`; shape enforced by `tests/unit/claudeConfig.test.ts`. Provisional until the roster and RACI (stage 0B) are approved. MCP tools are not in the allow-lists because their ids differ per machine. |
| 2 | Project skills | Partly | 7 skills: `new-post`, `review-pr`, `security-check`, `seo-audit`, `gate-check`, `release`, `hotfix`. Still missing: fact-check and source-verification skill and style guide, research pipeline and reference library, editorial QA checklist, agent completion protocol. They belong to the stage 6 and 0B tasks. |
| 3 | Slash commands | Closed | `/status` and `/handoff`; skills cover everything else. |
| 4 | Permissions | Closed | `.claude/settings.json` allow, ask and deny rules (denies `.env`, keys, force pushes; asks before merge, tag and release). |
| 5 | Model per role | Closed | `model: inherit` for all 14 roles, the default model. |
| 6 | Repo-level hooks | Partly | `block-secrets` and `pre-commit-gate` are registered and their logic is unit-tested. Not covered: deploy, DNS, publish, spend and post guards (no tooling yet); the Code Reviewer gate is a skill, not a hook. Unverified: Claude Code invoking the hooks in a fresh session. |
| 7 | MCP | Open | Needs Venkat: which services to authorise (GitHub connector, Figma, Canva, Datadog, PagerDuty, Ahrefs, Similarweb, Amplitude, Klaviyo, Slack), and the analytics and newsletter ADRs. |
| 8 | Playwright, Cucumber | Open | Belongs to the QA tasks. |
| 9 | Fresh-session load of `CLAUDE.md` | Open | Manual check: new session, ask for the commit convention. |
| 10 | `ecc@ecc` install note | Open | Confirm nothing it lists is needed. |

Open and partial items need Venkat's acceptance, or they stay on their owning tasks.
