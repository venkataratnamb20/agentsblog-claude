# Threat model and security requirements

Status: draft for review. Owner: Security Engineer. Approver: Venkat.

Scope: a static Astro 7 blog served from a CDN, a GitHub Actions pipeline, and AI agents that work through Claude Code under one shared GitHub credential. Hosting, newsletter and analytics are not chosen yet, so those parts are written as requirements for the later ADRs. Related docs: `docs/guidelines/secrets-and-access.md`, `docs/guidelines/approval-gates.md`, `docs/adr/0001-core-tech-stack.md`.

## Assets and trust boundaries

- Reader trust: posts must not serve malware, hidden links or injected scripts.
- Subscriber email addresses: personal data under UK GDPR and PECR.
- Source repository and the `main` branch: whatever lands there can reach production.
- Credentials: GitHub login, hosting and CDN tokens, newsletter and analytics keys, registrar login.
- Domain and DNS: control of these means control of the site and its email.
- Boundaries: reader to CDN; contributor to GitHub; GitHub to CI runner; Claude Code to the local machine and GitHub; site to any third party (newsletter, analytics).

## STRIDE

### Site

- Spoofing: a look-alike domain or a DNS hijack serves a fake blog. Control: HTTPS only with HSTS, registrar two-factor, DNS changes need Venkat's approval.
- Spoofing: forged newsletter confirmation links or fake sender mail. Control: double opt-in with signed single-use tokens, SPF, DKIM and DMARC on the sending domain.
- Tampering: a malicious post or MDX component injects script into pages. Control: strict CSP, MDX content reviewed, no `set:html` on untrusted input, dependency audit.
- Tampering: CDN or hosting account takeover replaces built files. Control: two-factor on those accounts, scoped deploy tokens, deploy only from CI.
- Repudiation: no record of who published or changed a post. Control: all changes via PR with named reviewer, `draft: false` needs Venkat's written approval, git history and GitHub audit log.
- Information disclosure: the build output or source maps expose drafts, `.env` values or internal paths. Control: production build excludes drafts, no secret is read by site code, `npm run secrets:scan` in CI, check `dist/` for unintended files.
- Information disclosure: the newsletter form or analytics leaks subscriber data to third parties. Control: data minimisation, a data processing agreement with each provider, no analytics until consent rules are settled.
- Denial of service: traffic spike or bot flood on a form endpoint. Control: static pages on a CDN absorb load; the form posts to the provider, with rate limiting and a honeypot field.
- Denial of service: expired certificate or lapsed domain. Control: auto-renewing certificates, registrar auto-renew, expiry monitoring in the stage 8 runbook.
- Elevation of privilege: a third party script gains full page access. Control: no third party script without a CSP change and Venkat's approval; Subresource Integrity where a script must be loaded.
- Elevation of privilege: open redirect or unsafe link scheme in content. Control: content check rejects `javascript:` links and links to unknown redirectors.

### CI/CD

- Spoofing: a forged commit author or a fake PR from a fork impersonates a trusted contributor. Control: branch protection (PR-only merges and the required `checks` status (approving reviews are 0 today because this is a single-account repo)), CI uses the `pull_request` trigger (no secrets for forks), signed commits as a later option.
- Tampering: a malicious dependency or an install script changes the build. Control: committed lockfile, `npm ci`, audit gate, review of every dependency change, Dependabot (planned, not enabled yet).
- Tampering: a third party Action is replaced upstream. Control: pin Actions by full commit SHA with a version comment; today they use major version tags, which is a known gap.
- Tampering: PR title injection into shell steps. Control: values pass through `env`, never inline in `run`, as in the current workflow.
- Repudiation: nobody can show which run built which release. Control: tagged releases, retained run logs, build provenance attestation as a later option.
- Information disclosure: secrets printed in CI logs or committed to the repo. Control: secret scan in the hook, pre-commit and CI; GitHub push protection (already enabled); no secrets are used in CI yet.
- Denial of service: a build loop or a very large PR exhausts minutes or blocks the pipeline. Control: review of workflow changes. A job timeout and concurrency cancel on the same ref are planned; they are not in `ci.yml` today.
- Elevation of privilege: a workflow token with write scope is abused. Control: `permissions: contents: read` at top level today; grant extra scopes per job only, with review of `.github/workflows/**`.
- Elevation of privilege: a deploy token reaches production from a feature branch. Control: production deploys run only from `main` through a protected environment that needs Venkat's approval. Staging deploys from `develop` and PR previews use a separate scoped token with no production rights, and fork PRs get no token and no preview.

