# Editorial calendar

Status: draft, awaiting Product Strategist review and Venkat's approval.
Source: Asana task 1220688744221503

This calendar dates every stage of posts 1 to 10 and names the owner of each stage. The stages and owners come from docs/guidelines/post-workflow.md. The topics and order come from docs/prd/topic-backlog.md.

## Rules
- Posts publish on Mondays, one a week. Posts 1 to 3 launch together on 14 Dec 2026, and nothing publishes on 21 and 28 Dec (the holiday gap).
- A post counts as drafted ahead when it is technically edited (stage 3 done). This is stricter than the charter's "drafted ahead", because an unedited draft is not safe to publish. Venkat's approval still comes at stage 5.
- The PR reviewer approves each post's PR on or before its SEO date, so stage 5 has `REVIEW: APPROVED` as an input. The `draft: false` PR is opened only on the publish day, after a fresh check that Venkat's approval is on the task.
- A stage due date is the day that stage is complete.
- Stage order is strictly ascending: brief, draft, tech edit, SEO, approval, publish.
- Approval falls at least one working day before publish.
- Distribution falls 0 to 4 days after publish.
- Every date is a weekday.
- No stage due date falls inside the holiday gap.
- No two posts share a due date for the same owner at the same stage. Launch posts 1 to 3 are staggered by one working day per stage.
- Venkat's approvals may be batched, as docs/guidelines/approval-gates.md allows.
- Minimum stage lead times, in working days, are set here as post-workflow.md says:
  - Brief to draft: 3.
  - Draft to tech edit: 2.
  - Tech edit to SEO: 1.
  - SEO to approval: 1.
  - Approval to publish: 1.
- Distribution is on the publish day for posts 4 to 10. For posts 1 to 3 it is staggered over three days.

## Assumptions
- The holiday gap is the two weeks 21 Dec 2026 to 1 Jan 2027. No document defines the holiday gap, so Venkat must confirm it.
- Timings are in working days.
- Venkat is available for approvals on the dates shown.
- No keyword validation has run. The order may be revisited only with Venkat's approval.
- The plan keeps posts 4 to 10 as planned (Venkat, 20 Nov 2026, recorded in docs/prd/topic-backlog.md), and posts 1 to 3 launch on 14 Dec 2026.
- M1 is complete in Asana (20 Nov 2026), so stage 6 work, including the first briefs on 25 Nov, is unblocked.
- Publish dates are the due dates on the Asana post tasks, read on 20 Nov 2026.

## Calendar
| Post | Publish | Brief | Draft | Tech edit | SEO | Approval | Distribute | Topic | Series |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 2026-12-14 | 2026-11-25 | 2026-12-01 | 2026-12-04 | 2026-12-07 | 2026-12-10 | 2026-12-14 | What is an AI agent | Agents from first principles |
| 2 | 2026-12-14 | 2026-11-26 | 2026-12-02 | 2026-12-07 | 2026-12-08 | 2026-12-10 | 2026-12-15 | Anatomy of an agent | Agents from first principles |
| 3 | 2026-12-14 | 2026-11-27 | 2026-12-03 | 2026-12-08 | 2026-12-09 | 2026-12-10 | 2026-12-16 | Tool calling and MCP | Agent tooling |
| 4 | 2027-01-04 | 2026-11-30 | 2026-12-07 | 2026-12-09 | 2026-12-10 | 2026-12-16 | 2027-01-04 | Agent memory | Agents from first principles |
| 5 | 2027-01-11 | 2026-12-01 | 2026-12-08 | 2026-12-10 | 2026-12-11 | 2026-12-16 | 2027-01-11 | Stateful agents with LangGraph | Agent tooling |
| 6 | 2027-01-18 | 2026-12-02 | 2026-12-09 | 2026-12-11 | 2026-12-14 | 2026-12-16 | 2027-01-18 | Multi-agent patterns | none |
| 7 | 2027-01-25 | 2026-12-14 | 2026-12-18 | 2027-01-05 | 2027-01-06 | 2027-01-21 | 2027-01-25 | Deep agents | none |
| 8 | 2027-02-01 | 2026-12-17 | 2027-01-04 | 2027-01-07 | 2027-01-08 | 2027-01-28 | 2027-02-01 | Evaluating agents | Production agents |
| 9 | 2027-02-08 | 2027-01-05 | 2027-01-12 | 2027-01-14 | 2027-01-15 | 2027-02-04 | 2027-02-08 | Guardrails and human-in-the-loop | Production agents |
| 10 | 2027-02-15 | 2027-01-07 | 2027-01-15 | 2027-01-20 | 2027-01-21 | 2027-02-11 | 2027-02-15 | Research roundup #1 | Research roundup |

## Owners per stage
| Stage | Name | Owner |
|---|---|---|
| 1 | Research brief | Research Analyst, research-analyst |
| 2 | Draft | Technical Writer, technical-writer |
| 3 | Technical edit | Technical Editor, technical-editor |
| 4 | SEO | SEO & Analytics, seo-analytics |
| 5 | Final review and approval | Venkat |
| 6 | Schedule, publish and verify | PM Orchestrator |
| 7 | Distribute | Growth & Community, growth-community |

The SEO stage owner posts nothing to Venkat. The Technical Editor posts the APPROVAL REQUEST at the end of stage 4, as post-workflow.md says.

