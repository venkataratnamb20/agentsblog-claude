# Capability matrix: Claude Code (primary harness)

- **Status:** complete for Claude Code; awaiting review. Date: 19 Nov 2026.
- **Asana task:** Audit AI team & harness capabilities (gid 1220694720088833).
- **Owner decision (Venkat, chat, 19 Nov 2026):** Claude Code is the working harness. No setup is needed for other tools, so the Codex, Cursor and Antigravity columns are N/A.

## Scope

Claude Code is the only harness the team builds on. `AGENTS.md` stays the single source of truth and `CLAUDE.md` imports it, so another tool can be added later at low cost, but nothing is maintained or tested for other tools. Their installed versions are recorded below for reference only.

## Tool versions

| Tool | Version | How checked | Status |
|---|---|---|---|
| Claude Code | 2.1.328 | `claude --version` | primary, in use |
| Codex | desktop app 26.1111.2228.0; no `codex` CLI on PATH | Windows app package list | installed, not used |
| Cursor | 3.30.14 | `cursor --version` | installed, not used |
| Antigravity | not determined: config folders exist under `~/.gemini`, but no executable or About screen was found | folder listing | not used |

Also on the dev machine: Node 26.13.1 (CI uses Node 22), npm 11.20.0, Git 2.56.1.

## Legend

- **Av** Available: in this repo, or enabled in this Claude Code install and usable now.
- **Re** Reuse: exists in a Claude plugin or connector; needs adoption, authorisation or copying into the project.
- **Mi** Missing: nothing exists; listed as a gap below.
- **NA** Not applicable.
- Columns: **S** skills, **C** commands/workflows, **A** subagents, **MCP**, **H** hooks.

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

## Role × tool matrix

Cells show S C A MCP H for Claude Code. Codex, Cursor and Antigravity are N/A for every role (decision above). The harness is Claude Code for every role; Venkat confirmed this in chat.

| Role | Claude Code (S C A MCP H) | Codex | Cursor | Antigravity | Harness |
|---|---|---|---|---|---|
| PM Orchestrator | Re Re Re Av Av | NA | NA | NA | Claude Code |
| Product Strategist | Re Re Mi Av Av | NA | NA | NA | Claude Code |
| Solution Architect | Re Re Re Av Av | NA | NA | NA | Claude Code |
| UX/UI Designer | Re Re Re Re Av | NA | NA | NA | Claude Code |
| Frontend Engineer | Re Re Re Av Av | NA | NA | NA | Claude Code |
| DevOps & SRE | Re Mi Mi Re Mi | NA | NA | NA | Claude Code |
| QA Engineer | Re Re Re Av Av | NA | NA | NA | Claude Code |
| Security Engineer | Re Re Re Mi Mi | NA | NA | NA | Claude Code |
| Code Reviewer | Re Re Re Re Mi | NA | NA | NA | Claude Code |
| SEO & Analytics | Re Mi Re Re Av | NA | NA | NA | Claude Code |
| Research Analyst | Re Mi Mi Re Av | NA | NA | NA | Claude Code |
| Technical Writer | Re Mi Mi Av Av | NA | NA | NA | Claude Code |
| Technical Editor | Mi Mi Mi Mi Av | NA | NA | NA | Claude Code |
| Growth & Community | Re Re Re Re Av | NA | NA | NA | Claude Code |
| Venkat (human approver) | NA NA NA Av NA | NA | NA | NA | n/a |

H = Av means the git-level `commit-msg` hook and CI apply to the role; it is the only hook that exists in the repo. H = Mi means the role needs a role-specific guard that does not exist yet.

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
4. **`.claude/settings.json`:** no permission allowlist (npm, git, gh) or deny rules (secrets, destructive commands, pushes to protected branches).
5. **Repo-level hooks:** secret-scan pre-commit; a guard for actions on the approval list (deploy, DNS, publish, spend, post); a Code Reviewer gate. The hooks active today live in the user-level `ecc` plugin and are not part of the repo.
6. **MCP (`.mcp.json` missing):** GitHub connector failed to connect (use the `gh` CLI); Figma, Canva, Datadog, PagerDuty, Ahrefs, Similarweb, Amplitude, Klaviyo and Slack need authorisation; HubSpot connector failed; no Zotero or arXiv/RSS source; no analytics or Search Console source and no newsletter provider (their ADRs are not done).
7. **Project tooling not installed:** Playwright (E2E) and Cucumber (BDD), named in ADR-001.
8. **Unverified:** a fresh Claude Code session loading `CLAUDE.md` and `AGENTS.md`. The static check passes, but a live test could not run from this sandbox because the CLI is not logged in. Check: open a new session in this folder and ask "what is the commit convention?"; the answer should be Conventional Commits.
9. **Install note:** `ecc@ecc` reports that its `package.json` sets overrides which this install does not apply. It is enabled; confirm nothing it lists is needed.

Codex, Cursor and Antigravity have no project assets by decision; no gaps are raised for them.
