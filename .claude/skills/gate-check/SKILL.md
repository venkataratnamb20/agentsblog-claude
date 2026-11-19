---
name: gate-check
description: Use when deciding whether a milestone gate (M0 to M9) can pass: checks its tasks, approvals, CI and the previous gate and returns GO or NO-GO.
---

# gate-check

## Steps
1. Identify the gate and its date in the Asana project (M0 24 Nov 2026 through M9 5 Mar 2027).
2. List the gate's stage tasks and subtasks; confirm each is complete and has its required reviews and approvals.
3. Confirm the previous gate passed and CI on `develop` is green.
4. List open Sev 1 and Sev 2 defects, unresolved risks and anything waiting on Venkat.
5. Produce a table: item, status, evidence link, blocking yes or no.
6. Post the verdict as a comment on the gate task. Never mark the gate complete; Venkat does.

## Done when
- A GO or NO-GO verdict with every blocking item named is posted on the gate task.
