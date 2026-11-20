# Editorial calendar

Status: draft, awaiting Product Strategist review and Venkat's approval.
Source: Asana task 1220688744221503

This calendar dates every stage of posts 1 to 10 and names the owner of each stage. The stages and owners come from docs/guidelines/post-workflow.md. The topics and order come from docs/prd/topic-backlog.md.

## Rules
- One post publishes each Monday. Posts 1 to 3 launch together on 14 Dec 2026.
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
- The plan keeps posts 4 to 10 as planned (Venkat, 20 Nov 2026), and posts 1 to 3 launch on 14 Dec 2026.
- Publish dates are the due dates on the Asana post tasks, read on 20 Nov 2026.

## Calendar
| Post | Publish | Brief | Draft | Tech edit | SEO | Approval | Distribute |
|---|---|---|---|---|---|---|---|
| 1 | 2026-12-14 | 2026-11-25 | 2026-12-01 | 2026-12-04 | 2026-12-07 | 2026-12-10 | 2026-12-14 |
| 2 | 2026-12-14 | 2026-11-26 | 2026-12-02 | 2026-12-07 | 2026-12-08 | 2026-12-10 | 2026-12-15 |
| 3 | 2026-12-14 | 2026-11-27 | 2026-12-03 | 2026-12-08 | 2026-12-09 | 2026-12-10 | 2026-12-16 |
| 4 | 2027-01-04 | 2026-11-30 | 2026-12-07 | 2026-12-09 | 2026-12-10 | 2026-12-16 | 2027-01-04 |
| 5 | 2027-01-11 | 2026-12-01 | 2026-12-08 | 2026-12-10 | 2026-12-11 | 2026-12-16 | 2027-01-11 |
| 6 | 2027-01-18 | 2026-12-02 | 2026-12-09 | 2026-12-11 | 2026-12-14 | 2026-12-16 | 2027-01-18 |
| 7 | 2027-01-25 | 2026-12-14 | 2026-12-18 | 2027-01-05 | 2027-01-06 | 2027-01-21 | 2027-01-25 |
| 8 | 2027-02-01 | 2026-12-17 | 2027-01-04 | 2027-01-07 | 2027-01-08 | 2027-01-28 | 2027-02-01 |
| 9 | 2027-02-08 | 2027-01-05 | 2027-01-12 | 2027-01-14 | 2027-01-15 | 2027-02-04 | 2027-02-08 |
| 10 | 2027-02-15 | 2027-01-07 | 2027-01-15 | 2027-01-20 | 2027-01-21 | 2027-02-11 | 2027-02-15 |

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
- Post 10 publishes 15 Feb 2027, the same day as the G2 deadline. There is no slack. Any slip misses G2 unless a post is pulled forward.
- The KPM "draft-to-publish cycle 5 days or less" cannot hold for posts drafted ahead for the holiday gap. Proposal: measure it to "approval-ready" instead. Decision for Venkat.
- The holiday gap needs Venkat's availability. Approvals for posts 4 to 6 are requested before the gap, all on 16 Dec 2026. These approvals will be several weeks old on the publish day. Venkat may ask for a re-check at publish.
- Deploy, release tag and merge into main still need their own APPROVAL REQUEST on each publish day (docs/guidelines/approval-gates.md). Decision for Venkat: who publishes during and after the holiday gap.
- Distribution dates assume Venkat has approved the channel drafts first. Nothing is posted or sent until he approves it, each time (docs/guidelines/approval-gates.md). On the community shares, Venkat posts them himself. A late approval moves distribution, not the publish date.
- Posts 1 to 3 approvals are batched on 10 Dec 2026, which is after the 9 Dec M4 gate. Venkat to confirm this is acceptable.
- Dates for posts 7 to 10 are not fixed by the charter beyond their publish days. They may move with Venkat's approval.

The Asana subtasks are created after Venkat approves this calendar. Nothing has been created in Asana yet. Each post gets seven subtasks, named as in post-workflow.md, each with its due date from the Calendar table:

1. `[Research Analyst] Research brief`, due on the Brief date.
2. `[Technical Writer] Draft`, due on the Draft date.
3. `[Technical Editor] Technical edit`, due on the Tech edit date.
4. `[SEO & Analytics] SEO`, due on the SEO date.
5. `[Venkat] Final review and approval`, due on the Approval date.
6. `[PM Orchestrator] Schedule, publish and verify`, due on the Publish date.
7. `[Growth & Community] Distribute`, due on the Distribute date.
