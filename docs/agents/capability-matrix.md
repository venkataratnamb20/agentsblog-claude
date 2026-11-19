# Capability matrix: Claude Code (primary harness)

- **Status:** complete for Claude Code; awaiting review. Date: 19 Nov 2026.
- **Asana task:** Audit AI team & harness capabilities (gid 1220694720088833).
- **Owner decision (Venkat, chat, 19 Nov 2026):** Claude Code is the only tool for this project. Nothing is set up for Cursor, Codex or Antigravity, so they are not in this matrix.

## Scope

Claude Code only. `AGENTS.md` stays the single source of truth and `CLAUDE.md` imports it. Other tools are not audited, set up or tested.

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
| `CLAUDE.md` (imports `AGENTS.md`) | Av | first line is `@AGENTS.md`; target file exists (52 lines) |
| `AGENTS.md` | Av | stack, approvals, git workflow, commands, Definition of Done |
| `.claude/skills/` | Mi | only `.gitkeep` |
| `.claude/agents/` | Mi | only `.gitkeep` |
| `.claude/commands/` | Mi | does not exist |
| `.claude/settings.json` (permissions, hooks) | Mi | does not exist |
| `.mcp.json` | Mi | does not exist |
| Git hook `commit-msg` (Conventional Commits) | Av | `.husky/commit-msg` |
| CI, CODEOWNERS, PR template | Av | `.github/` |

Observation: the hooks that fire during Claude Code work here (the "Fact-Forcing Gate" on writes and destructive commands) come from the user-level `ecc` plugin. They are not in the repo, so a fresh clone does not carry them.

## Role × Claude Code feature matrix

| Role | A | S | C | MCP | H | P | M |
|---|---|---|---|---|---|---|---|
| PM Orchestrator | Re | Re | Re | Av | Av | Mi | Av |
| Product Strategist | Mi | Re | Re | Av | Av | Mi | Av |
| Solution Architect | Re | Re | Re | Av | Av | Mi | Av |
| UX/UI Designer | Re | Re | Re | Re | Av | Mi | Av |
| Frontend Engineer | Re | Re | Re | Av | Av | Mi | Av |
| DevOps & SRE | Mi | Re | Mi | Re | Mi | Mi | Av |
| QA Engineer | Re | Re | Re | Av | Av | Mi | Av |
| Security Engineer | Re | Re | Re | Mi | Mi | Mi | Av |
| Code Reviewer | Re | Re | Re | Re | Mi | Mi | Av |
| SEO & Analytics | Re | Re | Mi | Re | Av | Mi | Av |
| Research Analyst | Mi | Re | Mi | Re | Av | Mi | Av |
| Technical Writer | Mi | Re | Mi | Av | Av | Mi | Av |
| Technical Editor | Mi | Mi | Mi | Mi | Av | Mi | Av |
| Growth & Community | Re | Re | Re | Re | Av | Mi | Av |
| Venkat (human approver) | NA | NA | NA | Av | NA | NA | NA |

Notes on the cells:

- **H = Av** means the git-level `commit-msg` hook and CI apply to the role; they are the only hooks in the repo. **H = Mi** means the role needs a role-specific guard that does not exist yet.
- **P = Mi** for every role: there is no project `.claude/settings.json`, and the user settings carry no permission rules. Per-role permission needs are in the next table.
- **M = Av** means the default model is usable by every role. Pinning a model per role needs a subagent definition (**A**), so it follows from gap 1.

## What each role needs, and what exists to reuse

| Role | Needs (skills, tools, permissions) | Reuse candidates in this Claude Code install |
|---|---|---|
| PM Orchestrator | planning, status updates, gate checks; Asana; read repo, write `progress/` and docs, comment in Asana; no deploys | skills `engineering:standup`, `zizi-skills:project-manager`, `status-update`, `orchestration`, `ecc:plan-orchestrate`; commands `/ecc:plan`; agents `ecc:planner`, `ecc:loop-operator`; MCP Asana, Notion (connected) |
| Product Strategist | PRD, SRS, topic backlog, research synthesis; write `docs/specs/` | `product-management:write-spec`, `brainstorm`, `roadmap-update`, `synthesize-research`, `zizi-skills:idea-refine`; `/ecc:plan-prd`; MCP Notion, Asana; no subagent |
| Solution Architect | ADRs, architecture, content model; write `docs/adr/`, `docs/specs/` | `engineering:architecture`, `system-design`, `ecc:architecture-decision-records`; `/ecc:feature-dev`; agents `ecc:architect`, `ecc:code-architect`; MCP MDN, draw.io |
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

## Gap list (every Missing item)

1. **Project subagents:** no `.claude/agents/` definitions for any of the 14 roles. Suitable generic reviewers exist (`ecc:*`) but nothing role-specific. No reusable agent at all for Product Strategist, DevOps & SRE, Research Analyst, Technical Writer and Technical Editor.
2. **Project skills (`.claude/skills/`):** per-post workflow (brief, draft, technical edit, SEO, approval, publish, distribute); editorial and content QA checklist; fact-check and source-verification skill and style guide (Technical Editor); research pipeline (arXiv, lab blogs, GitHub trending) and reference library; agent completion protocol and handoff; release and hotfix runbook.
3. **Project commands (`.claude/commands/`):** none exist. Candidates: status, gate check, handoff, new post, release.
4. **`.claude/settings.json` (permissions):** no permission allowlist (npm, git, gh) or deny rules (secrets, destructive commands, pushes to protected branches), and no per-role scopes (for example the Technical Writer may write only `content/posts/` as `draft: true`; the Code Reviewer may comment but not push).
5. **Model per role:** no model is pinned anywhere; per-role model choice needs the subagent definitions from gap 1.
6. **Repo-level hooks:** secret-scan pre-commit; a guard for actions on the approval list (deploy, DNS, publish, spend, post); a Code Reviewer gate. The hooks active today live in the user-level `ecc` plugin and are not part of the repo.
7. **MCP (`.mcp.json` missing):** GitHub connector failed to connect (use the `gh` CLI); Figma, Canva, Datadog, PagerDuty, Ahrefs, Similarweb, Amplitude, Klaviyo and Slack need authorisation; HubSpot connector failed; no Zotero or arXiv/RSS source; no analytics or Search Console source and no newsletter provider (their ADRs are not done).
8. **Project tooling not installed:** Playwright (E2E) and Cucumber (BDD), named in ADR-001.
9. **Unverified:** a fresh Claude Code session loading `CLAUDE.md` and `AGENTS.md`. The static check passes, but a live test could not run from this sandbox because the CLI is not logged in. Check: open a new session in this folder and ask "what is the commit convention?"; the answer should be Conventional Commits.
10. **Install note:** `ecc@ecc` reports that its `package.json` sets overrides which this install does not apply. It is enabled; confirm nothing it lists is needed.

Other tools (Cursor, Codex, Antigravity) are out of scope by decision; no gaps are raised for them.
