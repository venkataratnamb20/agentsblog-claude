# Software requirements specification: Agents Blog

Status: draft, awaiting Venkat's approval. Owner: Product Strategist. Source of features: `docs/prd/prd.md` (F1 to F12). Source of goals: `docs/prd/charter.md` (G1 to G4). Security input: `docs/threat-model.md`. Stack: `docs/adr/0001-core-tech-stack.md`.

## Scope and conventions

- The product is a static Astro site with posts, tags, series, RSS, a newsletter signup and SEO metadata. Search is post-launch (see FR-5). It has no user accounts and no custom server code at launch.
- "Shall" marks a requirement. Each requirement has an id, a PRD feature and at least one Given, When, Then criterion that a test can check.
- Hosting, newsletter provider, analytics and search are decided in ADRs 0004 to 0007. This document names no tool itself and cites those ADRs. Where a requirement depends on them it says so.
- Tools needed for NFR-4 (an external uptime monitor), Google Search Console and a keyword tool are open items. No ADR or cost estimate covers them yet.
- Launch scope: requirements marked post-launch are not tested at gate M3 or M4. Every other criterion is tested at M3 or M4.
- Drafts: drafts show only in local dev and in access-controlled pull request previews built with `PREVIEW_DRAFTS=true`. Staging and production builds exclude drafts.
- Stage 4 has ten tasks. They are the ten quality gates in the charter ("10 of 10 quality gates passed").
- Existing code that these requirements build on: `src/lib/postSchema.ts` (title up to 70 characters, description up to 160, date, optional updated, tags as a plain string array, draft that defaults to false) and `src/lib/seo.ts` (canonical URL, Article and Breadcrumb JSON-LD, robots meta).
- Anything marked "Assumption" is not yet confirmed and is owned by the named role or listed in Open questions.

## Functional requirements

### FR-1 Posts and drafts

Traceability: PRD F1. Goals G1, G2.

The site shall render each valid post file in `content/posts/` at `/posts/<slug>/`, with its date, the updated date when set and the reading time. The site shall exclude every post with `draft: true` from staging and production output. The build shall fail on invalid front-matter. The content check shall reject a post with no explicit `draft` field, because `src/lib/postSchema.ts` defaults `draft` to false while `CLAUDE.md` says posts start as `draft: true`. (Assumption: either the check is added or the schema default becomes true. The Frontend Engineer and Technical Editor choose. Either way is new work.)

Acceptance criteria:

- Given a post file with valid front-matter, When the site is built, Then the page `/posts/<slug>/` exists and shows the date and reading time.
- Given a post with `updated` set, When its page is rendered, Then the updated date is shown next to the date.
- Given a post with `draft: true`, When the site is built for staging or production, Then its slug is absent from `dist/`, the home page, the RSS feed and the sitemap.
- Given a post with `draft: true`, When the site is built locally or as a pull request preview with `PREVIEW_DRAFTS=true`, Then the post is rendered.
- Given a post with no `draft` field, When `npm run check:content` runs, Then it fails and names the file.
- Given a post with a title over 70 characters or a description over 160, When the site is built, Then the build fails with a message that names the file and the field.
- Given several published posts, When the home page is rendered, Then they are listed newest first.

### FR-2 Tags

Traceability: PRD F2. Goals G2, G4.

The site shall give each tag a page at `/tags/<tag>/` that lists its posts, and shall give each pillar a page that lists its posts. Each non-roundup post shall have 3 to 5 tags: exactly one pillar tag (listed first), exactly one format tag and up to 3 topic tags. A research roundup (format tag `research-roundup`) shall have no pillar tag, one format tag and 2 or 3 topic tags, so 3 or 4 tags in total. Tags shall be lowercase, hyphenated slugs. The content check shall reject a tag that is not on the approved list in `docs/prd/content-pillars.md`.

Required work: the current schema keeps `tags` as a plain string array with no approved list, pillar or format rule. A schema extension or content check that enforces these rules is required new work (Frontend Engineer with the Solution Architect).

Acceptance criteria:

- Given a post tagged `mcp`, When the site is built, Then `/tags/mcp/` lists that post and the post links to the tag page.
- Given a tag written as `Model Context Protocol`, When it is normalised, Then it becomes `model-context-protocol`.
- Given a post with a tag outside the approved list, When `npm run check:content` runs, Then it fails and names the tag.
- Given a non-roundup post with no pillar tag, more than one pillar tag, no format tag or more than one format tag, When `npm run check:content` runs, Then it fails.
- Given a non-roundup post with fewer than 3 or more than 5 tags, or more than 3 topic tags, When `npm run check:content` runs, Then it fails.
- Given a non-roundup post whose first tag is not its pillar tag, When `npm run check:content` runs, Then it fails.
- Given a research roundup with a pillar tag, or with fewer than 3 or more than 4 tags, When `npm run check:content` runs, Then it fails.
- Given a research roundup with one format tag and 2 or 3 topic tags and no pillar tag, When `npm run check:content` runs, Then it passes.
- Given a pillar page, When it is rendered, Then it lists the posts of that pillar.

