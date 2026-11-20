# Post workflow

Status: draft, awaiting Venkat's approval. "Agreed", in the Asana acceptance criteria, means his written approval, recorded as a comment on the task.

Source: Asana task 1220688987014029

## Purpose and scope
This file says how one post moves from idea to readers. It names seven stages, who owns each one, and what each stage hands to the next.

It covers every post, including the planned posts 1 to 10 in `docs/prd/content-pillars.md`. It does not repeat the steps of the `new-post` skill or the checks in the style guide. It links to them.

- Skill: `.claude/skills/new-post/SKILL.md`
- Style guide: `docs/guidelines/editorial-style-guide.md`
- Operating model and hand-offs: `docs/guidelines/operating-model.md`
- Approval list: `docs/guidelines/approval-gates.md`
- Completion protocol and content rules: `CLAUDE.md`

Timing is not set here. Days per stage are set in the editorial calendar, which is still to be created (Asana task 1220688744221503).

## The seven stages

| N | Stage | Owner (role, subagent) | Input | Output and done-when evidence |
|---|---|---|---|---|
| 1 | Research brief | Research Analyst, `research-analyst` | Topic from the Asana task and `docs/prd/content-pillars.md` | Brief in `research/briefs/` with sources and access dates. Evidence: the file path and the commit or PR link. |
| 2 | Draft | Technical Writer, `technical-writer` | The brief and the style guide | `content/posts/<slug>.md` with `draft: true`, runnable code and alt text. Evidence: the PR link, the output of each code sample run and passing `npm run build`. |
| 3 | Technical edit | Technical Editor, `technical-editor` | The draft and the brief's sources | QA comment that ticks every item of the Content QA checklist except two: the SEO item, which closes at stage 4, and the approval request, which is made at the end of stage 4. Evidence: the comment link and passing `npm run check:content` and `npm run build`. |
| 4 | SEO | SEO & Analytics, `seo-analytics` | The edited draft | Title, description, headings and internal links checked with the `seo-audit` skill. The Technical Editor then ticks the SEO item and posts the APPROVAL REQUEST on the Asana task, linking the QA comment. Evidence: the audit result and the APPROVAL REQUEST comment. |
| 5 | Final review and approval | Venkat | The PR with REVIEW: APPROVED from the PR reviewer, the QA comment and the SEO result | Written approval to publish, or a list of changes. Evidence: Venkat's comment. |
| 6 | Schedule, publish and verify | PM Orchestrator | Approved PR and Venkat's approval | After Venkat approves `draft: false`, a separate commit in a separate PR into `develop` that changes only `draft`, then the live page checked. The deploy, the release tag and the merge into `main` each need their own APPROVAL REQUEST. Evidence: the commit, each APPROVED reply and the check result. Publish date is set in the editorial calendar. |
| 7 | Distribute | Growth & Community, `growth-community` | The live post and its URL | Draft messages for each channel. Nothing is posted or sent until Venkat approves it. Evidence: the drafts and Venkat's approval. |

Two reviews apply. The Technical Editor does stage 3 and is never the session that drafted the post. The PR reviewer approves the PR with `REVIEW: APPROVED` and is never the session that wrote it.

## Asana subtasks per post
Each post task gets one subtask per stage. The role prefix shows who owns it.

1. `[Research Analyst] Research brief`
2. `[Technical Writer] Draft`
3. `[Technical Editor] Technical edit`
4. `[SEO & Analytics] SEO`
5. `[Venkat] Final review and approval`
6. `[PM Orchestrator] Schedule, publish and verify`
7. `[Growth & Community] Distribute`

An agent never completes a [Venkat] subtask or another role's subtask. Each owner completes their own subtask once its output is committed through a PR.

## The gate rule
No post publishes without step 3 and step 5 complete.

- Step 3 is the technical edit. Step 5 is Venkat's final review and approval.
- Posts start with `draft: true`.
- Venkat alone approves `draft: false`. The change is a separate commit, in a separate PR into `develop` that changes only `draft`, made after his approval.
- Approval is per action and does not carry over. His stage 5 approval covers `draft: false` only. The deploy, the release tag and the merge into `main` each need their own `APPROVAL REQUEST`, using the `release` skill. An agent never publishes by itself.
- Posting on social media and sending newsletters need Venkat's approval each time. See `docs/guidelines/approval-gates.md`.

### How the gate is enforced today
This rule is not enforced by tooling. It is procedural, like the other publish rules in `docs/guidelines/approval-gates.md`. The controls in use are:

1. The `[Venkat] Final review and approval` subtask is complete in Asana. Only Venkat completes it.
2. Before the `draft: false` change, the PM Orchestrator checks the QA comment (every item ticked) and Venkat's `APPROVED` reply, and puts both links in the PR.
3. The PR reviewer checks both links before writing `REVIEW: APPROVED`.

### Control not built yet
A `check:content` or CI rule could fail the build when a changed `draft` goes to `false` with no approval link. It is not built. Whether to build it needs Venkat's decision. Until then, a reviewer who skips the steps above is not stopped by tooling.

## Hand-off template
Post this as an Asana comment when a stage ends. Fill every field.

```
HAND-OFF
Post: <number and title>
Stage done: <stage number and name>
Branch and PR: <branch name and PR link>
Output: <file path or link>
Evidence: <one link or command output per done-when item>
Open questions: <list, or "none">
Next owner: <role and subagent, or Venkat>
```

Example, stage 1 of Post 1. All values are placeholders.

```
HAND-OFF
Post: 1, <post title>
Stage done: 1 Research brief
Branch and PR: feature/<asana-task-id>-<slug>, <PR link>
Output: research/briefs/<brief-file>.md
Evidence: <commit hash>; <link to each source with access date>
Open questions: <none, or the question and who must answer>
Next owner: Technical Writer, technical-writer
```

## What blocks a stage
A stage is blocked when:

- A claim has no source.
- A code sample fails when run.
- `npm run check:content` fails.
- A dependency task is still open.

To record a block:

1. Set Task Progress to Waiting.
2. Comment starting with `BLOCKED:`, then the item and who or what is needed. For example: `BLOCKED: claim 3 in the draft needs a primary source from the Research Analyst`.
3. Carry on with any work that is not blocked.

Remove the block only when the item is fixed and shown with evidence.

## Where the checks live
The checks for stage 3 are in the Content QA checklist in `docs/guidelines/editorial-style-guide.md`. Tag and series rules are in `docs/prd/content-pillars.md`. Do not copy them into a hand-off. Link them.