## Buffer check
Posts 4 to 6 are technically edited before the holiday gap. For each publish date from post 4 to post 8, these later posts are already tech-edited:

| Publish of | Date | Later posts tech-edited by then | Count |
|---|---|---|---|
| Post 4 | 2027-01-04 | 5, 6 | 2 |
| Post 5 | 2027-01-11 | 6, 7, 8 | 3 |
| Post 6 | 2027-01-18 | 7, 8, 9 | 3 |
| Post 7 | 2027-01-25 | 8, 9, 10 | 3 |
| Post 8 | 2027-02-01 | 9, 10 | 2 |

Posts 9 and 10 cannot keep two ahead, because only ten posts are planned. Monthly roundups after post 10 are outside this calendar.

## Risks and decisions for Venkat
- Post 10 publishes 15 Feb 2027, the same day as the G2 deadline. There is no slack. Any slip misses G2 unless a post is pulled forward. Post 10 is technically edited on 20 Jan, so it can move up if a week slips. Decision for Venkat: which post moves.
- The KPM "draft-to-publish cycle 5 days or less" fails for all ten posts as dated, not only for the buffered ones. Draft to publish is 11 to 13 days for posts 1 to 3 and 31 days for post 10. Proposal: measure it to "approval-ready" for every post. Decision for Venkat.
- The KPM "weekly cadence hit rate 90%+" cannot be met. From 14 Dec to 15 Feb there are ten Mondays and eight have a post, which is 80%, because 21 and 28 Dec have none by design and posts 1 to 3 share one day. Decision for Venkat: exclude the gap weeks, or accept 80%.
- The holiday gap needs Venkat's availability. Approvals for posts 4 to 6 are requested before the gap, all on 16 Dec 2026. These approvals will be several weeks old on the publish day. Venkat may ask for a re-check at publish. If Venkat is away, the default is to hold the post, because silence is not approval (docs/guidelines/approval-gates.md). Decision for Venkat: confirm the holiday gap dates and whether agents also pause during it.
- Hypercare ends on 23 Dec 2026, inside the assumed holiday gap. This calendar plans no content work from 21 Dec to 1 Jan. Hypercare monitoring is outside it and belongs to the DevOps Engineer. Decision for Venkat: who covers 22 and 23 Dec.
- Deploy, release tag and merge into main still need their own APPROVAL REQUEST on each publish day (docs/guidelines/approval-gates.md). Decision for Venkat: who publishes during and after the holiday gap.
- Distribution dates assume Venkat approves each channel draft once the post is live and its URL is known. Nothing is posted or sent until he approves it, each time (docs/guidelines/approval-gates.md). Venkat posts the community shares himself (Asana task "Share posts in communities (HN, Reddit, LangChain forum)", drafted by agent, posted by Venkat). A late approval moves distribution, not the publish date.
- Venkat's approvals are a single point of failure. After post 6, nothing is approved far ahead: post 7 is approved on 21 Jan, four days before publish, and posts 8 to 10 follow the same pattern. The target response time is 24 hours (docs/guidelines/approval-gates.md). A missed approval holds the post, not the date.
- Venkat's load peaks on three days. On 10 Dec he gives three final reviews, the day after the M4 gate on 9 Dec, with 11 Dec as a spill day. On 14 Dec the three launch posts add their `draft: false` approvals and the deploy, tag and merge requests. On 4 Jan post 4 adds the same plus a distribution approval, and distribution may move to 5 Jan. Posts 1 to 3 approvals are batched on 10 Dec, after the M4 gate. Venkat to confirm this is acceptable.
- The Technical Writer drafts posts 4 to 6 on 7, 8 and 9 Dec, and the Technical Editor edits them on 9 to 11 Dec. Each post needs its code samples run and a passing `npm run build`. The Research Analyst writes six briefs between 25 Nov and 2 Dec. A late brief or edit moves the next stage.
- The PR reviewer's approval is scheduled on or before each SEO date (see Rules). A late PR review holds stage 5.
- The series box and series pages need the `series` and `seriesOrder` fields, which are not built yet (docs/prd/content-pillars.md). Posts 1 and 2 are in a series and launch on 14 Dec, so the Frontend Engineer's schema work must land before then. Decision for Venkat: otherwise the series start after posts 1 to 3.
- The Asana criterion "every post task has dated, owned subtasks" is not met until the subtasks exist. The task stays open until Venkat approves this calendar and the 70 subtasks are created.
- Dates for posts 7 to 10 are not fixed by the charter beyond their publish days. They may move with Venkat's approval.

The Asana subtasks are created after Venkat approves this calendar. Nothing has been created in Asana yet. Each post gets seven subtasks, named as in post-workflow.md, each with its due date from the Calendar table:

1. `[Research Analyst] Research brief`, due on the Brief date.
2. `[Technical Writer] Draft`, due on the Draft date.
3. `[Technical Editor] Technical edit`, due on the Tech edit date.
4. `[SEO & Analytics] SEO`, due on the SEO date.
5. `[Venkat] Final review and approval`, due on the Approval date.
6. `[PM Orchestrator] Schedule, publish and verify`, due on the Publish date.
7. `[Growth & Community] Distribute`, due on the Distribute date.
