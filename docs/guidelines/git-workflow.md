# Git workflow

- `main`: production, tagged releases only. Protected.
- `develop`: staging. Protected; merge via PR.
- `feature/<task-id>-<slug>`: branch from `develop`, one task per branch, one PR per branch. Squash-merge into `develop`.
- `release/<version>`: branch from `develop`, stabilise, bump version, update changelog; merge to `main` (tagged) and back to `develop`.
- `hotfix/<version>`: branch from `main`, merge to `main` (tagged) and `develop`.

Branch protection for `main` and `develop` (repository ruleset `branch protection`): PR only, required checks, no force-push, no deletion; the required approval count is described under Reviews and approvals.
The changelog is generated from Conventional Commits at release time. Each PR links its Asana task; agents never push straight to `main` or `develop`.

Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`). Versions follow semver.
PR checklist: tests first, lint/typecheck clean, acceptance criteria linked, reviewer named.
Rulesets and CI checks are configured with Venkat's approval.

## Commit messages
Conventional Commits are enforced locally by `.husky/commit-msg` (commitlint, installed by `npm ci` via the `prepare` script) and in CI on the PR title and every PR commit. Squash merges use the PR title, so the title must be conventional too.

## Changelog
`npm run changelog` regenerates `CHANGELOG.md` from conventional commits (features, fixes, performance, reverts). Run it on the release branch.

## Reviews and approvals
- `.github/CODEOWNERS` maps paths to the human account and names the reviewer agent role in comments (GitHub only accepts users and teams).
- Reviewer agents record `REVIEW: APPROVED` or `REVIEW: CHANGES REQUESTED` as a PR comment and in the Asana task.
- The number of required approving reviews is set in the repository ruleset `branch protection`; the current value and the reason are tracked in the Asana task "Git branching model & PR workflow".

## Release steps (`release/<version>`)
1. `git switch develop && git pull`, then `git switch -c release/<version>`.
2. `npm version <major|minor|patch> --no-git-tag-version`, then `npm run changelog`.
3. Commit as `chore(release): <version>` and open a PR into `main`; merge with a merge commit (not squash).
4. On `main`, tag `v<version>` (`git tag -a v<version> -m "v<version>"`) and push the tag. The production deploy needs Venkat's approval.
5. Back-merge `main` into `develop` through a PR.

## Hotfix steps (`hotfix/<version>`)
Branch from `main`, fix with a failing test first, bump the version and run the changelog, PR into `main` (merge commit), tag, then back-merge into `develop`.

