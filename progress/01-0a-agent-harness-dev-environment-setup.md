# 0A. Agent Harness & Dev Environment Setup

Source: Asana project "Agents blog". Last updated 2026-11-20. Done: 11/12.

| ✓ | Task | Due | Owner | Status | Subtasks | Notes |
|---|---|---|---|---|---|---|
| x | ADR-001: Core tech stack (language, framework, package manager, test & lint tools) | 2026-11-20 | Solution Architect Agent | Done | 4 | Astro + TypeScript chosen; upgraded to Astro 7 on 20 Nov (ADR 0001 update) |
| x | Audit AI team & Claude Code capabilities | 2026-11-20 | PM Orchestrator Agent | Done | 8 | Capability matrix merged; Claude Code only per Venkat |
| x | Code maintainability guidelines: Clean Code, SOLID, TDD/BDD, data structures & algorithms | 2026-11-23 | Code Reviewer Agent | Done | 6 | Guide, thresholds, PR checklist; 80% floor over all of src (PR 13); approved by Venkat in chat 20 Nov |
| x | Create missing Claude Code skills, slash commands & subagents for every agent role | 2026-11-23 | Solution Architect Agent | Done | 6 | 14 subagents, 7 skills, 2 commands; security review fixes (PR 14); gaps accepted by Venkat 19 Nov |
| x | Cross-platform task runner: Makefile with Windows support | 2026-11-23 | DevOps & SRE Agent | Done | 5 | Makefile + make.ps1 over scripts/task.mjs; CI green on 3 OS (PR 10) |
| x | Git branching model & PR workflow (main / develop / feature / release / hotfix) | 2026-11-23 | DevOps & SRE Agent | Done | 12 | Branch protection on main and develop confirmed 20 Nov |
| x | Project scaffold: folder structure, docs, research, tests, tooling | 2026-11-23 | DevOps & SRE Agent | Done | 8 | Apache-2.0 LICENSE, templates, research index (PR 15); E2E/BDD runners deferred to stage 4 (waived) |
| x | Write project guidelines: CLAUDE.md (single source of truth) | 2026-11-23 | Solution Architect Agent | Done | 5 | CLAUDE.md approved |
| x | Verify harness end to end in Claude Code (smoke test) | 2026-11-24 | QA Engineer Agent | Done | 4 | Results table in the capability matrix; fresh-session CLAUDE.md check still manual |
| x | Fix .claude/settings.json permission rules found by the smoke test | 2026-11-23 | DevOps & SRE Agent | Done | 0 | PR 12 |
| x | Upgrade Astro to 7 to clear the high-severity audit findings | 2026-11-23 | DevOps & SRE Agent | Done | 0 | Audit 0 vulnerabilities; audit blocks CI (PR 17) |
|   | Harden agent guardrails: deferred security review findings | 2026-11-27 | Security Engineer Agent | Not started | 0 | Follow-up from the Security Engineer review; not an M0 blocker |
