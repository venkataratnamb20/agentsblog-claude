# ADR 0007: Search

- **Status:** Direction approved by Venkat, 20 Nov 2026 (no search at launch, Pagefind after about 10 posts). Adding the Pagefind dependency later, and any account or paid plan, still need his approval. Nothing is adopted yet.
- **Date:** 2026-11-20
- **Supersedes:** none
- **Deciders:** Solution Architect Agent, Venkat (approver)
- **Reviewers:** Frontend Engineer Agent, SEO & Analytics Agent
- **Asana task:** Select hosting, CDN & services (ADRs) (gid 1220692569579020)

## Context
Launch has 3 posts and the target is 10 by 15 Feb 2027. Readers of a small blog can browse by tag and archive. Search starts to matter when the archive grows. The site is static (ADR 0001), so any search must run in the browser against a prebuilt index, or call a hosted service.

Approval timing: Venkat approves ADRs 0004 to 0008 as one batch with M1, because they are M1 exit items.

SRS targets checked: LCP under 2.5 s (search code must not load on article pages), INP under 200 ms (the index must be searched off the main thread or in small chunks, and typing must stay responsive), CLS under 0.1 (reserve space for the results), 99.9% uptime (a static index has no extra dependency, a hosted service does), WCAG 2.2 AA (the search box needs a label, keyboard use and announced results), UK GDPR and PECR (a hosted service receives queries and IP addresses, a local index sends nothing).

## Options considered
| Option | Pros | Cons |
|---|---|---|
| None for the MVP (free, do-nothing option) | No code, no cost, no risk to the SRS targets. Tag pages and the archive cover 10 posts. | Readers cannot search. Revisit when posts grow. |
| Pagefind static index | Free and open source (unverified, check the project page). Index built in CI after `astro build`. Loads only on demand. No third party and no personal data. Works on any static host (unverified). | Another build step. Astro 7 compatibility is unverified. Index files add some hosting size. Needs accessibility work on the UI. |
| Algolia | Fast, typo tolerant, good ranking. | Paid beyond a free tier (unverified). Account and API keys. Queries go to a third party, so a privacy notice entry is needed. Overkill for 10 posts. |
| Client-side library over a JSON file (for example a small fuzzy search) | Free. Simple. | We own ranking and index size. Index loads in full. Does not scale. |

## Cost
Per month. All figures are unverified estimates, check the vendor page before purchase.

| Option | Cost per month |
|---|---|
| None | 0 |
| Pagefind | 0. No account. (unverified estimate, check the project page before adoption) |
| Algolia | 0 on a free tier, paid beyond it (unverified estimate, check the vendor page before purchase) |
| JSON plus library | 0 (unverified, check the library licence) |

## Decision
Decision (Venkat, 20 Nov 2026): the direction is no search at launch, then Pagefind after about 10 posts. This approves the direction only.

Recommend none at launch, then Pagefind once there are about 10 posts (target 15 Feb 2027). This keeps the launch simple and protects the SRS speed targets. Pagefind is free and keeps queries in the browser, so no consent or processor agreement is needed. Algolia is not recommended for this size.

Venkat must approve: deferring search at launch, and adding Pagefind as a dependency later. No payment or account is needed for the recommended path.

## Consequences
- Easier: no search code at launch. Later, no vendor and no personal data.
- Harder: readers must browse by tag until search arrives. Add a good archive and tag pages in the build.
- Next: when adopting Pagefind, write the failing tests first for the build step and the UI labels, run an INP check with a throttled device, and keep the script off article pages.
- Reversible: yes. Remove the build step and the search page.
