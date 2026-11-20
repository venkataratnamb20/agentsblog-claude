# SEO, analytics and KPI/KPM tracking spec

Status: draft, awaiting Venkat's approval. Owner: SEO & Analytics. Goals and measures come from `docs/prd/charter.md`. Pillars come from `docs/prd/content-pillars.md`.

This spec is tool-neutral. The analytics tool is chosen in ADR 0006 and is not decided here. No tracking is enabled by this spec. Anything that depends on a tool not yet approved is marked **(tool pending)**.

## Keyword map

All keywords are candidates to validate with a keyword tool (for example Search Console data after launch, or a paid tool if Venkat approves one). No search volumes are stated because none have been measured. Validation means checking volume, difficulty and the current top results before a post is briefed.

Intent labels: informational (learn a concept), tutorial (follow steps), comparison (choose between options), problem-solving (fix or avoid a failure).

### Architectures

| Item | Candidates |
|---|---|
| Primary | what is an ai agent; ai agent architecture |
| Secondary | agent loop; langgraph tutorial; deep agents; workflows vs agents |
| Search intent | Informational for definitions; tutorial for LangGraph; comparison for workflows vs agents |
| Planned posts | Post 1 What is an agent; Post 2 Anatomy of an agent; Post 5 LangGraph; Post 7 Deep agents |

### Tools and MCP

| Item | Candidates |
|---|---|
| Primary | model context protocol; llm tool calling |
| Secondary | mcp server tutorial; function calling agents; mcp security |
| Search intent | Informational for MCP and tool calling; tutorial for building a server; problem-solving for security |
| Planned posts | Post 3 Tool calling and MCP |

### Memory and RAG

| Item | Candidates |
|---|---|
| Primary | ai agent memory; rag for agents |
| Secondary | agent memory types; context window management; long-term memory llm |
| Search intent | Informational for memory types; problem-solving for context limits; comparison for retrieval choices |
| Planned posts | Post 4 Memory |

### Multi-agent

| Item | Candidates |
|---|---|
| Primary | multi-agent systems; multi-agent patterns |
| Secondary | agent orchestration; orchestrator worker pattern; multi-agent llm |
| Search intent | Informational and comparison: which pattern fits, and when one agent is enough |
| Planned posts | Post 6 Multi-agent patterns |

### Evals and safety

| Item | Candidates |
|---|---|
| Primary | ai agent evaluation; ai agent guardrails |
| Secondary | llm agent evals; prompt injection agents; agent observability |
| Search intent | Informational for evaluation methods; problem-solving for guardrails and injection |
| Planned posts | Post 8 Evaluation; Post 9 Guardrails; Post 10 Research roundup (may cover any pillar) |

### Keyword rules

- One primary keyword per post. Use it in the title, the description, the H1 and the first paragraph, where it reads naturally.
- Do not stuff keywords. The writer owns the copy. SEO & Analytics suggests changes to the writer and editor.
- Record the chosen primary keyword and the date it was validated in the research brief for the post.
- Review the keyword list after launch, using Search Console queries.

## URL and slug rules

Some of these rules describe the site today. Others are **New** requirements that nothing enforces yet.

What the site does today:

- Post URLs are `/posts/<slug>/`. In `src/pages/posts/[...slug].astro` the slug is the content entry id, which comes from the file name in `content/posts/`. `slugify()` is not applied to it, and no check enforces the slug format.
- The trailing slash comes from the page path, which the post page builds as `/posts/<id>/`. `canonicalUrl()` in `src/lib/seo.ts` does not add one. It returns an absolute URL with one slash join and the query string and hash removed.
- Dates are not in the URL. The date lives in front-matter and in the page.

New requirements:

- **New:** the slug equals `slugify(title)` from `src/lib/slugify.ts`. It lowercases, strips accents, turns every run of other characters into one hyphen and trims hyphens at the ends. A content check must enforce it (for example in `npm run check:content`).
- **New:** slugs use lowercase letters, digits and single hyphens only. No underscores, spaces or dates.
- **New:** short slugs, ideally under 60 characters, with the primary keyword in them. Drop filler words.
- **New:** a post that is not a roundup has 3 to 5 tags: the pillar tag first, one format tag and up to 3 topic tags. A roundup has 3 or 4 tags: the `research-roundup` format tag and up to 3 topic tags, with no pillar tag (`docs/prd/content-pillars.md`).
- **New:** a tag equals `slugify(tag)`. Tag pages are planned at `/tags/<tag>/`. The tag check is in PRD F2.
- **New:** every internal page path ends with a trailing slash, and a test checks it.
- Canonical URLs are stable. Once a post is published its slug does not change.

