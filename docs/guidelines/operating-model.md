# Operating model

How agents pick up, do, hand off and finish work. The short rules are in `CLAUDE.md` (Agent completion protocol); this file holds the templates and formats.

## Task template

Every Asana task, and every task an agent writes for another, has these parts.

- **Context:** why the task exists and which goal (G1 to G4) or gate it serves.
- **Owner, reviewer, approver:** roles as in `docs/team.md`.
- **Depends on:** tasks or gates that must be complete first.
- **Inputs:** documents, decisions and data the owner needs, with links.
- **Steps:** the plan, small enough to finish in one branch and one PR.
- **Outputs:** the files or changes produced, with paths.
- **Acceptance criteria (Done when):** checkable statements; each needs evidence.
- **Evidence:** commit hash or PR link, command output, file path or screenshot, one per criterion.

## Hand-off protocol

When work moves from one role to another, post one Asana comment containing:

1. **Artifact link:** the PR, file path or document the next role needs.
2. **Summary:** what was done, in two to four lines, and what the next role should do.
3. **Open questions:** anything undecided, with who must decide.

Then name the next role (or Venkat) and set Task Progress to Waiting if you are blocked on them. The `/handoff` command produces this comment.

## Definition of Done

A task is done only when all of these hold.

- Every acceptance criterion is met and has evidence.
- Tests were written first and pass; lint, format, typecheck and build are clean; CI is green.
- The PR links its Asana task and has a Conventional Commit title; no secrets are committed.
- Documentation affected by the change is updated.
- The named reviewer posted `REVIEW: APPROVED` (or Venkat waived the review in writing).
- If the task has a `[Venkat]` subtask, he completed it.

Evidence requirements: link, do not describe. A claim without a commit, PR, output or file path is treated as not done.

## Daily stand-up

The PM Orchestrator posts one note per working day in Asana Messages, using this format and keeping it under 15 lines.

- **Done since the last note:** tasks and PRs, with links.
- **Doing today:** task per role.
- **Blocked:** item, who or what it waits on, since when.
- **Needs Venkat:** approvals, decisions and accounts, oldest first.
- **Risks:** anything that threatens the next gate date.
