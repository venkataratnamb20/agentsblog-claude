---
name: review-pr
description: Use when a pull request needs an independent review before merge. Produces a REVIEW: APPROVED or REVIEW: CHANGES REQUESTED comment with evidence; never pushes or merges.
---

# review-pr

## Steps
1. Read the PR: `gh pr view <n>`, `gh pr diff <n>`, `gh pr checks <n>`, and the linked Asana task's acceptance criteria.
2. Check the title is a Conventional Commit and the PR links its Asana task.
3. Check tests were written first and pass; coverage thresholds hold (100% on `src/lib`, 80% floor); lint and format are clean.
4. Check the diff matches the task scope, with no unrelated changes and no secrets.
5. For content PRs: front-matter valid, alt text present, `draft` unchanged without Venkat's approval.
6. Post the verdict with `gh pr comment <n>`: first line `REVIEW: APPROVED` or `REVIEW: CHANGES REQUESTED`, then one line of evidence per checklist item.

## Done when
- A verdict comment is on the PR with evidence for every checklist item.
- Nothing was pushed, edited or merged by the reviewer.
