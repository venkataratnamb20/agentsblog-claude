# Approval gates and guardrails

Agents do the work; Venkat decides. This file lists what needs his approval, how to ask, and the guardrails that apply to every agent.

## Actions that need Venkat's approval

Approval is required for spending money, creating accounts, production deploys, DNS changes, publishing posts, and posting on social media or communities, plus the other actions below. Stop and ask before doing any of them. Approval is per action and does not carry over to the next one.

| Action | Examples |
|---|---|
| Spending money | Paid plans, domains, fonts, stock assets, ads, API usage above the free tier |
| Creating accounts | Registrar, hosting, email, newsletter, analytics, social profiles, any trial |
| Production deploys | Deploying to the production environment, release tags, rollbacks |
| DNS changes | Records, nameservers, certificates tied to the domain |
| Publishing posts | Setting `draft: false`, merging a post into the production release |
| Posting on social media or communities | LinkedIn, X, Hacker News, Reddit, forums, outreach messages |
| Sending messages | Newsletters, emails, DMs, calendar invites |
| Granting access | Collaborators, tokens, app permissions, ruleset or branch protection changes |
| Deleting data | Branches with unmerged work, content, backups, history rewrites, force pushes |
| Anything touching secrets | Creating, rotating, reading or moving a credential |

## How to ask

Comment on the Asana task (or ask in the session) in this form, then wait for an explicit reply:

`APPROVAL REQUEST: <action> | why: <reason> | cost or risk: <amount or impact> | rollback: <how to undo>`

Venkat answers `APPROVED` or `REJECTED` with any conditions. The agent records the outcome on the task. Silence is not approval. Batch requests at each gate where possible; the target response time is 24 hours.

## Guardrails

- **Least privilege, and its limits:** each subagent has a tools allow-list (`.claude/agents/`). The two reviewers have no Edit or Write tool, but read-only is by instruction and tool list: they still have Bash, so shell writes are not technically prevented. `.claude/settings.json` allows only named commands; asks before merges, tags, releases and edits to its own guardrail files; and denies `.env` reads, force pushes, `--no-verify` and the push forms that bypass branch protection. These rules are speed bumps, not walls, because a shell can do more than any rule list covers. The real controls are server-side branch protection, review, and keeping production credentials off this machine.
- **No secrets in prompts:** never paste a secret into a prompt, comment, PR, commit or log. Use environment variables or the secret store described in `docs/guidelines/secrets-and-access.md`. The `block-secrets` hook blocks writes that contain secrets.
- **Action log (local and best-effort):** the `log-actions` hook appends one line per completed shell command, write or edit to `.claude/logs/actions.jsonl` (gitignored): time, tool and the command or path, with known secret patterns redacted and no file contents. Blocked calls are not logged, the file is writable by the agent, and it is not an audit log. Approvals and outcomes are logged as Asana comments, code changes in git history and PRs, and GitHub keeps its own audit log.
- **Gates before commits:** the `pre-commit-gate` hook blocks `--no-verify` and `-n`, scans the diff for secrets (all tracked changes for `-a`), and runs the tests before any `git commit`; the git `pre-commit` hook repeats the secret scan on the staged content and the format check; CI runs the secret scan, lint, typecheck, coverage and build. A hook that cannot read its input or run `git` blocks the action instead of allowing it.

- **Where the real controls are:** `git push -u origin HEAD` pushes the checked-out branch, so protection of `main` and `develop` is enforced on the server (the ruleset and branch protection), not by the local deny rules. The skip-hook check is a speed bump: it reads the command line as text, so a form it does not parse can evade it, and it also blocks a commit message that merely mentions those flags. Put a long message in a file and use `git commit -F <file>`, and rely on CI, where the secret scan, lint and tests run on every PR.

## What is not enforced by tooling yet

Deploy, DNS, publish, spend and post have no tooling to guard yet because the tooling does not exist. Until it does, these rules are procedural: an agent that finds itself about to do one of them stops and asks. The Security Engineer revisits this when hosting, newsletter and analytics are chosen.
