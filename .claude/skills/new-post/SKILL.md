---
name: new-post
description: Use when creating a new blog post from topic to draft: brief, draft, technical edit, SEO check and PR, stopping before publication.
---

# new-post

## Steps
1. Confirm a research brief exists in `research/` for the topic; if not, use the `research-analyst` subagent first.
2. Create `content/posts/<slug>.md` from `.claude/skills/new-post/post-template.md`, with front-matter: `title` (70 characters or fewer), `description` (160 or fewer), `date`, `tags`, and `draft: true`.
3. Draft with the `technical-writer` subagent: diagrams, runnable code, alt text on every image.
4. Edit with the `technical-editor` subagent: check every fact against the brief's sources, run every code sample, apply the content QA checklist.
5. Check SEO basics with the `seo-analytics` subagent: title, description, headings, internal links.
6. Run `npm run check:content` and `npm run build`; fix any failure.
7. Open a PR titled `docs(content): add post <slug>` linking the Asana task, and comment READY FOR REVIEW.
8. Stop. Venkat approves publication; only then is `draft` set to false in a separate commit.
9. Hand distribution drafts to `growth-community`; posting needs Venkat.

## Done when
- The post file validates and `npm run check:content` and `npm run build` pass.
- The editor's QA comment lists each check.
- The PR is open, `draft` is still true, and the approval request is with Venkat.