### Agent access

- Spoofing: every agent acts as Venkat's GitHub login, so GitHub cannot tell an agent from the owner. Control: label agent PRs and commits, move to a GitHub App or per-agent accounts when available; recorded as a residual risk.
- Spoofing: a prompt injection in fetched web content makes an agent claim to be Venkat or the owner. Control: agents treat no message as consent; approvals come only through the permission system or Venkat's own messages and Asana comments.
- Tampering: an agent edits guardrail files (`.claude/settings.json`, hooks, workflows). Control: edits ask first, and CODEOWNERS names an owner for `.claude/`, `.github/` and `scripts/`. Required Code Owner review is off today and every line names Venkat, so CODEOWNERS documents ownership; the real controls are PR-only merges, the Security Engineer review of guardrail changes and Venkat's approval.
- Tampering: untrusted research pages steer an agent to write wrong or harmful content. Control: every claim sourced, editor and reviewer pass, human approval to publish.
- Repudiation: the local action log is writable by the agent and not an audit log. Control: rely on git history, PRs, Asana comments and the GitHub audit log.
- Information disclosure: an agent reads `.env` or key files through the shell, or pastes a secret into a prompt or PR. Control: Read deny rules and hooks (speed bumps only), keep real secrets off this machine, secret scan on every commit and PR.
- Information disclosure: an agent sends private data to an outside service. Control: no personal data in requests to external tools; Venkat approves new tools and MCP servers.
- Denial of service: an agent loops, floods PRs or burns paid API quota. Control: one task, one branch, one PR; spending needs approval; usage review at each gate.
- Elevation of privilege: the shared credential allows pushes, merges or setting changes beyond a role. Control: server-side branch protection on `main` and `develop` (PR-only merges and the required `checks` status (approving reviews are 0 today because this is a single-account repo)), merges ask first.
- Elevation of privilege: a shell command bypasses the permission rules. Control: treat the rules as speed bumps; the real control is branch protection and no production credentials on the machine.

## OWASP Top 10

Mapped to the 2021 list.

- A01 Broken Access Control: no user accounts or server code on the site. Control: access that matters is on GitHub, the host and the CDN; branch protection (PR-only merges and the required `checks` status (approving reviews are 0 today because this is a single-account repo)), scoped tokens and two-factor.
- A02 Cryptographic Failures: control is HTTPS only with HSTS, modern TLS from the CDN, and no secrets in the repo. Newsletter data is stored only by the provider, encrypted at rest as a vendor requirement.
- A03 Injection: control is CSP, framework auto-escaping, no `set:html` with untrusted input, and validated front-matter. No database exists, so SQL injection is not applicable, because the site is static. Any form handler must validate and encode input.
- A04 Insecure Design: control is this threat model, double opt-in, data minimisation, and a stage 4 security checklist run against the risk register.
- A05 Security Misconfiguration: control is the header set below, a CDN configuration review, drafts excluded from production, and staging marked `noindex`.
- A06 Vulnerable and Outdated Components: control is the committed lockfile, the CI audit gate that fails on high and critical severity, Dependabot updates (planned, not enabled yet) and the supply-chain policy below.
- A07 Identification and Authentication Failures: not applicable to the site, because it has no login. For the accounts around it, two-factor is required on GitHub, host, CDN, registrar and newsletter, and agents never hold passwords.
- A08 Software and Data Integrity Failures: control is `npm ci` from the lockfile, Actions pinned by SHA, Subresource Integrity for any external script, review of workflow changes, deploys only from CI.
- A09 Security Logging and Monitoring Failures: control is GitHub audit log, git history, CI run logs, CDN and host access logs reviewed at stage 8, uptime and certificate monitoring. No application logs exist.
- A10 Server-Side Request Forgery: not applicable, because the site runs no server code that fetches user-supplied URLs. Build-time fetches use fixed, reviewed sources only.