### FR-3 Series

Traceability: PRD F2. Goals G2, G4.

The site shall support ordered series. A post shall join a series through two optional front-matter fields: `series` (a string slug) and `seriesOrder` (a number). Both are proposals for the Solution Architect to confirm. A series page shall list its posts in order, and each post in a series shall link to the previous and next post.

Required work: `src/lib/postSchema.ts` has no series fields today. Adding them is new work.

Acceptance criteria:

- Given three posts in one series with orders 1, 2 and 3, When the series page is rendered, Then the posts are listed in that order.
- Given the second post of a series, When its page is rendered, Then it links to the first and to the third.
- Given the first post of a series, When its page is rendered, Then it shows a next link and no previous link.
- Given a post with `series` but no `seriesOrder`, When `npm run check:content` runs, Then it fails.
- Given a post without series fields, When it is built, Then it renders without a series box.

### FR-4 RSS feed

Traceability: PRD F3. Goal G4.

The site shall publish `/rss.xml` listing published posts, newest first, with title, description, link and date. Every page head shall link to the feed.

Acceptance criteria:

- Given published posts, When `/rss.xml` is fetched, Then each item has title, description, link and date, and items are newest first.
- Given a draft post, When `/rss.xml` is built for staging or production, Then the draft is absent.
- Given the built feed, When a standard RSS validator checks it, Then it reports no errors.
- Given any page, When its head is read, Then it contains a link to `/rss.xml` of type `application/rss+xml`.

### FR-5 Search (post-launch, P2)

Traceability: PRD F4. Goal G4.

Priority: post-launch (P2). ADR 0007 decides there is no search at launch and that a build-time index tool (Pagefind) is added after about 10 posts. This requirement is not tested at M3 or M4. After launch, the site shall offer a search page that finds posts by title, description and tag from a build-time index, with no tracking. Gate: Venkat approves adding search (open question 3).

Acceptance criteria (apply when search is added):

- Given a published post titled "Tool calling and MCP", When a reader searches "mcp", Then the result shows that post's title and description and links to it.
- Given a draft post, When the search index is built for staging or production, Then the draft is not in the index.
- Given the search page loaded with a clean browser profile, When a reader searches, Then no request goes to an origin other than the site.
- Given a query with no match, When the search runs, Then the page shows a message that says no posts matched.

### FR-6 Newsletter signup with double opt-in

Traceability: PRD F5. Goal G3.

The site shall show a signup form on the home page and at the end of every post. A new address shall be stored as unconfirmed and shall receive a confirmation email. The address shall count as a subscriber only after the reader follows the confirmation link. Every email shall carry a one-click unsubscribe link. A privacy notice shall state what is stored and why. The form shall post to the provider's public subscribe endpoint, so no secret is held in the browser or in site code. A key would need a first-party handler and a threat-model update first. The provider needs Venkat's approval (ADR 0005).

Acceptance criteria:

- Given a reader on the home page, When they submit a new valid address, Then the address is stored as unconfirmed and a confirmation email is sent.
- Given an unconfirmed address, When the reader follows the confirmation link, Then the address becomes confirmed and a consent timestamp is recorded.
- Given an unconfirmed address, When no confirmation link is followed, Then the address is never counted as a subscriber and never gets marketing email.
- Given any newsletter email, When the reader selects the unsubscribe link, Then the address is unsubscribed with one action and no login.
- Given an invalid address or a filled honeypot field, When the form is submitted, Then no subscription is created.
- Given the form, When it is rendered, Then it has a visible label, a link to the privacy notice and an accessible error message.
- Given the built site, When the page source and bundles are searched, Then no provider secret or API key is present.

### FR-7 Code blocks with copy

Traceability: PRD F6. Goal G2.

The site shall render fenced code blocks with syntax highlighting and a language label. Each block shall have a copy button that works from the keyboard, has an accessible name and announces success to screen readers. Blocks shall scroll sideways on narrow screens without breaking the page.

Acceptance criteria:

- Given a fenced block with a language, When the post is rendered, Then the block is highlighted and shows the language label.
- Given a code block, When a keyboard user tabs to the copy button and presses Enter, Then the code is copied.
- Given a successful copy, When a screen reader is active, Then a status message announces that the code was copied.
- Given a 320 px wide viewport and a long code line, When the post is rendered, Then the block scrolls sideways and the page has no horizontal scroll.

### FR-8 Dark mode

Traceability: PRD F7. Goal G4.

The site shall follow the system colour scheme by default, let a reader switch theme, remember the choice and avoid a flash of the wrong theme on load. Both themes shall meet the contrast rules in AR-1 and AR-5.

Acceptance criteria:

- Given a system set to dark and no saved choice, When a page loads, Then the dark theme is shown.
- Given a reader who selects the light theme, When they reload or visit another page, Then the light theme is still shown.
- Given a saved dark choice, When a page loads, Then the first paint is dark with no visible switch from light.
- Given either theme, When an automated contrast check runs, Then every text and control colour pair meets WCAG 2.2 AA.
- Given the stored choice, When it is saved, Then it is kept in local storage and no cookie is set.

