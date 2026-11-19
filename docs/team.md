# Team roster and RACI

The team is Venkat (human owner and approver) and 14 agent roles. Every agent role is a Claude Code subagent in `.claude/agents/` running on the default model (`model: inherit`). This file is the roster of record; changes to it need Venkat's approval. Every Asana task names an Agent Owner, and the PM Orchestrator re-checks this in each `gate-check`.

## Roster

| Role | Subagent | Purpose | Inputs | Outputs | Tools | Limits |
|---|---|---|---|---|---|---|
| Venkat (human) | none | Owner and approver of every gate | Evidence and requests from agents | Decisions, approvals, accounts, spending, publishing | n/a | Only human who may do the actions in `docs/guidelines/approval-gates.md` |
| PM Orchestrator | `pm-orchestrator` | Plan, gates, hand-offs, status | Asana, `progress/`, CI | Status updates, gate verdicts, hand-offs | Read, Grep, Glob, Edit, Write, Bash | No product code; never closes a task without its reviews and approvals |
| Product Strategist | `product-strategist` | PRD, SRS, content pillars, topic backlog | Charter, research, reader evidence | `docs/specs/`, backlog | Read, Grep, Glob, Edit, Write, WebSearch, WebFetch | Specs and backlog only; sources cited |
| Solution Architect | `solution-architect` | ADRs, architecture, content model | Requirements, constraints | `docs/adr/`, architecture docs | Read, Grep, Glob, Edit, Write, WebFetch, Bash | Paid services need Venkat |
| UX/UI Designer | `ux-ui-designer` | Brand, IA, design system, accessibility spec | PRD, content model | Design docs and tokens | Read, Grep, Glob, Edit, Write, WebSearch, WebFetch | No paid assets; WCAG 2.2 AA |
| Frontend Engineer | `frontend-engineer` | Astro site, content model, SEO helpers | Specs, designs, failing tests | `src/`, `tests/`, PRs | Read, Grep, Glob, Edit, Write, Bash | Test first; never deploys |
| DevOps & SRE | `devops-sre` | CI/CD, hosting, monitoring, backups | ADRs, CI results | Workflows, scripts, runbooks | Read, Grep, Glob, Edit, Write, Bash, WebFetch | Production, DNS, paid services need Venkat |
| QA Engineer | `qa-engineer` | Tests and quality gates | Acceptance criteria | Tests, reports, defects | Read, Grep, Glob, Edit, Write, Bash | Reports product defects to the owner |
| Security Engineer | `security-engineer` | Threat model, secrets, audits | Diffs, dependencies, config | Severity-ranked findings | Read, Grep, Glob, Bash, WebFetch | Read-only; no secret values in output |
| Code Reviewer | `code-reviewer` | Independent PR review | PR diff, CI, criteria | `REVIEW:` verdict comments | Read, Grep, Glob, Bash | Read-only; never pushes or merges |
| SEO & Analytics | `seo-analytics` | Search visibility, analytics, KPIs | Built output, analytics | Audits, KPI reports | Read, Grep, Glob, Edit, Write, Bash, WebFetch | No post copy; no tracking without Venkat |
| Research Analyst | `research-analyst` | Verified, cited sources | Topic, primary sources | `research/` briefs | Read, Grep, Glob, Edit, Write, WebSearch, WebFetch | Every claim sourced |
| Technical Writer | `technical-writer` | Post drafts with diagrams and code | Research brief | `content/posts/` as `draft: true` | Read, Grep, Glob, Edit, Write, Bash | Never publishes |
| Technical Editor | `technical-editor` | Fact-check, run code, style | Draft and sources | Edited draft, QA comment | Read, Grep, Glob, Edit, Bash, WebSearch, WebFetch | Edits existing drafts only |
| Growth & Community | `growth-community` | Newsletter, social, outreach drafts | Published posts, analytics | Drafts | Read, Grep, Glob, Edit, Write, WebSearch | Drafts only; sending and posting need Venkat |

## RACI by stage

Responsible does the work, Accountable owns the outcome and signs off (always Venkat), Consulted is asked before and during, Informed is told after. Informed is all agents through the fortnightly status update.

| Stage | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| 0A. Agent harness and dev environment | Solution Architect, DevOps & SRE, Code Reviewer, QA Engineer | Venkat | PM Orchestrator, Security Engineer | All agents |
| 0B. Governance and agent team | PM Orchestrator, Security Engineer | Venkat | DevOps & SRE | All agents |
| 1. Specification and architecture | Product Strategist, Solution Architect, Security Engineer, QA Engineer, SEO & Analytics | Venkat | PM Orchestrator | All agents |
| 2. Design | UX/UI Designer | Venkat | Frontend Engineer, SEO & Analytics, QA Engineer | All agents |
| 3. Build and integration | Frontend Engineer, DevOps & SRE, SEO & Analytics | Venkat | Code Reviewer, Security Engineer | All agents |
| 4. Quality, security and performance gates | QA Engineer, Security Engineer, DevOps & SRE, SEO & Analytics, Code Reviewer | Venkat | PM Orchestrator | All agents |
| 5. Deployment and launch | DevOps & SRE, QA Engineer, Growth & Community | Venkat | Security Engineer | All agents |
| 6. Content research and production | Research Analyst, Technical Writer, Technical Editor, SEO & Analytics | Venkat | PM Orchestrator | All agents |
| 7. Growth and distribution | Growth & Community | Venkat | SEO & Analytics | All agents |
| 8. Operations and maintenance | DevOps & SRE, Security Engineer | Venkat | QA Engineer | All agents |
| 9. Measure, learn and improve | SEO & Analytics, PM Orchestrator | Venkat | All agents | All agents |

## Reviewers

Every task names a reviewer role. The review is done by that role's subagent or a fresh session, never by the session that did the work. Venkat may waive a review in writing (chat or an Asana comment); the waiver is recorded on the task.

## Escalation path

1. **Owner agent:** tries to unblock itself. If it cannot, it sets Task Progress to Waiting and comments `BLOCKED: <item> needs <person or decision>`.
2. **PM Orchestrator:** triages blocked tasks in the daily stand-up and routes them to the right role or to Venkat.
3. **Venkat:** decides. Target response is within 24 hours on working days; approvals are batched at each gate.
4. **Urgent (Sev 1: site down, security incident, leaked secret):** the agent stops risky work, comments `ESCALATION: Sev 1` on the task and @mentions Venkat immediately, then follows `docs/guidelines/secrets-and-access.md` or the incident runbook.
5. **Sev 2 (degraded, failing gate on the critical path):** raised the same day; Venkat answers within 24 hours.