### Redirects policy

- Do not rename published slugs. If a rename is unavoidable, Venkat approves it first.
- A renamed or removed URL gets a permanent (301) redirect to the closest page, set up at the host or in Astro config. Redirect rules need the hosting decision in ADR 0004 **(tool pending)**.
- Keep redirects for the life of the site. Avoid chains: point the old URL straight at the final one.
- Update the sitemap, RSS links and internal links to the new URL in the same change.
- Draft posts are excluded from production builds, so they never need redirects.

## Metadata and schema.org

Items marked **Exists** are already provided by `src/lib/seo.ts`, `src/layouts/BaseLayout.astro` or the pages. Items marked **New** are to build.

### Limits

- Title: 70 characters or fewer, from `postSchema` (`title.max(70)`). Exists.
- Description: 160 characters or fewer, from `postSchema` (`description.max(160)`). Exists.
- The page title is `<title> | Agents Blog` from `pageTitle()`, so the rendered title is longer than the front-matter title. Aim for a front-matter title near 50 characters so the full title does not truncate in results. New guidance.
- Each post has a unique title and description. Check for duplicates in `npm run check:content`. New.

### Tags and cards

| Item | Status | Notes |
|---|---|---|
| `<title>` from `pageTitle()` | Exists | |
| `meta description` | Exists | From front-matter |
| `link rel="canonical"` from `canonicalUrl()` | Exists | One canonical per page |
| `meta robots` from `robotsMeta()` | Exists | `index, follow` only when `ALLOW_INDEXING=true`, else `noindex, nofollow` |
| Open Graph: `og:title`, `og:description`, `og:type`, `og:url`, `og:site_name` | Exists | `og:type` is `article` for posts |
| `twitter:card` | Exists | Currently `summary` |
| `og:image` and `twitter:image` with alt text | New | Needs a default image and a per-post image. Every image needs alt text |
| `twitter:card` set to `summary_large_image` when an image exists | New | |
| `article:published_time`, `article:modified_time`, `article:tag` | New | From `date`, `updated`, `tags` |
| `og:locale` | New | `en_GB` |
| RSS autodiscovery `link rel="alternate"` | Exists | Points at `/rss.xml` |

### BlogPosting JSON-LD

`articleJsonLd()` in `src/lib/seo.ts` emits an `Article` today. Change the type to `BlogPosting`, which is the more specific type for blog posts. This is a **New** change to `src/lib/seo.ts`, owned by the Frontend Engineer and test-first.

| Field | Status | Source |
|---|---|---|
| `@context`, `@type` | Exists as `Article`; change to `BlogPosting` | |
| `headline` | Exists | `title` |
| `description` | Exists | `description` |
| `datePublished` | Exists | `date` |
| `dateModified` | Exists | `updated`, else `date` |
| `mainEntityOfPage` | Exists | Canonical URL |
| `author` | Exists as an `Organization` | Decision for Venkat: keep the site as author, or name a person |
| `publisher` with `logo` | New | Site name and logo |
| `image` | New | Same image as `og:image` |
| `keywords` | New | From `tags` |
| `inLanguage` | New | `en-GB` |
| `isPartOf` (series) | New | Only when the series field exists (PRD F2) |

`breadcrumbJsonLd()` already emits `BreadcrumbList`. Exists. Extend it for tag and series pages when they exist.

Check JSON-LD with a schema validator before launch. The output must match the visible page content.

### Sitemap, robots and RSS

- Sitemap: `@astrojs/sitemap` is enabled in `astro.config.mjs` and writes `/sitemap-index.xml`. Exists. New: confirm drafts and noindex pages are absent, and that URLs use the production domain from `SITE_URL`.
- Robots: `src/pages/robots.txt.ts` uses `robotsTxt()`. Staging disallows everything. Production allows all and links the sitemap. Exists.
- RSS: `src/pages/rss.xml.ts` lists visible posts, newest first, with title, description, date and link. Exists. New: add `categories` from tags and a `lastBuildDate`, and set the feed's absolute `link` values from the canonical helper.
- Submit the sitemap to Search Console after launch. This needs Venkat's access approval.
- Staging is `noindex` unless `ALLOW_INDEXING=true`. Only the production deploy sets it.

## Event tracking plan

Every KPI and KPM in the charter has a data source and an event or report. Tools marked **(tool pending)** are not approved. The analytics tool is the one chosen in ADR 0006 and is written below as "analytics tool".

