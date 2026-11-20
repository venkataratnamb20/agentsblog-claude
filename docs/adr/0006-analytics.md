# ADR 0006: Privacy-friendly analytics

- **Status:** Direction approved by Venkat, 20 Nov 2026 (Cloudflare Web Analytics). The account, the script in production and any paid plan still need his approval. Nothing is adopted yet.
- **Date:** 2026-11-20
- **Supersedes:** none
- **Deciders:** Solution Architect Agent, SEO & Analytics Agent, Venkat (approver)
- **Reviewers:** Security Engineer Agent, DevOps & SRE Agent
- **Asana task:** Select hosting, CDN & services (ADRs) (gid 1220692569579020)

## Context
Goal G4 is 1,000 monthly unique readers in February 2027, with returning readers, engaged time and referrers as supporting measures. We need counts, not profiles. The site is static (ADR 0001), so analytics is a script in the page or a host feature.

Legal position (summary, not legal advice, Venkat should confirm): under PECR, storing or reading information on a reader's device, for example a cookie or local storage identifier, needs consent unless an exemption applies. Under UK GDPR, an IP address is personal data, so the provider is a processor and the privacy notice must say so. I understand UK law is changing so that some low-risk analytics may be exempt from consent, but I have not verified the status or the start date. Check the ICO guidance before launch. PECR also covers accessing information on the device, not only setting cookies, so "cookieless" alone is not enough. The safest design is a tool that sets no cookie and stores or reads nothing on the device, which avoids a consent banner.

Data location and transfers: the likely providers are US companies (unverified). A transfer of IP addresses to a US processor needs a safeguard under UK GDPR: the UK extension to the EU-US Data Privacy Framework if certified (unverified), or the ICO's International Data Transfer Agreement (IDTA) or the UK Addendum. Check data location and the data processing agreement before adoption. A self-hosted tool on a UK or EU server avoids the transfer, at the cost of running a server.

CSP: the threat-model CSP is `script-src 'self'` and `connect-src 'self'`. A hosted beacon adds its script origin to `script-src` and its collection origin to `connect-src`. That is a proposal that needs a threat-model update and Venkat's approval. Subresource Integrity is not possible for a vendor beacon that changes, so prefer a script we host ourselves or a different tool. If the host injects analytics at the edge, that script must still pass the CSP and must not bypass it.

Approval timing: Venkat approves ADRs 0004 to 0008 as one batch with M1, because they are M1 exit items.

SRS targets checked: LCP under 2.5 s, INP under 200 ms, CLS under 0.1 (load the script async, under about 2 KB for the lightest tools, unverified; no banner means no layout shift), 99.9% uptime (a failed script must not break the page), WCAG 2.2 AA (a consent banner is another accessibility risk, so none is better), UK GDPR and PECR as above.

## Options considered
| Option | Cookies and consent | Pros | Cons |
|---|---|---|---|
| No analytics (free option) | None needed | No privacy risk. | G4 cannot be measured. Search Console gives some data, but not reader counts. Not enough alone. |
| Cloudflare Web Analytics | Described by the vendor as cookieless (unverified, check) | Free (unverified). No extra vendor if hosting is Cloudflare. Light. | Fewer features. No custom events, so no form conversion events. Sampling may apply (unverified). |
| Plausible | Cookieless by design (unverified, check) | Simple dashboard. Custom events and goals. Open source, can be self-hosted. | Hosted plan is paid (unverified). Self-hosting needs a server. |
| Umami | Cookieless by design (unverified, check) | Open source. Free to self-host. Hosted plan exists (unverified). | Self-hosting needs a server and a database. |
| GoatCounter | Cookieless (unverified, check) | Free for non-commercial use (unverified). Very light. Open source. | Commercial use terms need checking. Basic reports. |

## Cost
Per month. All figures are unverified estimates, check the vendor page before purchase.

| Option | Cost per month |
|---|---|
| None | 0 |
| Cloudflare Web Analytics | 0 (unverified estimate, check the vendor page before purchase) |
| Plausible hosted | A small paid plan (unverified estimate, check the vendor page before purchase). Self-hosted: server cost plus time |
| Umami | Self-hosted: server cost plus time. Hosted: unverified estimate, check the vendor page before purchase |
| GoatCounter | 0 for non-commercial use (unverified estimate, check the vendor page before purchase) |

## Decision
Decision (Venkat, 20 Nov 2026): the direction is Cloudflare Web Analytics, cookieless, page views only, with no custom events. Plausible stays the upgrade path. This approves the direction only. No account is open and no paid plan is approved. The prices stay unverified estimates.

Recommend Cloudflare Web Analytics for launch if ADR 0004 is accepted, because it is free, cookieless and adds no new vendor. If ADR 0004 picks another host, or events are needed, use Plausible hosted instead (a paid plan, needs approval). Cloudflare Web Analytics has no custom events. Conversion and subscriber counts come from the newsletter provider's report plus page views: confirmed subscribers divided by unique readers. If events are needed, Plausible is the upgrade.

No consent banner at launch. Conditions: no cookie or local storage identifier, no cross-site tracking, no personal data export to an advertiser. The SEO & Analytics Agent checks the chosen tool's documentation, and Venkat confirms the position (ICO guidance, or advice) before the script goes live. The privacy notice must list the provider and the data it sees.

Venkat must approve: the tool, any account, and adding the script to production. Agents add no tracking tool without approval.

## Consequences
- Easier: no banner, no layout shift, lighter pages.
- Harder: fewer metrics than a full tool. Per-post event tracking is limited.
- Next: write the script include as a small component with a test that it is absent in local and preview builds and present only when a site token is set in production.
- Reversible: yes. Remove the script. Historic data stays with the provider or is lost.
