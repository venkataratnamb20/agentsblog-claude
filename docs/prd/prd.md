# Product requirements: Agents Blog

Status: draft, awaiting Venkat's approval. Source of goals and targets: `docs/prd/charter.md` (copy of the Asana charter, 20 Nov 2026). Asana stays the source of truth.

## Problem

Engineers who build production agentic systems must follow a fast-moving field. Information is spread over papers, vendor docs and social posts. Much of it is not tested and some of it goes stale within weeks.

This blog gives them practical, research-backed posts. Each claim has a source. Each code sample was run. Each post carries a date so readers can judge how current it is.

Assumption: readers value verified, dated content over volume. We will test this with the KPIs below.

## Audience

| Audience | What they need |
|---|---|
| AI engineers | Working patterns they can copy: tool calling, MCP, memory, orchestration. Code that runs. Honest limits and failure modes. |
| Researchers | Short, accurate explainers of papers. Links to the original sources. A clear line between what a paper shows and what it only suggests. |
| Tech leads | A view of trade-offs, risks, evaluation and safety. Enough depth to decide what to build, buy or skip. |

All three read on desktop and mobile, arrive mostly from search, newsletter and community links (assumption, to check in analytics).

## Goals

Targets come from the charter. They are not changed here.

| Goal | SMART statement |
|---|---|
| G1 | Launch a production-ready blog on its custom domain on 14 Dec 2026, with all M4 quality gates passed on 9 Dec 2026 and hypercare complete on 23 Dec 2026. |
| G2 | Publish 10 technically verified AI-agent posts by 15 Feb 2027. |
| G3 | Reach 100 confirmed (double opt-in) newsletter subscribers by 26 Feb 2027. |
| G4 | Reach 1,000 monthly unique readers in February 2027. |

## KPIs and KPMs

The full KPI and KPM table is in section 2 of `docs/prd/charter.md`. This PRD adds no new targets. Targets are recalibrated at the January metrics review.

- G1 KPIs: launch on 14 Dec; 10 of 10 quality gates passed; 99.9%+ uptime through hypercare.
- G2 KPIs: 10 posts live; 80%+ pass the content QA checklist first time.
- G3 KPIs: 100 confirmed subscribers.
- G4 KPIs: 1,000 unique visitors in Feb; returning readers 25%+; average engaged time 3+ min; 5+ backlinks by Mar.

Each feature below names the goal it serves, so every requirement traces to G1 to G4.

## In scope

- The blog site: static pages, posts, tags, series, RSS, SEO metadata, dark mode. Dark mode is not named in the charter. Search is post-launch (F4).
- Newsletter signup with double opt-in.
- Weekly posts and a monthly research roundup.
- Specification, design, build, testing, security, performance, SEO, deployment and operations of the site.
- LinkedIn and X repurposing of posts.

## Out of scope

Phase 1 excludes:

- A comments system (comments).
- Sponsorships.
- Paid ads.
- Video and podcast.
- Guest authors.
- User accounts and logins. Added to the list by Venkat's decision on 20 Nov 2026 (see Decisions).

## MVP features

Already in the repo (20 Nov 2026): an Astro 7 static site, a post front-matter schema (title up to 70 characters, description up to 160, date, optional updated, tags, draft), draft handling, tag normalisation, slugs, reading time, post sorting, SEO helpers (canonical URL, Article and Breadcrumb JSON-LD, robots meta and robots.txt), an RSS route and a robots.txt route.

`src/pages` currently has only the index, `posts/[...slug]`, `rss.xml` and `robots.txt` routes. Tag pages, pillar pages, series pages, the 404 page, the About page and the privacy page are all new work. Search is post-launch.

Proposed front-matter additions, all needing Venkat's approval: `series` (string slug) and `seriesOrder` (number), both optional; `author`; `canonical`. These are listed under F2 and F9.

Quality gates: stage 4 has ten tasks (production readiness review, cross-browser, automated tests, SEO audit, security checklist, privacy and compliance, accessibility, code review, caching and CDN, performance). These ten are the charter's "10 of 10 quality gates".

### F1 Posts and drafts

Priority: P0. Serves G1, G2.

New posts start as `draft: true`. Drafts show only in local dev and in access-controlled PR previews built with `PREVIEW_DRAFTS=true` (`src/config.ts`). Staging and production builds exclude drafts.

New work: the schema default for `draft` is `false` today. Requirement: `npm run check:content` rejects a post with no explicit `draft` field, or the schema default becomes `true`.

**Acceptance criteria**

- A post file with valid front-matter renders at `/posts/<slug>/`.
- A post with `draft: true` is absent from the staging and production builds, the home page, RSS and the sitemap.
- A post with `draft: true` appears only in local dev and in PR previews built with `PREVIEW_DRAFTS=true`.
- `npm run check:content` fails on a post with no explicit `draft` field.
- A post with invalid front-matter fails the build with a clear message.
- Each post page shows its date, the updated date when set, and reading time.
- The home page lists published posts, newest first.