| KPI or KPM | Goal | Data source | Event or report | Cadence | Owner | Tool fit |
|---|---|---|---|---|---|---|
| Launch on 14 Dec | G1 | Asana, `progress/` mirror | M5 gate task status report | Weekly until launch | PM Orchestrator | No analytics tool needed |
| 10/10 quality gates passed | G1 | Asana | Completion report for the ten stage 4 tasks: production readiness review, cross-browser, automated tests, SEO audit, security checklist, privacy and compliance, accessibility, code review, caching and CDN, performance. The count is tied to M4 | Weekly | PM Orchestrator | No analytics tool needed |
| Uptime 99.9%+ through hypercare (to 23 Dec) | G1 | Uptime monitor **(tool pending)** | Uptime percentage over the hypercare window, 14 to 23 Dec 2026 only, plus downtime alerts. Monthly reports start after hypercare | Continuous alerts; weekly report | DevOps Engineer | No analytics tool needed |
| Gate tasks on schedule (%) | G1 | Asana | Tasks done by due date over tasks due | Weekly | PM Orchestrator | No analytics tool needed |
| Open Sev 1/2 defects = 0 | G1 | GitHub issues | Open issues labelled `sev1` or `sev2` | Weekly | QA Engineer | No analytics tool needed |
| Lighthouse Perf 90+, Accessibility 95+, SEO 100 | G1 | CI Lighthouse run **(tool pending)** | `lighthouse-ci` scores per key page, on every PR and weekly on production. Measured on a production-like build with `ALLOW_INDEXING=true`, excluding the 404 page | Per PR; weekly | Performance Engineer | No analytics tool needed |
| Critical and high vulnerabilities = 0 | G1 | `npm audit` in CI | Audit report in the build | Per PR; weekly | Security Engineer | No analytics tool needed |
| CI pass rate 95%+ | G1 | GitHub Actions | Passed runs over total runs on `develop` | Weekly | DevOps Engineer | No analytics tool needed |
| 10 posts live | G2 | Git history and the production sitemap | Count of published posts (`draft: false`) | Weekly | Technical Writer | No analytics tool needed |
| 80%+ pass the content QA checklist first time | G2 | Asana, editor review comments | First-pass `REVIEW: APPROVED` over total post reviews | Monthly | Technical Editor | No analytics tool needed |
| Weekly cadence hit rate 90%+ | G2 | Asana, git history | Weeks with a post published over weeks elapsed | Weekly | Technical Writer | No analytics tool needed |
| Draft-to-publish cycle, 5 days or less | G2 | Asana, git history | Days from first draft commit to publish date, per post | Per post; weekly summary | Technical Writer | No analytics tool needed |
| 10+ research sources reviewed per week | G2 | `research/sources/` | New or updated source notes per week | Weekly | Research Analyst | No analytics tool needed |
| 2+ posts drafted ahead | G2 | `content/posts/` | Count of posts with `draft: true` and a ready status | Weekly | Technical Writer | No analytics tool needed |
| Confirmed subscribers (100 by 26 Feb) | G3 | Newsletter provider (ADR 0005) | Confirmed (double opt-in) subscriber count | Weekly | Growth & Community | No analytics tool needed |
| Visitor-to-subscriber conversion 2%+ | G3 | Analytics tool **(tool pending)** and newsletter provider | Provider confirmed subscribers divided by page-view visitors. No site-side event, because confirmation happens at the provider | Weekly | SEO & Analytics | Works with Cloudflare Web Analytics (page views plus provider report) |
| Open rate 40%+ | G3 | Newsletter provider (ADR 0005) | Campaign report, open rate per send | Per send; weekly | Growth & Community | No analytics tool needed |
| Click rate 5%+ | G3 | Newsletter provider (ADR 0005) | Campaign report, click rate per send | Per send; weekly | Growth & Community | No analytics tool needed |
| Unsubscribes under 1% per send | G3 | Newsletter provider (ADR 0005) | Campaign report, unsubscribes over recipients | Per send | Growth & Community | No analytics tool needed |
| Unique visitors (1,000 in Feb) | G4 | Analytics tool **(tool pending)** | Monthly unique visitors report | Weekly view; monthly total | SEO & Analytics | Works with Cloudflare Web Analytics (visits and page views; unique counts are the tool's estimate) |
| Returning readers 25%+ | G4 | Analytics tool **(tool pending)** | Returning over total unique visitors | Monthly | SEO & Analytics | Needs events tool (cookieless page-view tools do not report returning readers) |
| Average engaged time 3+ min | G4 | Analytics tool **(tool pending)** | Average engaged time as the tool chosen in ADR 0006 reports it. The definition is recorded once the tool is approved. Event `read_complete` is a separate completion signal, not engaged time | Monthly | SEO & Analytics | Needs events tool (not reported by Cloudflare Web Analytics) |
| 5+ backlinks by Mar | G4 | Search Console links report; manual outreach log | Count of referring domains | Monthly | SEO & Analytics | No analytics tool needed |
| Organic search clicks per week (baseline in Dec, then rising) | G4 | Search Console | Performance report, clicks from Google search | Weekly | SEO & Analytics | No analytics tool needed |
| Social impressions per post, +10% month on month | G4 | LinkedIn and X native analytics | Impressions per post, exported by hand | Weekly; monthly comparison | Growth & Community | No analytics tool needed |
| Each post shared in 2+ communities | G4 | Distribution log in Asana | Share count per post, with links | Per post | Growth & Community | No analytics tool needed |
| 100% of posts indexed | G4 | Search Console | Page indexing report: indexed pages over published posts | Weekly | SEO & Analytics | No analytics tool needed |

Caveat for rows marked tool pending: values and definitions depend on the tool in ADR 0006. In particular, `read_complete` (the reader scrolls past the end of a post) shows who finished a post. It does not measure time spent, so it must not be reported as engaged time.

The Tool fit column shows what each row needs. ADR 0006 recommends Cloudflare Web Analytics, which has page views but no custom events. Rows marked "Needs events tool" need a tool with events (Plausible, the ADR 0006 upgrade) or are replaced by page views and the newsletter provider's reports. Search-related KPMs (organic clicks, pages indexed, backlinks) come from Search Console and start after launch. There is no on-site search at launch (ADR 0007).

Custom events below need an events tool. With Cloudflare Web Analytics only, drop them and use page views and provider reports. The names are tool-neutral and apply to whichever events tool is approved:

| Event | When it fires | Properties |
|---|---|---|
| `newsletter_signup_started` | The reader submits the form. Confirmation is not a site event, because it happens at the provider | `placement` (header, post footer, page) |
| `read_complete` | The reader scrolls past the end of a post | `post_slug` |
| `outbound_click` | The reader clicks an external link | `target_domain` only |
| `rss_click` | The reader clicks the RSS link | none |

### Privacy

- Cookieless analytics is preferred. Cookies would need PECR consent first (threat R09).
- No tracking before consent. If the chosen tool sets cookies or stores identifiers on the device, a consent banner blocks it until the reader accepts.
- No analytics is enabled until Venkat approves the tool and a privacy check passes.
- Any analytics tool needs its origin added to the Content Security Policy, and Venkat's approval first.
- No personal data in event names, event properties or URLs. Never send email addresses, names or IP addresses as properties. Use `post_slug` and `target_domain`, not full URLs with query strings.
- Strip query strings and hashes from tracked URLs, as `canonicalUrl()` does.
- Newsletter data stays in the newsletter provider, under the consent record and unsubscribe rules in threat R08. Analytics never sees an address. Confirmed subscribers are counted at the provider.
- Verify with a clean browser profile: no cookie and no analytics request before consent.
- Exclude staging and local builds from analytics by loading the script only in the production build (the same `ALLOW_INDEXING=true` switch). New.
- Excluding Venkat and agents depends on the tool **(tool pending)**. A cookieless tool cannot recognise a person, so the options are a tool filter by IP address or a browser opt-out flag, and these must be checked against the privacy rules above. Until then, internal traffic is a known small distortion to note in reports.

## Reporting

### Weekly KPM dashboard

- Day: Monday, covering the previous seven days. Built from the sources in the tracking plan.
- Contents: every weekly KPM with its value, its target and a red, amber or green status.
- Until the tools are approved, fill the dashboard by hand from Asana, GitHub, Search Console and the newsletter provider. Mark missing values as "tool pending", not zero.
- Store the dashboard as a short Asana comment on the weekly reporting task, and mirror it in `progress/`.
- Any red KPM gets a named owner and a next action.

### Monthly review

- Day: first working week of the month. Covers the KPIs for each goal, the trend over the month and the top and bottom posts by organic clicks and engaged time.
- January 2027 metrics review: recalibrate targets, as the charter says. Baselines for organic clicks and visitors come from the December data.
- February 2027 review: report G3 (100 subscribers by 26 Feb) and G4 (1,000 unique visitors in February).
- Output: a short report with findings and proposed changes to keywords, topics or targets. Changes to targets or acceptance criteria go to Venkat as a comment, for his decision.
- Review the keyword map each month against Search Console queries and update candidates.

## Open items for Venkat

- Approve the analytics tool and the uptime monitor (ADR 0006, ADR 0004). Until then nothing here is enabled.
- Decide the JSON-LD author: the site as an organisation, or a named person.
- Approve Search Console access for the production domain.
- Approve a keyword tool, or agree to rely on Search Console data after launch.
