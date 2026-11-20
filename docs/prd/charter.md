# Project charter: Agents Blog

Copy of the charter in the Asana project description (taken 20 Nov 2026). Asana stays the source of truth; update this copy when the charter changes.

- **Product owner and approver:** Venkat (human)
- **Delivery team:** 14 AI agents working in Claude Code (one tool per project)
- **Phase 1:** 19 Nov 2026 to 5 Mar 2027. **Launch:** 14 Dec 2026

## 1. Purpose

A practical, research-backed blog on AI agents (architectures, tool calling and MCP, memory, multi-agent systems, evaluation and safety) for engineers building production agentic systems. The site and its content are produced by a team of AI agents, with a human owner approving every key decision.

## 2. SMART goals with KPIs and KPMs

KPIs measure the outcome; KPMs are the leading measures agents track weekly.

| Goal | KPIs (outcome) | KPMs (leading, weekly) | Owner |
|---|---|---|---|
| G1. Launch a production-ready blog on its custom domain by 14 Dec 2026, passing all M4 quality gates | Launch on 14 Dec; 10/10 quality gates passed; 99.9%+ uptime through hypercare (to 23 Dec) | Gate tasks on schedule (%); open Sev 1/2 defects = 0; Lighthouse Perf 90+, Accessibility 95+, SEO 100; critical/high vulnerabilities = 0; CI pass rate 95%+ | PM Orchestrator |
| G2. Publish 10 technically verified AI-agent posts by 15 Feb 2027 | 10 posts live; 80%+ pass the content QA checklist first time | Weekly cadence hit rate 90%+; draft-to-publish cycle 5 days or less; 10+ research sources reviewed per week; 2+ posts drafted ahead | Technical Writer |
| G3. Reach 100 confirmed (double opt-in) newsletter subscribers by 26 Feb 2027 | 100 confirmed subscribers | Visitor-to-subscriber conversion 2%+; open rate 40%+; click rate 5%+; unsubscribes under 1% per send | Growth & Community |
| G4. Reach 1,000 monthly unique readers in February 2027 | 1,000 unique visitors in Feb; returning readers 25%+; average engaged time 3+ min; 5+ backlinks by Mar | Organic search clicks per week (baseline in Dec, then rising); social impressions per post +10% month on month; each post shared in 2+ communities; 100% of posts indexed | SEO & Analytics |

Targets are recalibrated at the January metrics review.

## 3. Scope

- **In scope:** agent harness and development environment; specification, design, build, testing, security, performance, SEO, deployment, operations and maintenance of the blog; weekly posts; newsletter; LinkedIn and X repurposing.
- **Out of scope (Phase 1):** video and podcast, paid ads, sponsorships, guest authors, a comments system.

## 4. Gates

| Gate | Date | Meaning |
|---|---|---|
| M0 | 24 Nov 2026 | Agent harness, team and governance ready (done 20 Nov) |
| M1 | 27 Nov 2026 | Specifications approved |
| M2 | 1 Dec 2026 | Design approved |
| M3 | 4 Dec 2026 | Feature-complete on staging |
| M4 | 9 Dec 2026 | Quality gates passed, go for launch |
| M5 | 14 Dec 2026 | Production launch with posts 1 to 3 |
| M6 | 23 Dec 2026 | Hypercare complete |
| M7 | 15 Feb 2027 | 10 verified posts published |
| M8 | 26 Feb 2027 | 100 confirmed subscribers |
| M9 | 5 Mar 2027 | Q1 review and roadmap refresh |

## 5. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Agent output errors (hallucinated facts or code) | Technical edit with source checks and code run in CI; human approval before publishing |
| Rules drift between CLAUDE.md and docs/guidelines | CLAUDE.md links rather than copies |
| Over-privileged agent access | Scoped tokens, secret scanning, least-privilege subagents, approval gates, quarterly access audit |
| Approval bottleneck on Venkat | Batch approvals at gates; 24-hour response target |
| Missed weeks | Two-post buffer; posts 4 to 6 drafted before the holiday gap |
| Fast-moving field makes posts stale | Date every post; monthly refresh check |
| Low discoverability | Technical SEO, newsletter, community sharing, outreach |