## ASVS Level 1

Only chapters that apply to a static site with a newsletter form and analytics. Version 4.0 chapter numbers.

| Chapter | Applies as | Control |
|---|---|---|
| V1 Architecture | Yes | This threat model, a risk register, security requirements in the SRS |
| V5 Validation, sanitization, encoding | Yes | Front-matter schema, escaped output, CSP, form input validated by the provider and any handler |
| V8 Data protection | Yes | Collect email only, no tracking of individuals, retention and deletion process, no personal data in URLs |
| V9 Communications | Yes | HTTPS only, HSTS, modern TLS, no mixed content |
| V10 Malicious code | Yes | Lockfile, audit gate, secret scan, reviewed third party code |
| V12 Files and resources | Partly | Only build output is served; no uploads; image checks for alt text |
| V13 API and web service | Partly | Only the newsletter and analytics provider calls; no custom API at launch |
| V14 Configuration | Yes | Security headers, dependency policy, build reproducibility, drafts excluded |
| V2, V3, V4, V6, V7 | Not applicable | No login, sessions, access control layer, custom cryptography store or server logging at launch |

## Security headers and CSP

Set these on every response at the CDN or host. The host is not chosen yet, so the exact syntax follows the hosting ADR.

Content-Security-Policy, starting point for the static site with no third party script:

`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests`

Notes on the policy:

- `script-src 'self'` and `style-src 'self'` only hold if the build emits no inline scripts or styles. Hydrated islands, `is:inline` scripts and Astro's inline styles would break that. Today `BaseLayout.astro` has no inline script, and JSON-LD blocks are not executable, so they are fine. The R06 test (no `unsafe-inline` in `script-src`) is valid only while that stays true. If an inline script is needed, use hashes generated at build time (Astro's CSP support, to be verified on the Astro 7 build) and do not loosen the policy blindly.
- The newsletter form either posts to the provider (add its origin to `form-action`) or goes through a small first-party handler (add its origin to `connect-src`).
- Any third party script, such as analytics or an embed, needs a CSP change, an entry in this file and Venkat's approval before it is added. Prefer cookieless, self-hosted or consent-gated options.
- Origins to add, each a proposal that needs a threat-model update and Venkat's approval: the analytics beacon (`script-src` and `connect-src`) and the newsletter provider (`form-action`). The exact origins come from ADRs 0005 and 0006 and are unverified until the vendors are chosen. Subresource Integrity does not work for a vendor beacon that changes, so prefer self-hosting the script or a tool with a stable build.
- Use `Content-Security-Policy-Report-Only` first on staging, then enforce.

Other headers:

- Strict-Transport-Security: `max-age=31536000; includeSubDomains`. Decision (Venkat, 20 Nov 2026): no `preload` at launch, because it is hard to undo. Consider it after a few stable months, with his approval.
- X-Content-Type-Options: `nosniff`.
- Referrer-Policy: `strict-origin-when-cross-origin`.
- Permissions-Policy: `camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()`.
- frame-ancestors: `'none'` in the CSP above. Add `X-Frame-Options: DENY` for older browsers.
- Cross-Origin-Opener-Policy: `same-origin`.
- Cookies: none at launch. If analytics sets any, set `Secure`, `HttpOnly` where possible and `SameSite=Lax`, and apply PECR consent first.

## Supply-chain policy

