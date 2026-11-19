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

- **Least privilege:** each subagent has a tools allow-list (`.claude/agents/`); reviewers are read-only; `.claude/settings.json` allows only the commands the work needs, asks before merges, tags and releases, and denies `.env` files, key files, force pushes and pushes to `main` or `develop`. Agents never hold production credentials.
- **No secrets in prompts:** never paste a secret into a prompt, comment, PR, commit or log. Use environment variables or the secret store described in `docs/guidelines/secrets-and-access.md`. The `block-secrets` hook blocks writes that contain secrets.
- **Action log:** the `log-actions` hook appends one line per shell command, write or edit to `.claude/logs/actions.jsonl` (local, gitignored): time, tool and the command or path, with secrets redacted and no file contents. Approvals and outcomes are logged as Asana comments; code changes are logged in git history and PRs; GitHub keeps its own audit log.
- **Gates before commits:** the `pre-commit-gate` hook scans the staged diff for secrets and runs the tests before any `git commit`; the git `pre-commit` hook repeats the secret scan and the format check; CI runs the secret scan, lint, typecheck, coverage and build.

## What is not enforced by tooling yet

Deploy, DNS, publish, spend and post have no tooling to guard yet because the tooling does not exist. Until it does, these rules are procedural: an agent that finds itself about to do one of them stops and asks. The Security Engineer revisits this when hosting, newsletter and analytics are chosen.
