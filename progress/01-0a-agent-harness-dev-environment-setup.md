# 0A. Agent Harness & Dev Environment Setup

Source: Asana project "Agents blog". Last updated 2026-11-19. Done: 2/9.

| ✓ | Task | Due | Owner | Status | Subtasks | Notes |
|---|---|---|---|---|---|---|
| x | ADR-001: Core tech stack (language, framework, package manager, test & lint tools) | 2026-11-20 | Solution Architect Agent | Done | 4 | Completed in Asana by Venkat; PR #2 ready for review; DevOps confirmation and REVIEW: APPROVED still open |
| x | Audit AI team & harness capabilities (Claude Code, Codex, Cursor, Antigravity) | 2026-11-20 | PM Orchestrator Agent | Done | 8 | Claude Code matrix and gap list merged; other tools out of scope per Venkat 19 Nov; reviewer approval waived by Venkat |
|   | Code maintainability guidelines: Clean Code, SOLID, TDD/BDD, data structures & algorithms | 2026-11-23 | Code Reviewer Agent | In progress | 6 | Lint/format/coverage thresholds done in PR #2; code-quality.md sections, AGENTS.md summary, PR checklist still to do |
|   | Create missing skills, commands/workflows & subagents for every agent role | 2026-11-23 | Solution Architect Agent | Not started | 6 |  |
|   | Cross-platform task runner: Makefile with Windows support | 2026-11-23 | DevOps & SRE Agent | In progress | 5 | Makefile + make.ps1 call npm scripts; e2e/bdd/release stubs; GNU make untested; astro build blocked on Windows dev machine |
|   | Git branching model & PR workflow (main / develop / feature / release / hotfix) | 2026-11-23 | DevOps & SRE Agent | In progress | 12 | Hook, changelog, CODEOWNERS, release rehearsal merged (PR #4); rule = 0 approvals + required checks; Code Reviewer, Security approvals and Venkat sign-off open |
|   | Project scaffold: folder structure, docs, research, tests, tooling | 2026-11-23 | DevOps & SRE Agent | In progress | 8 | Scaffold, README, .github, Astro project, lint/format/test scripts in PR #2; fresh-clone check on 3 OSes pending |
|   | Write project guidelines: AGENTS.md (single source of truth) + CLAUDE.md & tool adapters | 2026-11-23 | Solution Architect Agent | Ready for review | 5 | AGENTS.md, CLAUDE.md, .cursor rule done; awaiting reviewers and Venkat approval |
|   | Verify harness end to end in all four tools (smoke test) | 2026-11-24 | QA Engineer Agent | Not started | 4 |  |
