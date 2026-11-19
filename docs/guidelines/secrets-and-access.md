# Secrets and access management

Rules for credentials and who can touch what. Zero secrets in the repository.

## Secret store

| Where | Store | Rule |
|---|---|---|
| Local development | `.env` files, gitignored | Never committed. The Read tool is denied for the common variants (`.env`, `.env.local`, `.env.production`, `.env.staging`, `.env.development`, `.env.test`) in `.claude/settings.json`; the `block-secrets` hook blocks writes to every `.env.*` file except `.env.example`, `.env.sample` and `.env.template`; common shell reads are denied on a best-effort basis, but shell access is not prevented, so keep real secrets out of this project folder. `.env.example` holds names only |
| CI | GitHub Actions encrypted secrets | None are used yet; add one only with a stated purpose and an owner |
| Runtime and hosting | The hosting provider's secret store | Decided in the hosting ADR; not chosen yet |
| People | Venkat's password manager | Passwords and recovery codes never go to agents or the repo |

## Scoped access per agent

All agents run through Claude Code under Venkat's own GitHub login today, so the effective credential is shared. The controls below limit what each role can do with it; separate per-agent credentials are the target once a second account or a GitHub App exists.

| Subagent | May touch | Must not touch |
|---|---|---|
| `pm-orchestrator` | Asana, `progress/`, docs | Product code, production |
| `product-strategist` | `docs/specs/`, backlog | Code, publishing |
| `solution-architect` | `docs/adr/`, architecture docs | Paid services without approval |
| `ux-ui-designer` | Design docs and tokens | Paid assets without approval |
| `frontend-engineer` | `src/`, `tests/`, feature branches | Deploys, rulesets |
| `devops-sre` | `.github/`, `scripts/`, CI | Production, DNS, rulesets without approval |
| `qa-engineer` | `tests/`, test config | Product code (reports defects instead) |
| `security-engineer` | Read-only review, `npm audit` | Editing files, secret values |
| `code-reviewer` | Read-only review, PR comments | Pushing, editing, merging |
| `seo-analytics` | SEO config, audits | Post copy, tracking tools without approval |
| `research-analyst` | `research/`, public web | Drafting posts |
| `technical-writer` | `content/posts/` as `draft: true` | Publishing |
| `technical-editor` | Existing drafts | Creating or publishing posts |
| `growth-community` | Drafts only | Sending or posting |

Production credentials, registrar and hosting logins stay with Venkat. An agent that needs one asks for the action to be performed or for a time-boxed, scoped token.

## Secret scanning

Four layers; each reports file, line and pattern name, never the value.

1. **Claude Code hook** `block-secrets`: blocks writes of secret files and secret-looking content.
2. **Git pre-commit** (`.husky/pre-commit`): `node scripts/scan-secrets.mjs --staged`, then the format check.
3. **CI:** `npm run secrets:scan` scans every tracked text file on every PR and push (images and the lock file are skipped).
4. **GitHub secret scanning and push protection:** recommended repository settings; changing them needs Venkat's approval.

There is no way to exempt a line from the scan; a false positive is fixed by changing the text, for example by building a test fixture at runtime. If a secret is ever committed, treat it as leaked: rotate it first, then remove it from history with Venkat's approval.

## Rotation schedule

| Credential | Rotate | Also rotate when |
|---|---|---|
| GitHub tokens (personal or app) | Every 90 days | A token is exposed, a role changes, an agent is removed |
| Hosting and CDN API tokens | Every 90 days | Same as above |
| Newsletter and analytics API keys | Every 90 days | Same as above |
| Registrar, host and email logins | Review every 6 months (strong password, two-factor) | Suspected compromise |

The quarterly security review and access audit (Asana, stage 8) checks that this schedule is followed.

## Accounts that need a human

Venkat creates these; agents never create accounts or hold their passwords. None exist yet, because the hosting, newsletter and analytics choices are not made.

- Domain registrar
- Hosting and CDN provider
- Email provider for the domain
- Newsletter provider (if paid)
- Analytics provider (if any)
