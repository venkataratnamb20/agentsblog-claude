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

The checklist lives in `CLAUDE.md`. This section only says what counts as evidence.

- Evidence is a link, not a description: a commit hash, PR URL, command output, file path or screenshot.
- Each acceptance criterion has its own piece of evidence in the `READY FOR REVIEW` comment.
- A claim without evidence is treated as not done.
- A review waiver counts only when Venkat's words are quoted on the task.

## Daily stand-up

The PM Orchestrator posts one note per working day in Asana Messages, using this format and keeping it under 15 lines.

- **Done since the last note:** tasks and PRs, with links.
- **Doing today:** task per role.
- **Blocked:** item, who or what it waits on, since when.
- **Needs Venkat:** approvals, decisions and accounts, oldest first.
- **Risks:** anything that threatens the next gate date.

## Fortnightly status update

The PM Orchestrator posts a project status update in Asana every second Friday. Keep it to one screen.

- **Goals:** G1 to G4, each with status (on track, at risk, off track) and the evidence.
- **Gates:** the next gate, its date, what blocks it.
- **Done and next:** tasks completed since the last update; the next two weeks.
- **Risks:** the top three, with owner and mitigation.
- **Decisions needed from Venkat:** with the date each is needed by.
