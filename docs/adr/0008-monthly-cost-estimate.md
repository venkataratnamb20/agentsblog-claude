# ADR 0008: Monthly cost estimate

- **Status:** Accepted by Venkat, 20 Nov 2026 as direction only: no spend is approved. It lists every paid item and every account, and each still needs his approval before it is opened or bought. Prices are unverified. On 20 Nov 2026 Venkat approved the directions in ADRs 0004 to 0007 only. No spend, account, domain or DNS change is approved.
- **Date:** 2026-11-20
- **Supersedes:** none
- **Deciders:** Solution Architect Agent, Venkat (approver)
- **Reviewers:** DevOps & SRE Agent, PM Orchestrator Agent
- **Asana task:** Select hosting, CDN & services (ADRs) (gid 1220692569579020)

## Context
ADRs 0004 to 0007 recommend services. Venkat needs one place that shows what the blog costs per month and what he must approve. He approves ADRs 0004 to 0008 as one batch with M1, because they are M1 exit items. No vendor price was verified on 2026-11-20. Every number here is an unverified estimate, check the vendor page before purchase. Where a service is free, the free tier limits can change, so each one needs a check before launch.

SRS targets checked: the recommended set is all static files plus third parties that load async, so LCP under 2.5 s, INP under 200 ms and CLS under 0.1 are not put at risk by cost choices. 99.9% uptime relies on the CDN host. WCAG 2.2 AA is not a cost matter, but a paid plan must not be chosen if it forces an inaccessible embed. UK GDPR and PECR: each provider that sees personal data needs a processor agreement. Free tiers can have weaker terms, so check them.

## Options considered
| Option | Services | Cost per month |
|---|---|---|
| Do nothing paid (free option) | GitHub Pages, no newsletter, no analytics, no search | 0, but fails G3 and G4 measurement |
| Recommended set | Cloudflare Pages, Buttondown, Cloudflare Web Analytics, no search until about 10 posts, then Pagefind | See the table below. Expected 0 per month at launch, if free tiers hold (unverified estimate, check the vendor page before purchase) |
| Upgraded set | Recommended set plus Plausible hosted and a paid newsletter plan | Sum of paid plans (unverified estimate, check the vendor page before purchase) |

## Cost
All amounts are per month unless stated. Every figure is an unverified estimate, check the vendor page before purchase.

| Service (recommended) | Free tier called out | Cost per month |
|---|---|---|
| Hosting and CDN: Cloudflare Pages | Free tier expected (unverified) | 0 (unverified estimate, check the vendor page before purchase) |
| Newsletter: Buttondown | Free for a small list (unverified). 100 subscribers may be near the limit. | 0 at launch. A paid plan may be needed in Jan or Feb 2027 (unverified estimate, check the vendor page before purchase) |
| Analytics: Cloudflare Web Analytics | Free (unverified) | 0 (unverified estimate, check the vendor page before purchase) |
| Search: none at launch, Pagefind later | Free and open source, no account (unverified) | 0 (unverified estimate, check the project page before adoption) |
| CI: GitHub Actions | Free allowance for public repos (unverified) | 0 (unverified estimate, check the vendor page before purchase) |
| Uptime monitor for the 99.9% target (not covered by another ADR, tool not chosen) | A free tier is likely to exist (unverified) | Not chosen. Unverified estimate, check the vendor page before purchase. |
| Google Search Console | Free (unverified). Needs Venkat's Google account and site verification (a DNS record). | 0 (unverified estimate, check the vendor page before purchase) |
| Keyword research tool (not covered by another ADR, tool not chosen) | Free tiers exist for some tools (unverified) | Not chosen. Unverified estimate, check the vendor page before purchase. |
| Domain email (not covered by another ADR, provider not chosen) | None assumed | Not chosen. Unverified estimate, check the vendor page before purchase. Needed for the newsletter sender address and security contact. |
| **Total per month at launch** | | **0 for the chosen services if every free tier holds. Not included: the uptime monitor, keyword tool and domain email, which are not chosen. Worst case adds one paid newsletter plan (unverified estimate, check the vendor page before purchase)** |

Yearly items, not monthly:

| Item | Cost per year |
|---|---|
| Domain name | A typical registration is a modest yearly fee that depends on the name and the ending (unverified estimate, check the registrar page before purchase). Divide by 12 for a per month figure. |
| Domain email (mailbox or forwarding), needed for the sender address and security contact | Provider not chosen, so no figure. Unverified estimate, check the vendor page before purchase. Counted in the total once Venkat chooses. |

## Decision
Venkat approved the directions in ADRs 0004 to 0007 on 20 Nov 2026: Cloudflare Pages (free tier, no custom staging domain), Buttondown, Cloudflare Web Analytics, and search later with Pagefind. He has not opened an account, bought a domain, chosen a registrar or approved any paid plan or DNS change. Every price here is still an unverified estimate.

Recommend the set above. Expected running cost is zero per month plus the yearly domain fee, rising only if the newsletter outgrows its free tier. Re-check all prices at the January metrics review, and again before any purchase.

What needs Venkat's approval:

1. The domain name and registrar, and paying the yearly domain fee (ADR 0004).
2. Opening a hosting and CDN account and the DNS change to point the domain (ADR 0004).
3. Opening a newsletter account, the plan, and the sending domain records (ADR 0005). Also approval before each issue is sent.
4. Using an analytics tool, any account for it, and adding the script to production (ADR 0006).
5. Adding Pagefind later, and deferring search at launch (ADR 0007).
6. Any upgrade from a free tier to a paid plan.
7. Each vendor's data processing agreement, the UK transfer safeguard for US processors, and the privacy notice that names them.
8. The uptime monitor, Google Search Console (his Google account and the verification record), a keyword research tool, and domain email. None is chosen yet.
9. The two scoped deploy tokens and their 90-day rotation owner (Venkat).
10. CSP origin changes for analytics and the newsletter form, with a threat-model update.

## Consequences
- Easier: a low fixed cost and a clear list of approvals, so Venkat can batch them with M1.
- Harder: free tiers can change without notice. Mitigation: review prices every quarter with the access audit.
- Next: after approval, the PM Orchestrator records the approved plan in Asana, and DevOps & SRE adds a cost line to the monthly operations report.
- Reversible: yes. Every item can be cancelled. The domain is the only commitment that runs a full year.