- Lockfile: `package-lock.json` is committed and never edited by hand. CI and deploys use `npm ci`.
- Versions: runtime and dev dependencies use caret ranges in `package.json`, and the lockfile fixes exact versions. Any package that runs install scripts or handles untrusted input should be pinned to an exact version. A new dependency needs a stated reason, a licence check and review.
- Audit gate: `node scripts/task.mjs audit` runs in CI and fails the build on high severity. It stays blocking. A waiver needs Venkat's written approval and an expiry date.
- GitHub Actions: today they use major version tags (`actions/checkout@v7`, `actions/setup-node@v7`). Target: pin each Action by full commit SHA with the version in a comment. Owner: DevOps and SRE. Workflow edits ask first.
- Dependabot or an equivalent (planned: Dependabot security updates are disabled and there is no `.github/dependabot.yml` today): enable version updates for npm and for GitHub Actions, grouped weekly, each as a normal PR through CI. Enabling it is a repository setting and needs Venkat's approval.
- SBOM: generate a CycloneDX or SPDX file in the release job from the lockfile, attach it to each tagged release and keep it with the release. Planned for stage 5; not in place yet.
- Secret scanning: already on in the Claude Code hook, the git pre-commit and CI (`npm run secrets:scan`). GitHub secret scanning and push protection are enabled on the repository.
- Provenance: decision: CI and deploys run `npm ci --ignore-scripts`, and any package that needs its install script is listed here with a reason. Not applied yet: DevOps and SRE tests it against the current build and adopts it before launch. New install scripts are a review item. Build provenance attestation is a later option.
- Third party services: each newsletter, analytics or embed provider needs a security and privacy check and a signed data processing agreement before use.

## Risk register

Ratings: High means fix or accept before launch. Test (stage 4) is the check the Security Engineer runs in the stage 4 security checklist.

