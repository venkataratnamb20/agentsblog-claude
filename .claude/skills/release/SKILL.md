---
name: release
description: Use when cutting a release from develop to main: release branch, version bump, changelog, PR, then tag and back-merge after Venkat approves.
---

# release

## Steps
1. Confirm `develop` is green and every task planned for the release is complete.
2. `git switch develop && git pull`, then `git switch -c release/<version>`.
3. `npm version <major|minor|patch> --no-git-tag-version`, then `npm run changelog`.
4. Commit as `chore(release): <version>` and open a PR into `main`; merge with a merge commit, not squash.
5. Stop and ask Venkat to approve the release and any production deploy.
6. After approval: tag `v<version>` on `main` (`git tag -a v<version> -m "v<version>"`) and push the tag. Tagging and merging prompt for confirmation by design.
7. Open a PR merging `main` back into `develop`.

## Done when
- `main` carries the tagged release and the changelog.
- `develop` contains the back-merge.
- Venkat's approval is linked in the Asana task.