### F2 Tags and series

Priority: P0. Serves G2, G4.

Tags follow the rules in `docs/prd/content-pillars.md`. A series groups ordered posts.

New work: `src/lib/tags.ts` only normalises tags and `src/lib/postSchema.ts` accepts any string, so the approved-list check, the tag-count rule and the series fields do not exist yet. Proposed fields needing Venkat's approval: `series` (string slug, optional), `seriesOrder` (number, optional), `author`.

**Acceptance criteria**

- Each tag has a page listing its posts at `/tags/<tag>/`.
- Tags are lowercase hyphenated slugs. New work: a tag outside the approved list fails the content check.
- New work: non-roundup posts have 3 to 5 tags: exactly one pillar tag (first), one format tag and 1 to 3 topic tags. Roundups have 3 or 4 tags and no pillar tag: one format tag and 2 or 3 topic tags.
- If `author` is added, it is optional and defaults to the site name.
- A series page lists its posts in order, and each post in a series links to the previous and next post.
- Pillar pages list posts by pillar.

### F3 RSS feed

Priority: P0. Serves G4.

**Acceptance criteria**

- `/rss.xml` lists published posts, newest first, with title, description, link and date.
- Drafts never appear in the feed.
- The feed validates with a standard RSS validator.
- The head of every page links to the feed.

### F4 Search

Priority: P2. Post-launch. Serves G4.

ADR 0007 says no search at launch. It plans Pagefind after about 10 posts. This feature depends on that ADR, which is open. The 404 page links to tags and the archive, not search.

**Acceptance criteria**

- A reader can search post titles, descriptions and tags from a search page.
- Results show title and description and link to the post.
- Drafts are not in the index.
- Search works without a third-party service or tracking.

### F5 Newsletter signup with double opt-in

Priority: P0. Serves G3.

**Acceptance criteria**

- A signup form appears on the home page and at the end of every post.
- A new address is stored as unconfirmed and gets a confirmation email.
- The address counts as a subscriber only after the reader follows the confirmation link.
- Every email has a one-click unsubscribe link.
- The privacy notice states what is stored and why.
- Choice of email provider and any account or payment needs Venkat's approval (see Approval).

### F6 Code blocks with copy

Priority: P0. Serves G2.

**Acceptance criteria**

- Fenced code blocks have syntax highlighting and a language label.
- Each block has a copy button that works with the keyboard and has an accessible name.
- The copy button reports success to screen readers.
- Code blocks scroll sideways on narrow screens without breaking the page.

### F7 Dark mode

Priority: P1. Serves G4.

**Acceptance criteria**

- The site follows the system colour scheme by default.
- A reader can switch theme, and the choice is remembered.
- Text contrast meets WCAG 2.2 AA in both themes. Test method: automated accessibility scan in the stage 4 accessibility task.
- The page does not flash the wrong theme on load. Test method: E2E test that loads a page with a stored dark preference and checks the theme attribute before first paint.

### F8 Related posts

Priority: P1. Serves G4.

**Acceptance criteria**

- Each post shows up to three related posts, chosen by shared tags and then by pillar.
- A post never lists itself or a draft.
- A post with no match shows the latest posts instead.

### F9 SEO metadata

Priority: P0. Serves G1, G4.

Builds on `src/lib/seo.ts`.

**Acceptance criteria**

- Every page has a unique title, a meta description, a canonical URL and Open Graph tags.
- Post pages carry BlogPosting JSON-LD and BreadcrumbList JSON-LD. New work: `src/lib/seo.ts` still emits `Article`, so changing it to `BlogPosting` is a code change.
- Production pages are `index, follow`. Staging pages are `noindex, nofollow` unless `ALLOW_INDEXING=true`.
- `robots.txt` and a sitemap are generated.
- Lighthouse SEO scores 100 (charter KPM). It runs in stage 4, as Lighthouse CI in the stage 4 test suite task, on the home page, a post page and a tag page of a production-like build with `ALLOW_INDEXING=true`. The 404 page is excluded from the SEO score, because noindex staging and previews cannot score 100.
- Proposal needing Venkat's approval: an optional `canonical` front-matter field that overrides the canonical URL for a post.

### F10 Performance and accessibility baseline

Priority: P0. Serves G1.

**Acceptance criteria**

- Lighthouse Performance is 90 or more and Accessibility is 95 or more (charter KPMs) on the home page, a post page and a tag page of a production-like build with `ALLOW_INDEXING=true`. The 404 page is excluded.
- Every image has alt text, enforced by `npm run check:content`.
- All pages work with the keyboard only. Test method: a manual keyboard checklist in the stage 4 accessibility task, plus E2E tests for the menu, theme switch, copy button and signup form.

