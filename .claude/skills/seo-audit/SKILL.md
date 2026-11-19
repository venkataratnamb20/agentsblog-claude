---
name: seo-audit
description: Use when checking search readiness of the built site or a post: metadata, structured data, robots, sitemap, RSS and performance targets.
---

# seo-audit

## Steps
1. Build with drafts visible: `PREVIEW_DRAFTS=true npm run build`.
2. Per page in `dist/`: one `<h1>`, title, meta description of 160 characters or fewer, `rel=canonical`, Open Graph tags.
3. Posts: Article and BreadcrumbList JSON-LD present.
4. Staging build: `noindex` on pages and `Disallow: /` in `robots.txt`; production build only with `ALLOW_INDEXING=true`.
5. `sitemap-index.xml` and `rss.xml` exist and list only published posts.
6. Images have alt text; internal links resolve.
7. Run Lighthouse where available (targets: Performance 90+, Accessibility 95+, SEO 100); validate structured data with Google Rich Results Test and the schema.org validator (manual).

## Done when
- A report shows pass or fail per check with evidence.
- Defects are filed against the owning role.
