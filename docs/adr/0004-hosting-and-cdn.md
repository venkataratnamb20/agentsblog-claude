# ADR 0004: Hosting and CDN

- **Status:** Direction approved by Venkat, 20 Nov 2026 (Cloudflare Pages on the free tier). The account, the domain, DNS records and any paid plan still need his approval. Nothing is adopted yet.
- **Date:** 2026-11-20
- **Supersedes:** none
- **Deciders:** Solution Architect Agent, Venkat (approver)
- **Reviewers:** DevOps & SRE Agent, Security Engineer Agent
- **Asana task:** Select hosting, CDN & services (ADRs) (gid 1220692569579020)

## Context
The site is a static Astro 7 build (ADR 0001). The output is a `dist/` folder of files. The blog needs a host that serves those files from a CDN, gives per-PR preview URLs and a separate staging site, sets response headers, and handles TLS for a custom domain. Launch is 14 Dec 2026.

ADR 0001 confirmation: static output fits every option below, because each one can serve plain files. No option needs a server runtime. Only the own Linux server needs us to run the web server, TLS and patching ourselves.

SRS targets checked for every option: LCP under 2.5 s, INP under 200 ms, CLS under 0.1 (a static page on a CDN meets these if images and fonts are handled; the host does not change INP or CLS), 99.9% uptime (about 43 minutes of downtime per month allowed), WCAG 2.2 AA (not a hosting matter), UK GDPR and PECR (the host processes IP addresses in logs; check the data processing agreement and where data is stored).

Data location and transfers: the likely hosts are US companies. Their servers and logs may sit outside the UK. A transfer of IP addresses to a US processor needs a safeguard under UK GDPR: the UK extension to the EU-US Data Privacy Framework if the vendor is certified (unverified), or the ICO's International Data Transfer Agreement (IDTA) or the UK Addendum to the EU standard clauses. Check the vendor's data processing agreement and data location before adoption.

Service levels and prices change. Everything marked "unverified" below was not checked against the vendor page on 2026-11-20. Check each vendor page before purchase. Astro 7 and Node 22 support on each host is also unverified. The build runs in GitHub Actions, so the host only receives static files, which lowers that risk.

Approval timing: Venkat approves ADRs 0004 to 0008 as one batch with M1, because they are M1 exit items.

## Options considered
| Option | ADR 0001 static fit | Pros | Cons | SRS: 99.9% uptime and speed |
|---|---|---|---|---|
| GitHub Pages (free option) | Fits. Serves a folder of files. | No new vendor. Free for public repos (unverified). Deploys from CI. | No per-PR previews without extra work. No custom response headers (unverified), so the threat-model header set may not be possible. One site per repo (unverified), so staging needs a second repo. | CDN-backed. No uptime commitment I can cite (unverified). |
| Cloudflare Pages | Fits. Astro static is a supported framework (unverified). | Free tier with preview deployments per branch (unverified). Custom headers file (unverified). Global CDN. Same vendor can give free web analytics (ADR 0006). | New account. I believe Cloudflare is steering new projects toward its Workers platform (unverified), so check which product to use on the day. Custom domains may attach to the production branch only (unverified), see Decision. Vendor lock-in is low because the output is plain files. | Global CDN. SLA terms for the free tier unverified. |
| Netlify | Fits. | Mature previews and deploy contexts. Headers config. Forms add-on exists. | Free tier limits on bandwidth and build minutes (unverified). New account. | CDN-backed. SLA unverified. |
| Vercel | Fits, as a static Astro site. | Good previews. | Free hobby tier terms restrict commercial use (unverified). The newsletter may count as commercial. New account. | CDN-backed. SLA unverified. |
| Own Linux server behind a CDN | Fits. Nginx or Caddy serves `dist/`. | Full control. No platform lock-in. | We run patching, TLS, backups and monitoring. Server cost plus CDN account. A single server is the main risk to 99.9% uptime. Most effort for a content site. | Depends on us. Hardest option to keep at 99.9%. |

## Cost
Per month. All figures are unverified estimates, check the vendor page before purchase.

| Option | Cost per month |
|---|---|
| GitHub Pages | 0 for a public repository (unverified estimate, check the vendor page before purchase) |
| Cloudflare Pages | 0 on the free tier (unverified estimate, check the vendor page before purchase) |
| Netlify | 0 on the free tier (unverified estimate, check the vendor page before purchase) |
| Vercel | 0 on the hobby tier, but its terms may not allow a commercial site (unverified estimate, check the vendor page before purchase) |
| Own Linux server plus CDN | A small virtual server has a monthly fee, price not checked (unverified estimate, check the vendor page before purchase), plus Venkat's time for upkeep |

The domain name is a separate yearly cost. See ADR 0008.

## Decision
Decision (Venkat, 20 Nov 2026): the direction is Cloudflare Pages on the free tier. There will be no custom staging domain. Staging uses the host's default address and access-controlled preview URLs, and stays noindex. Netlify and GitHub Pages stay documented as fallbacks. This approves the direction only. No account is open, no domain is bought, no registrar is chosen, no paid plan is approved and no DNS change is approved. The prices stay unverified estimates.