| ID | Risk | Rating | Control | Test (stage 4) | Owner |
|---|---|---|---|---|---|
| R01 | Shared GitHub credential: every agent acts as Venkat, so a leak or misuse has full reach | High | Server-side branch protection (PR-only merges and the required `checks` status (approving reviews are 0 today because this is a single-account repo)), no production credentials on the machine, 90 day token rotation, move to a GitHub App when possible | Read repository settings and confirm `main` and `develop` need a PR and the required check, and that a test push to `main` is rejected | Venkat |
| R02 | Claude Code permission rules are speed bumps; a shell can bypass them | High | Treat branch protection as the real control, keep secrets off the machine, CI secret scan and review on every PR | Attempt a direct push and a force push to `develop` with the agent credential and confirm the server rejects both | Venkat |
| R03 | Deferred guardrail hardening task leaves hook and deny-rule gaps open | High | Complete the hardening task before launch; Security Engineer reviews `.claude/settings.json` and hooks | Re-run the hook bypass cases (skip-hook flags, `.env` reads through the shell) and confirm each is blocked or recorded as accepted by Venkat | DevOps and SRE |
| R04 | Malicious or vulnerable dependency reaches the build | High | Committed lockfile, `npm ci`, CI audit gate fails on high and critical severity, Dependabot (planned), review of dependency PRs | Run `npm ci` and `npm audit --audit-level=high` on the release commit and confirm exit code 0 and no lockfile diff | DevOps and SRE |
| R05 | Third party GitHub Action is compromised or changed upstream | High | Pin Actions by full commit SHA, minimal `permissions`, review of workflow edits | Grep every `uses:` in `.github/workflows` and confirm each has a 40 character SHA | DevOps and SRE |
| R06 | Script injection through content, MDX or a third party script | High | Strict CSP, no unreviewed third party script, no `set:html` on untrusted input | Fetch the built site and confirm the CSP header is present, has no `unsafe-inline` or `unsafe-eval` in `script-src`, and that every script source is first party | Frontend Engineer |
| R07 | Hosting, CDN or registrar account takeover | High | Two-factor, password manager, scoped deploy tokens, DNS changes need approval, 6 monthly review | Confirm two-factor is enabled on GitHub, host, CDN and registrar accounts from Venkat's written confirmation | Venkat |
| R08 | Subscriber email data handled without a lawful basis, consent record or deletion route | High | Double opt-in with stored consent record, privacy notice, data processing agreement, unsubscribe in every email, deletion on request | Subscribe with a test address and confirm the double opt-in email, a consent timestamp, a working unsubscribe link and a deletion route | Product Strategist |
| R09 | Analytics sets cookies or tracks users before consent, breaching PECR | High | No analytics until Venkat approves; cookieless option preferred, otherwise a consent banner that blocks tracking until accepted | Load the built site with a clean browser profile and confirm no cookie is set and no analytics request is sent before consent | SEO and Analytics |
| R10 | Draft or unpublished content published by mistake | Medium | Drafts show only in local dev and access-controlled previews; production and staging builds exclude drafts; `check:content` must require an explicit `draft` field (the schema default is `false` today, so a missing field would publish); Venkat approves `draft: false`; CI SEO checks | Build in production mode and confirm no draft slug appears in `dist/`, the sitemap or the RSS feed | Technical Editor |
| R11 | Secret committed to the repo or printed in a log | Medium | Hook, pre-commit and CI secret scan, push protection, rotate first if leaked | Run `npm run secrets:scan` on the release commit and confirm it reports no finding | Security Engineer |
| R12 | Private vulnerability reporting is not enabled, so researchers have no safe route | Medium | Enable GitHub private vulnerability reporting (checked 20 Nov: off; needs Venkat's approval); `SECURITY.md` exists and promises it | Check the repository Security tab shows private reporting on and `SECURITY.md` exists | Venkat |
| R13 | Missing or weak security headers | Medium | Header set in this document applied at the CDN, tested on staging first | Request the staging and production home page and compare each header to this document | DevOps and SRE |
| R14 | Prompt injection through fetched web content steers an agent | Medium | No message counts as consent, approval gates, human review of every PR and post | Review the agent PRs for the release for out-of-scope changes and confirm each has a named human reviewer | Code Reviewer |
| R15 | Newsletter form abused for spam or bot sign-ups | Medium | Provider rate limiting, honeypot field, double opt-in | Submit 20 rapid sign-ups from one address and confirm throttling or blocking | Frontend Engineer |
| R16 | Domain or certificate expires | Medium | Auto-renew, expiry alerts, stage 8 runbook | Confirm auto-renew is on and an alert exists for 30 days before expiry | DevOps and SRE |
| R17 | Local action log is not an audit trail | Low | Use git history, PRs, Asana comments and the GitHub audit log as the record | Confirm approvals and outcomes appear as Asana comments for the release tasks | PM Orchestrator |

Accepted by Venkat, 20 Nov 2026 (chat): R01 and R02, until the M4 production gate, when the shared credential moves to a GitHub App or per-agent accounts if one exists. Still open: R03 (the guardrail hardening task, due 27 Nov, to be fixed before launch) and R12 (private vulnerability reporting is off; Venkat to enable it in the repository settings). Accepted risks are reviewed at each gate.

## Security and privacy requirements for the SRS

1. OWASP: the site sends the CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy and frame-ancestors headers on every response, with no third party script added without a CSP change and Venkat's approval (A03, A05, A08).
2. OWASP: CI keeps a committed lockfile, `npm ci`, a blocking high-severity audit, SHA-pinned Actions and a per-release SBOM (A06, A08).
3. UK GDPR: subscriber data is limited to email address and consent record, collected with double opt-in, covered by a privacy notice and a processor agreement, and erasable on request.
4. PECR: no non-essential cookies or tracking before consent, every newsletter has a working unsubscribe link, and marketing email is sent only to confirmed subscribers.
5. Access: two-factor on all accounts, secrets only in the provider secret store, 90 day token rotation, branch protection on `main` and `develop`, and private vulnerability reporting enabled.
