# Progress overview

Updated 2026-11-19. Source of truth for status is Asana; these files mirror it locally.

**Tasks complete: 2/96.** Stack chosen (ADR-001, Astro 5 + TypeScript); scaffold, lint, format and CI are in PR #2; content model, draft flow, SEO and unstyled pages (39 tests, 100% on src/lib) are in PR #3. Design, styling, newsletter, analytics and posts are not built.

## Goals

| Goal | Target | Status |
|---|---|---|
| G1 Launch production-ready blog, all M4 gates passed | 14 Dec 2026 | Not met (not started) |
| G2 10 verified posts published | 15 Feb 2027 | Not met (0/10) |
| G3 100 confirmed subscribers | 26 Feb 2027 | Not met (0/100) |
| G4 1,000 monthly unique readers | Feb 2027 | Not met |

## Stages

| Stage | File | Done |
|---|---|---|
| 0A. Agent Harness & Dev Environment Setup | [01-0a-agent-harness-dev-environment-setup.md](01-0a-agent-harness-dev-environment-setup.md) | 2/9 |
| 0B. Governance & Agent Team Setup | [02-0b-governance-agent-team-setup.md](02-0b-governance-agent-team-setup.md) | 0/5 |
| 1. Specification & Architecture | [03-1-specification-architecture.md](03-1-specification-architecture.md) | 0/9 |
| 2. Design (Brand, UX & IA) | [04-2-design-brand-ux-ia.md](04-2-design-brand-ux-ia.md) | 0/5 |
| 3. Build & Integration | [05-3-build-integration.md](05-3-build-integration.md) | 0/10 |
| 4. Quality, Security & Performance Gates | [06-4-quality-security-performance-gates.md](06-4-quality-security-performance-gates.md) | 0/11 |
| 5. Deployment & Launch | [07-5-deployment-launch.md](07-5-deployment-launch.md) | 0/7 |
| 6. Content Research & Production | [08-6-content-research-production.md](08-6-content-research-production.md) | 0/22 |
| 7. Growth & Distribution | [09-7-growth-distribution.md](09-7-growth-distribution.md) | 0/7 |
| 8. Operations & Maintenance | [10-8-operations-maintenance.md](10-8-operations-maintenance.md) | 0/6 |
| 9. Measure, Learn & Improve | [11-9-measure-learn-improve.md](11-9-measure-learn-improve.md) | 0/5 |

## Gate milestones

| Gate | Date | Status |
|---|---|---|
| M0 | 2026-11-24 | Not started |
| M1 | 2026-11-27 | Not started |
| M2 | 2026-12-01 | Not started |
| M3 | 2026-12-04 | Not started |
| M4 | 2026-12-09 | Not started |
| M5 | 2026-12-14 | Not started |
| M6 | 2026-12-23 | Not started |
| M7 | 2027-02-15 | Not started |
| M8 | 2027-02-26 | Not started |
| M9 | 2027-03-05 | Not started |

## Blockers
- ADR-001 needs reviews and Venkat's approval subtask.
- astro check/build blocked on the Windows dev machine by Application Control; verified in Linux CI only.
- Add `checks` as a required status check on main/develop (CI now runs).
- Account creation, spending, DNS and publishing need Venkat (approval gates).