Recommend Cloudflare Pages on its free tier for staging, previews and production. Reasons: per-PR previews, a headers file for security headers and caching, a global CDN, no server to run, and it pairs with free cookieless analytics (ADR 0006). Production sets `ALLOW_INDEXING=true`; staging does not.

### Deploys
- The build runs in GitHub Actions on Node 22 as today. Deploys use Direct Upload from a GitHub Actions job.
- The host's own Git integration is OFF. The host never builds our code.
- Two scoped tokens, both held as GitHub environment secrets. Staging deploys from `develop` and PR previews use one token with no production rights. Production uses a separate token.
- Owner of both tokens: Venkat. Rotation: every 90 days.
- Fork PRs get no token and no preview.
- Production deploys only from `main`, through a protected environment that Venkat approves (`docs/threat-model.md`).
- Build-time variables live in GitHub environments, not in a host secret store.

### Previews and drafts
Preview URLs are public by default (unverified). `PREVIEW_DRAFTS=true` on a public preview could leak drafts (threat-model R10). Rule: PR previews show drafts only if access control is on for them. If it is not available on the free tier, previews exclude drafts and drafts are reviewed locally. Staging and production always exclude drafts.

### Staging domain
Custom domains may attach to the production branch only (unverified). Options: a second Pages project for staging with its own domain, or drop the custom staging domain and use the host's default staging address. Decision (Venkat, 20 Nov 2026): no custom staging domain. The pre-adoption check below still confirms that the host's default staging address and access-controlled previews are available.

### Headers
Apply the full header set from `docs/threat-model.md` at the host: Content-Security-Policy (report-only on staging first, then enforced), Strict-Transport-Security (`max-age=31536000; includeSubDomains`, no `preload` without Venkat), X-Content-Type-Options `nosniff`, Referrer-Policy `strict-origin-when-cross-origin`, Permissions-Policy, frame-ancestors `'none'` with `X-Frame-Options: DENY`, and Cross-Origin-Opener-Policy `same-origin`. If a host cannot set these, it fails this ADR.

### CSP changes per integration
The threat-model CSP is `script-src 'self'`, `connect-src 'self'`, `form-action 'self'`. Any integration that adds an origin is a proposal that needs a threat-model update and Venkat's approval. If the host injects analytics at the edge, that script must still pass the CSP and must not bypass it. Details are in ADRs 0005 and 0006.

### Access
Two-factor is required on the host, CDN, registrar and GitHub accounts. Venkat confirms this in writing (threat-model R07).

### Rollback
Mechanism: roll back to a previous deployment in the host dashboard, or re-run the deploy workflow on the last good tag. Target: production restored within 15 minutes of the decision to roll back. The DevOps & SRE Agent writes a rollback runbook as a stage 5 (Deployment) output, and it is tested once on staging before launch.

### Uptime and backups
- The 99.9% target in the SRS has no SLA behind it on free tiers (unverified). It is a goal we measure, not a promise from the vendor.
- Owner: DevOps & SRE Agent for the monitor and the report, Venkat for the response. An external uptime check (ADR 0008) alerts by email to Venkat and the DevOps & SRE Agent's Asana task.
- Git is the source of truth for the site. Any deploy can be rebuilt from a tag.
- Recovery note for what git does not hold: DNS records and account settings (host project, headers if set in the dashboard, domain records) are exported into a runbook after each change, kept in `docs/runbooks/`, with no secrets in it. Venkat holds the registrar and host logins and recovery codes in his password manager.

### Fallbacks
Netlify has the same static fit and features. GitHub Pages is the zero-new-vendor fallback if previews and headers are dropped, and only if custom headers are possible (unverified).

### Pre-adoption checks
The DevOps & SRE Agent confirms on the vendor pages before Venkat opens an account:
1. Current product name (Pages or Workers static assets) and free tier limits.
2. Whether a custom staging domain needs a second project.
3. Whether PR previews can be access-controlled.
4. That the header set above can be applied.
5. Data location, the data processing agreement and the transfer safeguard (IDTA, UK Addendum or the UK extension to the Data Privacy Framework).
6. Astro 7 static output and Node 22 builds upload cleanly.

Venkat must approve: creating the hosting account, the choice of vendor, the custom domain DNS change and the first production deploy. Agents do not create accounts or touch DNS.

## Consequences
- Easier: no servers, fast global delivery, previews for every same-repo PR, a clear rollback path.
- Harder: we depend on one vendor's free tier, and the uptime goal has no vendor SLA. Mitigation: the output is plain static files, so moving to Netlify or an own server takes a day.
- Next: DevOps & SRE writes the deploy workflow, the headers file, the rollback runbook and the uptime monitor setup after approval. Add a token to a GitHub environment only with a stated owner and 90-day rotation (`docs/guidelines/secrets-and-access.md`).
- Reversible: yes. Switching host changes DNS and one workflow.