### FR-9 Related posts

Traceability: PRD F8. Goal G4.

The site shall show up to three related posts on each post page, chosen by shared tags and then by pillar. A research roundup has no pillar, so it is matched by shared tags only, and no post is matched to a roundup by pillar. A post shall never list itself or a draft. A post with no match shall show the latest posts instead.

Acceptance criteria:

- Given a post that shares tags with four others, When its page is rendered, Then three related posts are shown, ranked by shared tags and then pillar.
- Given any post, When its related list is built, Then the list does not contain that post or any draft.
- Given a post that shares no tag or pillar with any other, When its page is rendered, Then the latest published posts are shown instead.

### FR-10 SEO metadata

Traceability: PRD F9. Goals G1, G4.

The site shall give every page a unique title, a meta description, a canonical URL and Open Graph tags. Post pages shall carry BlogPosting and BreadcrumbList JSON-LD. `src/lib/seo.ts` emits Article today, so the change to BlogPosting is new work. Production pages shall be `index, follow`. Staging pages shall be `noindex, nofollow` unless `ALLOW_INDEXING=true`. The site shall generate `robots.txt` and a sitemap.

Acceptance criteria:

- Given any built page, When its head is read, Then it has a title, description, canonical URL and Open Graph tags, and no two pages share a title.
- Given a post page, When its JSON-LD is parsed, Then it contains valid BlogPosting and BreadcrumbList objects.
- Given a staging build without `ALLOW_INDEXING=true`, When a page head is read, Then robots is `noindex, nofollow`.
- Given a production build, When a page head is read, Then robots is `index, follow`.
- Given a production build, When `robots.txt` and the sitemap are fetched, Then both exist and the sitemap lists no draft.

### FR-11 Privacy-respecting analytics

Traceability: PRD F11. Goals G3, G4.

The site shall measure page views without cookies that need a consent banner (ADR 0006 position, not legal advice; SEO and Security to confirm). Newsletter conversion and subscriber counts shall come from the newsletter provider's report combined with page views. Assumption: the chosen tool has no custom events, so the site sends no `newsletter_signup_confirmed` event. No tracking shall go live without Venkat's approval.

Acceptance criteria:

- Given a clean browser profile, When any page loads and the reader has given no consent, Then no cookie is set, and no request goes to a non-site origin unless the tool is cookieless, sets no cookie, stores no personal data, is approved by Venkat and has its origin in the CSP. (If ADR 0006 picks a tool that needs consent, the variant is: Given a consent banner not yet accepted, When a page loads, Then no tracking request is sent; and When the reader accepts, Then the tracking request is sent.)
- Given the approved analytics tool, the newsletter provider's report and one week of data, When the weekly KPM report is produced, Then it contains page views, unique visitors, top pages and new confirmed subscribers, each for that week. (Returning reader share is reported only with an events tool, an ADR 0006 upgrade.)
- Given a pull request that adds a third-party script origin not in the CSP, When CI runs the headers and script-origin check, Then the CI check fails.

### FR-12 About page and basic site pages

Traceability: PRD F12. Goal G4.

The site shall have an About page, a privacy notice, a 404 page and a footer. The About page shall explain the blog, that agents write posts with human approval and how sources are checked. The 404 page shall link to the home page, the tags and the archive (a list of all posts). Search is post-launch, so the 404 page does not link to it. The footer shall link to RSS, the newsletter and the privacy notice.

Acceptance criteria:

- Given the About page, When it is read, Then it states the agent-plus-human process and the source checks.
- Given an unknown URL, When the 404 page is shown, Then it links to the home page, the tags page and the archive.
- Given any page, When the footer is read, Then it links to RSS, the newsletter signup and the privacy notice.
- Given the privacy notice, When it is read, Then it states what newsletter data is stored, why, for how long (Assumption: retention to be set by Venkat) and how to ask for deletion.

### FR-13 Main navigation and footer

Traceability: PRD F12. Goal G4.

The site shall show a main navigation on every page with five items in this order: Posts (`/posts/`), Topics (`/topics/`), Series (`/series/`), About and Subscribe. The site name is the Home link, so Home is not a navigation item. Subscribe links to the newsletter form. On a 320 px wide screen the navigation shall be a visible row of links that wraps, with no hidden menu and no script. The link for the current page shall carry `aria-current="page"` and a style that is not colour alone. The footer shall repeat the main navigation and add the `/tags/` index and the privacy notice. The footer links named in FR-12 (RSS, the newsletter and the privacy notice) stay as FR-12 states. Search is post-launch (FR-5), so it is NOT in the launch navigation. When search ships, it is added as a sixth item. Tags are not in the main navigation. Navigation rules for accessibility are in AR-11 and AR-12. Source: `docs/prd/content-pillars.md`, UX review of 20 Nov 2026.

Acceptance criteria:

- Given any page, When the main navigation is read, Then it lists Posts, Topics, Series, About and Subscribe in that order, and the site name links to the home page.
- Given any page, When the main navigation is read, Then it has no Home item and no search item, because search is post-launch.
- Given a 320 px wide viewport, When any page is rendered, Then all five links are visible without opening a menu, the row wraps without horizontal scroll, and no script is needed.
- Given the Posts page, When its navigation is read, Then the Posts link has `aria-current="page"` and no other navigation link has it.
- Given any page, When the footer is read, Then it contains the five main navigation links, the `/tags/` index link and the privacy notice link.
- Given any two pages, When their main navigation is compared, Then the items and their order are the same.

### FR-14 Posts archive

Traceability: PRD F12 and F1. Goal G4.

The site shall render `/posts/` as the archive. It shall list every published post, newest first, with title, description and date. It shall exclude every post with `draft: true` under the staging and production rule in FR-1. The archive is the way to browse all posts without search.

Acceptance criteria:

- Given several published posts, When `/posts/` is rendered, Then every one is listed, newest first.
- Given a post with `draft: true`, When the site is built for staging or production, Then `/posts/` does not list it.
- Given a post, When `/posts/` is rendered, Then its entry shows the title, description and date and links to `/posts/<slug>/`.

### FR-15 Topics and pillar pages

Traceability: PRD F2. Goals G2, G4.

The site shall render `/topics/` with an entry for each of the five pillars, each with its audience need and post count, and one extra entry named "Research roundups" that links to the `research-roundup` tag page (roundups have no pillar, see FR-2). Each pillar shall have a curated page with a short intro (the audience need), any series in that pillar, then its posts newest first. Pillar pages are the only pages that map to a pillar. On a post page, the pillar tag shall link to its pillar page, not to a tag page. The other tags link to their tag pages (FR-2 and FR-17). Pillar names and the pillar to tag map are in `docs/prd/content-pillars.md`.

Acceptance criteria:

- Given the built site, When `/topics/` is rendered, Then it lists the five pillars with audience need and post count, plus a "Research roundups" entry.
- Given the "Research roundups" entry, When a reader selects it, Then they reach `/tags/research-roundup/`.
- Given a pillar page, When it is rendered, Then it shows the intro, then any series in that pillar, then its posts newest first (the pillar listing rule in FR-2 applies).
- Given a post with a pillar tag, When its page is rendered, Then the pillar tag links to the pillar page.
- Given a post with a topic tag, When its page is rendered, Then that tag links to `/tags/<tag>/`.
- Given a draft post, When the site is built for staging or production, Then no pillar page counts or lists it.

### FR-16 Series index and series pages

Traceability: PRD F2. Goals G2, G4.

The site shall render `/series/` as an index of all series with their post counts, and `/series/<slug>/` for each series. A post joins a series through the optional `series` and `seriesOrder` front-matter fields approved on 20 Nov 2026 (FR-3). A series page shall list its posts in an ordered list (`ol`) so the order is exposed to screen readers, and each item shall show "Part N of M" as text. M is the number of published posts in the series, so drafts do not count towards M. A post in a series shall show a series box with the series name, "Part N of M" and links to the previous and next post, named by the post title and not by "previous" or "next" alone. The order and the previous and next rules in FR-3 apply.

Acceptance criteria:

- Given three published posts in one series, When `/series/<slug>/` is rendered, Then they are in an `ol` in `seriesOrder` and the items read "Part 1 of 3", "Part 2 of 3" and "Part 3 of 3" as text.
- Given a series with two published posts and one draft, When the site is built for staging or production, Then the series page shows "of 2" and does not list the draft.
- Given the second post of a series, When its page is rendered, Then the series box shows the series name and "Part 2 of 3" and links to the first and third posts by their titles.
- Given the first post of a series, When its page is rendered, Then the series box has a next link named by title and no previous link.
- Given two or more series, When `/series/` is rendered, Then each series is listed with its post count and links to `/series/<slug>/`.

### FR-17 Tags index and tag pages

Traceability: PRD F2. Goals G2, G4.

The site shall render `/tags/` as an index of all tags in use, A to Z, with a post count for each. It shall render each `/tags/<tag>/` page (FR-2) as a plain, automatic list of published posts with that tag, with no intro. The tag name is the `h1` (AR-8) and the page shows the post count. The `/tags/` index is linked from the footer (FR-13) and the 404 page (FR-12) and is not in the main navigation. The `research-roundup` tag has a tag page like any other tag.

Acceptance criteria:

- Given posts with several tags, When `/tags/` is rendered, Then every tag in use is listed A to Z with its post count.
- Given a tag page, When it is rendered, Then the tag name is the only `h1` and the post count is shown.
- Given a tag page, When it is rendered, Then it lists its published posts automatically and has no intro text.
- Given a draft post, When the site is built for staging or production, Then no tag page or count includes it.
- Given any page, When the footer is read, Then it links to `/tags/`, and the main navigation does not.

## Non-functional requirements

Web Vitals targets apply at the 75th percentile on mobile. Lab checks use Lighthouse on a production-like build with `ALLOW_INDEXING=true`, on the home page, a post page and a tag page (the page types in `docs/test-strategy.md`). The 404 page is excluded from all Lighthouse scores and is checked by the axe scan in NFR-8. Field checks start after launch. Stage 4 tasks come from `progress/06-4-quality-security-performance-gates.md`.