### F11 Privacy-respecting analytics

Priority: P1. Serves G3, G4.

Depends on ADR 0006, which is open. ADR 0006 recommends Cloudflare Web Analytics, which has no custom events. So there is no site-side `newsletter_signup_confirmed` event. Conversion and subscriber counts come from the newsletter provider's report plus page views.

**Acceptance criteria**

- Page views are measured without cookies that need a consent banner (assumption, SEO and Security to confirm).
- No tracking goes live without Venkat's approval.
- The weekly KPM report contains these fields: page views per week; unique visitors per week; top 10 pages by views; referrer groups (search, social, direct, other); organic search clicks per week; confirmed subscribers (from the provider); new signups per week (from the provider); visitor-to-subscriber conversion (provider signups divided by unique visitors); posts published and posts drafted ahead; share of posts indexed.

### F12 About page and basic site pages

Priority: P2. Serves G4.

**Acceptance criteria**

- An About page explains the blog, how posts are produced by AI agents with human approval, and how sources are checked.
- A privacy page states what is stored, why, and how to unsubscribe or ask for deletion.
- A 404 page links to the home page, the tags page and the archive. It does not link to search.
- Footer links to RSS, the newsletter and the privacy page.

## Post formats

| Format | Purpose | Notes |
|---|---|---|
| Deep dive | Explain one architecture or topic in depth. | Sources cited; code run. |
| Tutorial | Build something step by step. | Every code sample was run; versions stated. |
| Paper explainer | Summarise one paper for practitioners. | Links to the paper; states what it shows and what it does not. |
| Research roundup | Monthly list of notable papers, tools and changes. | Short entries, each with a source and a date. |

Every post follows the content rules in `CLAUDE.md`: front-matter checks, a source for every claim, alt text on images, and `draft: true` until Venkat approves.

## Publishing cadence

- One post a week, plus a monthly research roundup.
- Keep a buffer of two drafted posts ahead of the publish date (charter KPM: 2+ posts drafted ahead).
- Posts 4 to 6 are drafted before the holiday gap (charter risk table).
- Launch on 14 Dec 2026 with posts 1 to 3 (gate M5).
- Monthly roundups count toward the 10 posts for G2 (decided 20 Nov 2026; see Decisions).
- Posts are dated, and a monthly refresh check looks for stale posts.

## Decisions

Decided by Venkat, 20 Nov 2026 (chat):

- G2: roundups count toward the 10 verified posts (Post 10 in Asana is a roundup).
- User accounts and logins stay on the Out of scope list.
- Site search is post-launch. ADR 0007: none at launch, Pagefind after about 10 posts. F4 stays P2 and post-launch.
- `npm run check:content` must require an explicit `draft` field on every post. The schema default stays as it is.
- Four optional front-matter fields are approved: `series`, `seriesOrder`, `author`, `canonical`.
- Tag rule approved: non-roundup posts have 3 to 5 tags (pillar tag first, one format tag, up to 3 topic tags). Roundups have 3 or 4 tags and no pillar tag.
- The navigation label is "Subscribe". The planned series and their order are approved as the starting plan.
- Newsletter direction: Buttondown (double opt-in). Analytics direction: Cloudflare Web Analytics (cookieless, page views only; Plausible stays the upgrade path). Hosting direction: Cloudflare Pages on the free tier, with no custom staging domain.
- These are directions only. No account, domain, registrar, paid plan or DNS change is approved.

## Approval

Status: draft, awaiting Venkat's approval. His approval subtask in Asana is separate and still open. Approval is part of gate M1 (24 Nov to 27 Nov 2026).

Questions for Venkat:

1. Decided 20 Nov 2026: roundups count toward the 10 posts for G2.
2. Direction decided 20 Nov 2026: Buttondown (double opt-in). Accounts, plans and any consent wording still need Venkat's approval.
3. Decided 20 Nov 2026: search (F4) is post-launch (Pagefind after about 10 posts, ADR 0007).
4. Direction decided 20 Nov 2026: Cloudflare Web Analytics (cookieless, page views only; Plausible stays the upgrade path). Accounts, plans and any consent wording still need Venkat's approval.
5. Decided 20 Nov 2026: the tag rules and the planned series in `docs/prd/content-pillars.md` are approved as the starting plan. The five pillars themselves are not listed in the decisions, so they stay open.
6. Decided 20 Nov 2026: "User accounts and logins" is out of scope.
7. Decided 20 Nov 2026: the front-matter fields `series`, `seriesOrder`, `author` and `canonical` are approved.
8. UX sign-off on navigation and the F4, F7 and F12 pages is still open. The UX/UI Designer has not reviewed this PRD.
