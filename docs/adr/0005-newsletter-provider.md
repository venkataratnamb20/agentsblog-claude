# ADR 0005: Newsletter provider

- **Status:** Proposed: needs Venkat's approval (new account, possible paid plan)
- **Date:** 2026-11-20
- **Supersedes:** none
- **Deciders:** Solution Architect Agent, Venkat (approver)
- **Reviewers:** Growth & Community Agent, Security Engineer Agent
- **Asana task:** Select hosting, CDN & services (ADRs) (gid 1220692569579020)

## Context
Goal G3 is 100 confirmed subscribers by 26 Feb 2027. Double opt-in is required: a subscriber counts only after clicking a confirmation link. The site is static (ADR 0001), so the form must post straight to the provider or use a hosted form. The provider must offer an unsubscribe link, export of data, and a data processing agreement, because email addresses are personal data.

SRS targets checked: LCP under 2.5 s, INP under 200 ms and CLS under 0.1 (a plain HTML form with no heavy embed script keeps these; avoid provider scripts that shift layout), 99.9% uptime (the site stays up if the provider is down, only the form fails), WCAG 2.2 AA (the form needs labels, visible focus and clear errors, so prefer a form we build ourselves over an iframe), UK GDPR and PECR (consent wording, double opt-in as the proof of consent, unsubscribe in every issue, processor agreement, data location).

Data location and transfers: the likely providers are US companies (unverified). Sending subscriber email addresses to a US processor needs a safeguard under UK GDPR: the UK extension to the EU-US Data Privacy Framework if certified (unverified), or the ICO's International Data Transfer Agreement (IDTA) or the UK Addendum. Check data location and the data processing agreement before adoption.

Prices and free tier limits were not verified today. Marked "unverified" below.

Approval timing: Venkat approves ADRs 0004 to 0008 as one batch with M1, because they are M1 exit items.

No secret in the browser: the site has no server, so the form posts from the reader's browser. Any API key used in that form would be public. The design therefore uses the provider's public subscribe endpoint or hosted form action, which needs no secret. If a provider can only be used with a secret key, a first-party handler must hold the key. That handler must first be added to `docs/threat-model.md` and the CSP (`connect-src`), and Venkat must approve it. The Buttondown API key is not to be used in client code.

CSP: the threat-model CSP has `form-action 'self'`. Posting to the provider adds the provider's form origin to `form-action`. This is a proposal that needs a threat-model update and Venkat's approval. A provider script, if any, would also need `script-src` and SRI, which is not possible for a changing vendor script, so use a plain HTML form with no provider script.

## Options considered
| Option | Double opt-in | Pros | Cons |
|---|---|---|---|
| Do nothing at launch (free option) | n/a | No cost, no personal data. | G3 cannot be met. Not acceptable. |
| Buttondown | Supported (unverified, check the vendor page) | Built for writers. Markdown issues. A public subscribe or embed endpoint for a custom form, with no key (unverified, verify that it exists). Free tier for a small list (unverified). | Paid plan needed after the free limit (unverified). Small vendor. |
| Beehiiv | Supported (unverified) | Growth features, hosted pages. | Heavier, more marketing features than needed. Embed scripts may hurt the SRS speed targets. |
| Mailchimp | Supported (unverified) | Well known. Free tier (unverified). | Free tier limits change often. Heavy embed. Tracking defaults need review for PECR. |
| Self-hosted (open source sender plus an email delivery service) | We build it | Full data control. | We handle deliverability, bounces, unsubscribe and security. Large effort. A sending service is still needed. Not justified for 100 subscribers. |

## Cost
Per month. All figures are unverified estimates, check the vendor page before purchase.

| Option | Cost per month |
|---|---|
| Do nothing | 0 |
| Buttondown | 0 on the free tier while the list is small; a paid plan after that (unverified estimate, check the vendor page before purchase) |
| Beehiiv | 0 on a free tier (unverified estimate, check the vendor page before purchase) |
| Mailchimp | 0 on a free tier (unverified estimate, check the vendor page before purchase) |
| Self-hosted | Server and sending service fees (unverified estimate, check the vendor page before purchase) plus Venkat's time |

## Decision
Recommend Buttondown. It is simple, Markdown-friendly, and double opt-in. Our own accessible form posts to the provider's public subscribe or embed endpoint with no key. Verify that this endpoint exists for the chosen provider before adoption. It is not verified. The goal of 100 subscribers may sit near the free tier limit, so Venkat should expect a possible paid plan in Jan or Feb 2027.

Venkat must approve: opening the account, the plan, the sender address and domain records (SPF, DKIM, DMARC, which are DNS changes), and the consent text on the form. Agents do not send any issue. Sending needs Venkat's approval each time until he says otherwise.

Confirm before adoption: that a public subscribe or embed endpoint that needs no key exists for the chosen provider, that double opt-in is on by default and cannot be switched off for the list, the data processing agreement, where data is stored, export and delete on request, and that no tracking pixel is added without a decision under PECR.

## Consequences
- Easier: no email infrastructure to run. The form is a thin client in `src/` with its own tests.
- Harder: subscriber data sits with a third party. The privacy notice must name the provider.
- Next: write the form contract and failure behaviour from `docs/architecture.md`; a key is used only through an approved first-party handler (threat-model entry, CSP change and Venkat's approval, as in `docs/architecture.md`). Build-time variables live in GitHub environments, with a stated owner and 90-day rotation.
- Reversible: yes. Subscribers can be exported and imported into another provider. Consent records must be exported with them.