| ID | Requirement | Target | Measurement method | Stage 4 task that checks it |
|---|---|---|---|---|
| NFR-1 | LCP (largest contentful paint) | Under 2.5 s | Lighthouse mobile run in CI against the preview build; field data at the 75th percentile after launch | Performance testing and budgets (Core Web Vitals) |
| NFR-2 | INP (interaction to next paint) | Under 200 ms at the 75th percentile (field). Pre-launch gate: Lighthouse total blocking time under 200 ms (assumption: threshold to be confirmed by DevOps and SRE) and every scripted interaction (theme switch, copy button, form focus) completes its next paint in under 200 ms in a Playwright trace | Pre-launch gate: TBT plus scripted interactions. Field data at the 75th percentile is checked after launch, once enough visits exist | Performance testing and budgets (Core Web Vitals) |
| NFR-3 | CLS (cumulative layout shift) | Under 0.1 | Lighthouse mobile run; images carry width and height; check no layout shift on theme load | Performance testing and budgets (Core Web Vitals) |
| NFR-4 | Availability | 99.9% uptime per calendar month. The hypercare window (14 to 23 Dec 2026) is the first check, as in `docs/test-strategy.md`; the monthly target continues after it | Measured by the external uptime monitor on the production URL (tool is an open item, see Scope), plus certificate expiry alerts (R16) | Production readiness review (go/no-go); caching and CDN configuration |
| NFR-5 | Lighthouse Performance | 90 or more on the home page, a post page and a tag page (404 page excluded) | Lighthouse CI, median of three mobile runs per page type | Performance testing and budgets (Core Web Vitals) |
| NFR-6 | Lighthouse Accessibility | 95 or more on the home page, a post page and a tag page (404 page excluded; it is covered by the axe scan in NFR-8) | Lighthouse CI, median of three runs per page type, plus the audit in NFR-8 | Accessibility audit (WCAG 2.2 AA) |
| NFR-7 | Lighthouse SEO | 100 on the home page, a post page and a tag page; 404 page excluded | Lighthouse CI on a production-like build with `ALLOW_INDEXING=true`, median of three runs per page type; the `seo-audit` skill before each post goes to review | SEO audit |
| NFR-8 | Accessibility standard | WCAG 2.2 AA on every page template; axe reports 0 serious or critical violations on every page type | axe (`@axe-core/playwright`) scan per page type, keyboard-only pass and screen reader pass on each template (see AR-1 to AR-17) | Accessibility audit (WCAG 2.2 AA) |
| NFR-9 | Security, OWASP-aligned | Headers in SR-1 on every response; supply-chain policy in SR-3 and SR-4; no high-severity audit finding; OWASP Top 10 (2021) items mapped in `docs/threat-model.md` | Request staging and production and compare each header; `npm audit --audit-level=high` exit code 0; ASVS Level 1 checklist | Security and vulnerability checklist; caching and CDN configuration |
| NFR-10 | Privacy: UK GDPR and PECR | No non-essential cookie or tracking before consent; email plus consent record only; deletion route; working unsubscribe link | Clean-profile load test; subscribe, confirm, unsubscribe and delete with a test address | Privacy and compliance check |
| NFR-11 | Scalability | Under a load test at 10 times the G4 goal (about 10,000 monthly readers, Assumption, to be confirmed in ADR 0004), Lighthouse Performance and LCP stay within 10% of the unloaded result; build time under 5 minutes at 50 posts (Assumption) | CDN cache-hit ratio from host logs; timed CI build with 50 generated posts | Caching and CDN configuration; Performance testing and budgets |
| NFR-12 | Maintainability | Lint, typecheck and test gates pass in CI; coverage and complexity limits in `docs/guidelines/code-quality.md`; every PR reviewed against the checklist; pure logic in `src/lib/` with unit tests | CI results on the release commit; coverage report | Automated test suite; Code review (every PR against the checklist) |
| NFR-13 | Browser support | Latest two versions of Chrome, Firefox, Safari and Edge, and mobile Safari and Chrome (Assumption) | Cross-browser run on the preview build, 320 px to 1440 px widths | Cross-browser and responsive testing |
| NFR-14 | Content integrity | Zero drafts in staging and production output; every image has alt text | Production build check (R10); `npm run check:content` | Automated test suite; Security and vulnerability checklist |

## Security and privacy requirements

Each requirement lists the risks in the register of `docs/threat-model.md` that it covers. The Check line points to the matching Test (stage 4) column of that register. All checks run in the Security and vulnerability checklist task unless a line names another task.

