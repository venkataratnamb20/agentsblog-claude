---
name: hotfix
description: Use when production has a defect that cannot wait for the next release: hotfix branch from main, test-first fix, patch release and back-merge.
---

# hotfix

## Steps
1. Branch `hotfix/<version>` from `main`.
2. Write a failing test that reproduces the defect, then fix it until the test passes.
3. `npm version patch --no-git-tag-version` and `npm run changelog`; commit as `fix: <summary>` and `chore(release): <version>`.
4. Open a PR into `main` (merge commit) and ask Venkat to approve; deploying to production needs his approval.
5. After approval: tag `v<version>` and push the tag.
6. Open a PR merging `main` back into `develop`.
7. Write a short incident note: cause, fix, how to prevent it.

## Done when
- The regression test fails before the fix and passes after.
- `main` is tagged, `develop` has the back-merge, and the incident note is in Asana.
