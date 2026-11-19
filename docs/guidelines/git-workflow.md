# Git workflow

- `main`: production, tagged releases only. Protected.
- `develop`: staging. Protected; merge via PR.
- `feature/<task-id>-<slug>`: branch from `develop`, one task per branch, one PR per branch. Squash-merge into `develop`.
- `release/<version>`: branch from `develop`, stabilise, bump version, update changelog; merge to `main` (tagged) and back to `develop`.
- `hotfix/<version>`: branch from `main`, merge to `main` (tagged) and `develop`.

Branch protection for `main` and `develop`: PR only, 1 approving review, green checks, no force-push (needs Venkat's approval to configure).
The changelog is generated from Conventional Commits at release time. Each PR links its Asana task; agents never push straight to `main` or `develop`.

Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`). Versions follow semver.
PR checklist: tests first, lint/typecheck clean, acceptance criteria linked, reviewer named.
Branch protection and CI checks are configured by the DevOps & SRE agent with Venkat's approval.