- SR-1 Security headers. The site shall send the Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, Permissions-Policy and frame-ancestors headers on every response, with the values in `docs/threat-model.md`. `script-src` shall not contain `unsafe-inline` or `unsafe-eval`. Covers R06, R13. Check: fetch the built site, confirm the CSP header and that `script-src` has no `unsafe-inline` or `unsafe-eval` (R06 test); compare staging and production headers to the threat model (R13 test).
- SR-2 Third-party code. The site shall load no third-party script without a CSP change, an entry in the threat model and Venkat's approval. Any such script shall use Subresource Integrity. Covers R06, R09. Check: confirm every script source is first party (R06 test); load with a clean profile and confirm no analytics request before consent (R09 test).
- SR-3 Dependencies. CI shall use a committed lockfile and `npm ci`, and shall run a blocking high-severity audit. A waiver needs Venkat's written approval and an expiry date. Covers R04. Check: run `npm ci` and `npm audit --audit-level=high` on the release commit, exit code 0 and no lockfile diff (R04 test).
- SR-4 Actions and releases. Every GitHub Action shall be pinned by a 40 character commit SHA. Each tagged release shall attach an SBOM. Covers R05, R04. Check: grep every `uses:` in `.github/workflows` for a 40 character SHA (R05 test); confirm the SBOM is attached to the release (stage 5 item).
- SR-5 Content injection. The site shall not use `set:html` on untrusted input, and the content check shall reject `javascript:` links. Covers R06. Check: search `src/` for `set:html`, and run `npm run check:content` on a fixture with a `javascript:` link and confirm it fails (R06 test plus the CSP check).
- SR-6 Drafts. Staging and production builds shall exclude drafts, and `draft: false` shall need Venkat's written approval. Covers R10. Check: build in production mode and confirm no draft slug is in `dist/`, the sitemap or the RSS feed (R10 test).
- SR-7 Secrets. The secret scan shall run in the hook, the pre-commit and CI, and no site code shall read a secret at build or run time. The newsletter form uses the provider's public subscribe endpoint, so the browser holds no secret. Covers R11. Check: run `npm run secrets:scan` on the release commit and confirm no finding (R11 test).
- SR-8 Subscriber data. Subscriber data shall be limited to email address and consent record, collected by double opt-in, covered by a privacy notice and a processor agreement, and erasable on request (UK GDPR). Covers R08. Check: subscribe with a test address and confirm the double opt-in email, a consent timestamp and a deletion route (R08 test; Privacy and compliance check task).
- SR-9 Email. Every newsletter shall have a working unsubscribe link, and marketing email shall go only to confirmed subscribers. The sending domain shall have SPF, DKIM and DMARC. Covers R08. Check: confirm a working unsubscribe link in a test email and that the sending domain publishes SPF, DKIM and DMARC records (R08 test).
- SR-10 Cookies and tracking. The site shall set no non-essential cookie before consent (PECR), and shall send no request to a non-site origin before consent unless the tool is cookieless, sets no cookie, stores no personal data, is approved by Venkat and has its origin in the CSP (ADR 0006 position, not legal advice). Covers R09. Check: load the built site with a clean browser profile and confirm no cookie and no non-site request before consent (R09 test; Privacy and compliance check task).
- SR-11 Form abuse. The signup form shall use provider rate limiting, a honeypot field and double opt-in. Covers R15. Check: submit 20 rapid sign-ups from one address and confirm throttling or blocking (R15 test).
- SR-12 Accounts. Two-factor shall be on for GitHub, host, CDN, registrar and newsletter accounts. DNS changes shall need Venkat's approval. Covers R07, R16. Check: confirm two-factor on each account (R07 test). Evidence: Venkat's written confirmation.
- SR-13 Access control. Branch protection and required review shall apply to `main` and `develop`, and a direct or forced push shall be rejected by the server. Secrets shall live only in the provider secret store, with 90 day token rotation. Covers R01, R02. Check: read repository settings and attempt a direct and a force push, both rejected (R01 and R02 tests). Evidence for the 90 day rotation: Venkat's written confirmation.
- SR-14 Guardrails. The hook and deny-rule hardening shall be complete, or each open gap accepted in writing by Venkat, before launch. Covers R03. Check: re-run the hook bypass cases and confirm each is blocked or accepted (R03 test).
- SR-15 Vulnerability reporting. Private vulnerability reporting shall be on and `SECURITY.md` shall exist. Covers R12. Check: confirm the Security tab shows private reporting on and `SECURITY.md` exists (R12 test).
- SR-16 Agent control. Agent changes shall go through a PR with a named human reviewer, and no message from an agent counts as approval. Covers R14. Check: review the agent PRs for the release for out-of-scope changes and a named human reviewer (R14 test).
- SR-17 Audit trail. Approvals and outcomes shall be recorded in git history, PRs and Asana comments, not in the local action log. Covers R17. Check: confirm approvals and outcomes appear as Asana comments for the release tasks (R17 test).
- SR-18 Domain and certificates. Certificates and the domain shall auto-renew, with an alert 30 days before expiry. Covers R16. Check: confirm auto-renew is on and an alert exists for 30 days before expiry (R16 test).

Coverage check: R01 to R17 are each covered by at least one SR above.

## Accessibility requirements

Standard: WCAG 2.2 AA. The Accessibility audit task in stage 4 checks them.

UX review (20 Nov 2026): agreed with changes. This is a design review by the UX/UI Designer agent, not Venkat's approval, which stays open. AR-1 to AR-11 are kept and sharpened. AR-12 to AR-17 are new. Items marked "New" or "Changed" are the review's changes. Assumption: the exact colour values and the final audit result are not confirmed until the design tokens exist and the Accessibility audit task runs. Accessible authentication (WCAG 2.2 3.3.8) does not apply, because the site has no login. No automated tool proves full conformance, so the audit also needs a manual keyboard and screen reader pass.

- AR-1 Contrast. Normal text shall have a contrast ratio of at least 4.5:1, large text and interface parts at least 3:1, in both themes. Changed: interface parts include input borders, icons that carry meaning, the focus ring and the current-page marker. Placeholder text and disabled-looking text still meet 4.5:1 if it carries meaning. Checked by: axe, Lighthouse (home, post and tag pages only), manual checklist for token pairs.
- AR-2 Keyboard. Every function shall work with the keyboard alone, with no keyboard trap, including the theme switch, the newsletter form and the code copy button (and search once it exists). Changed: focus order follows reading order, and scrollable code blocks are reachable by keyboard (see AR-13). Checked by: Playwright keyboard test.
- AR-3 Focus. Focus shall always be visible with an outline of at least 3:1 contrast, and shall not be hidden by sticky headers (WCAG 2.2 focus not obscured). The 3:1 contrast comes from WCAG 1.4.11 (AA). Changed: the outline is at least 2 CSS px thick and sits against both the element and its background at 3:1, in both themes. The 2 px thickness is a project rule that goes beyond AA, because WCAG 2.4.13 Focus Appearance is AAA in WCAG 2.2. Anchor jumps use `scroll-margin-top` so a sticky header never covers the target. Checked by: Playwright keyboard test, manual checklist.
- AR-4 Alt text. Every image shall have alt text, enforced by `npm run check:content`, which fails on images without it. Decorative images shall use empty alt text. Checked by: axe, `npm run check:content`.
- AR-5 Dark mode contrast. Dark mode shall meet AR-1 on its own. Code highlighting colours shall meet 4.5:1 in both themes. Checked by: axe in both themes, manual checklist for code colours.
- AR-6 Reduced motion. The site shall respect `prefers-reduced-motion` and shall not animate when it is set. Changed: this includes smooth scrolling and the theme transition. Nothing flashes more than three times a second. Checked by: manual checklist with reduced motion set.
- AR-7 Skip link. Every page shall have a skip-to-content link as the first focusable item. Changed: it is visible when focused, links to `main` and moves focus there. Current code gap: `src/layouts/BaseLayout.astro` has none. Checked by: Playwright keyboard test.
- AR-8 Headings. Each page shall have one `h1`, and headings shall not skip levels. Changed: the site name is not an `h1` on inner pages. Post content starts at `h2`. A tag page uses the tag name as its `h1`. Checked by: axe, Lighthouse (home, post and tag pages only).
- AR-9 Targets and forms. Touch targets shall be at least 24 by 24 CSS px (WCAG 2.2 target size minimum), unless spacing or an inline link exception applies. Form fields shall have visible labels and errors shall be described in text. Changed: see AR-14 for the newsletter form. Checked by: axe (target size and labels), manual checklist.
- AR-10 Reflow and zoom. Pages shall reflow at 320 px wide and work at 200% zoom without loss of content. Changed: no two-direction scrolling except inside code blocks and tables (see AR-13), and text can be resized to 200% and spaced out (WCAG text spacing) without clipping. Checked by: Playwright 320 px reflow check, manual checklist for 200% zoom.
- AR-11 Language and landmarks. Pages shall set the `lang` attribute and use header, nav, main and footer landmarks. Changed: `lang="en"` is already set in `src/layouts/BaseLayout.astro`. Each `nav` has an accessible name, such as "Main" and "Breadcrumb", because a page has more than one. Checked by: axe.
- AR-12 Links and navigation (New). Link text shall make sense out of context, so no bare "read more" or "click here". Links are told apart from text by more than colour (an underline in body text). The current page is marked with `aria-current="page"`. The main navigation, the order of items and the footer links are the same on every page (WCAG consistent navigation). Navigation follows `docs/prd/content-pillars.md`. Checked by: axe (link names and `aria-current` use), Playwright keyboard test (same navigation on every page), manual checklist (consistent navigation, link text).
- AR-13 Code blocks and tables (New). A code block that scrolls sideways shall be focusable (`tabindex="0"`), have a role and an accessible name, and scroll with the arrow keys. Its focus outline meets AR-3. Syntax colours meet AR-5. The copy button has an accessible name and a polite status message on success. Tables have header cells and scroll in a container, not the page. Checked by: axe, Playwright keyboard test.
- AR-14 Newsletter form (New). The email field has a visible `label` tied to it with `for` and `id`, and `autocomplete="email"`. Placeholder text is not the label. A required field is marked in text. Errors are written in text next to the field, say what is wrong and how to fix it, and are tied to the field with `aria-describedby`. Colour is never the only cue. On submit the result (success or error) is announced in a live region. Focus moves to the first error. The consent text is a real label for its checkbox. Entering the email again is not required (WCAG redundant entry). The form works with the keyboard alone (AR-2). Checked by: axe (labels), Playwright keyboard test (live region text and focus move), manual checklist (screen reader).
- AR-15 Theme switch (New). The theme switch is a real button with an accessible name and a state (for example `aria-pressed`) that does not rely on an icon alone. The default follows the system setting. A saved choice is kept. Both themes meet AR-1 and AR-5. Checked by: Playwright keyboard test, manual checklist (axe cannot judge the state).
- AR-16 Content rules for authors (New). Every post has a meaningful alt text on informative images and empty alt on decorative ones (AR-4). Diagrams that carry meaning have a text description nearby. Headings in posts follow AR-8. Link text follows AR-12. Posts do not rely on colour, or on video or audio without a transcript or captions. The Technical Editor and `npm run check:content` check these where a tool can, and the rest by hand. Checked by: axe (images), manual checklist.
- AR-17 Pointer and dragging (New). Nothing needs a path-based gesture or dragging. Anything done on hover also works on focus, and hover content can be dismissed and stays visible while pointed at (WCAG content on hover or focus). Controls do not change context on focus alone. Checked by: Playwright keyboard test, manual checklist (axe cannot check this).

Test notes for a tester. Automated: axe scan on the home, post, archive, topics, tag, tags index, pillar, series, series index, About, privacy and 404 pages in both themes (NFR-8). Lighthouse covers only the home page, a post and a tag page (NFR-6). The 404 page is excluded from Lighthouse scores and is covered by axe (`docs/test-strategy.md`). Playwright runs the scripted keyboard checks (skip link to footer, focus, newsletter form) and the 320 px reflow check. Manual checklist, per page type: a screen reader pass on the navigation and the newsletter form, a check at 200% zoom, a check with reduced motion set, and a contrast check of the colour tokens.

## Traceability

| Requirement | PRD feature | Goals |
|---|---|---|
| FR-1 Posts and drafts | F1 | G1, G2 |
| FR-2 Tags | F2 | G2, G4 |
| FR-3 Series | F2 | G2, G4 |
| FR-4 RSS feed | F3 | G4 |
| FR-5 Search (post-launch, P2) | F4 | G4 |
| FR-6 Newsletter signup with double opt-in | F5 | G3 |
| FR-7 Code blocks with copy | F6 | G2 |
| FR-8 Dark mode | F7 | G4 |
| FR-9 Related posts | F8 | G4 |
| FR-10 SEO metadata | F9 | G1, G4 |
| FR-11 Privacy-respecting analytics | F11 | G3, G4 |
| FR-12 About page and basic site pages | F12 | G4 |
| FR-13 Main navigation and footer | F12 | G4 |
| FR-14 Posts archive | F12, F1 | G4 |
| FR-15 Topics and pillar pages | F2 | G2, G4 |
| FR-16 Series index and series pages | F2 | G2, G4 |
| FR-17 Tags index and tag pages | F2 | G2, G4 |
| No FR (F10 Performance and accessibility baseline): covered by NFR-1 to NFR-8 and AR-1 to AR-17 | F10 | G1 |
| NFR-4 | Charter KPI: 99.9%+ uptime | G1 |
| NFR-9, NFR-10, SR-1 to SR-18 | Threat model, F5, F11 | G1, G3 |
| AR-1 to AR-17 | F10, F7, F6 | G1, G4 |

## Open questions

Decision (Venkat, 20 Nov 2026): assumptions approved as written; JSON-LD author is the site; HSTS has no `preload` at launch. The HSTS header uses a one-year max-age. Preload is considered after a few stable months.

1. Newsletter provider (FR-6, ADR 0005): which one may we use? The retention periods are decided 20 Nov 2026 (assumptions approved as written).
2. Analytics (FR-11, ADR 0006): may we use the cookieless tool the ADR names, or should analytics wait until after launch?
3. Decided 20 Nov 2026: search (FR-5) is post-launch, with Pagefind after about 10 posts (ADR 0007).
4. Decided 20 Nov 2026: the planned series are approved as the starting plan, and the optional `series` and `seriesOrder` fields are approved (FR-3).
5. Decided 20 Nov 2026: the capacity target of 10,000 monthly readers (NFR-11) is approved as written.
6. Decided 20 Nov 2026: the browser support list (NFR-13) is approved as written.
7. Residual risks R01, R02, R03 and R12: which do you accept for launch, and which must close first (SR-13 to SR-15)?
8. Decided 20 Nov 2026: HSTS has no `preload` at launch (one-year max-age).
9. Open tools: may we select and cost an external uptime monitor (NFR-4), Google Search Console and a keyword tool? No ADR or cost estimate covers them yet.
10. Decided 20 Nov 2026: the content check rejects a missing `draft` field (FR-1). The schema default stays as it is.
11. Resolved 20 Nov 2026: the navigation routes from the UX review are added as FR-13 to FR-17.
