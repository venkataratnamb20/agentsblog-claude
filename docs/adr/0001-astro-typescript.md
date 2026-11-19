# ADR 0001: Platform — Astro + TypeScript

- **Status:** Accepted by Venkat on 2026-11-19 (chat). Hosting, newsletter, analytics and search ADRs are still to come.
- **Asana task:** Select tech stack, hosting & services (ADRs), gid 1220692569579020
- **Deciders:** Venkat (approver), Solution Architect Agent

## Context
A content-led blog on AI agents: weekly posts with diagrams and runnable code, strong SEO, Core Web Vitals (Lighthouse Perf 90+, A11y 95+, SEO 100), low running cost, Markdown/MDX authoring by agents, and an agent-friendly, testable codebase (TDD, strict types).

## Options considered
| Option | Pros | Cons |
|---|---|---|
| **Astro + TypeScript** | Content collections with typed frontmatter; ships near-zero JS by default; first-class MDX, RSS, sitemap; static output, cheap to host | Smaller ecosystem than Next.js; interactive features need islands |
| Next.js + TypeScript | Huge ecosystem; flexible rendering | Heavier JS by default; more config and hosting coupling for a content site |
| Hugo | Very fast builds | Go templating, weaker TypeScript and component story |

## Decision
Use **Astro** with **TypeScript (strict)** and **MDX** content collections. Unit tests with **Vitest** (TDD, red → green → refactor). Static output (`astro build`).

## Version note (2026-11-19)
Pinned to the Astro 5 line (5.18.x, TypeScript 5.9). Astro 7 requires native `.node` compiler binaries that Windows Application Control blocks on the primary dev machine. Rollup's native binary is blocked there as well, so `astro build` and `astro check` could not be run locally; Vitest unit tests do run. Build and typecheck are meant to be verified in CI (Linux); this is not yet confirmed because GitHub Actions had not run on the repo when this was written. Revisit the pin if the policy is relaxed or builds move to WSL/Docker.

## Consequences
- Pure logic (slugs, reading time, post sorting, SEO metadata) lives in `src/lib/` and is unit-tested first; pages and components stay thin.
- Posts live in `content/posts/` and are validated by a Zod schema.
- Make targets map to npm scripts (`lint`/`typecheck` via `astro check`, `test` via Vitest, `build` via `astro build`).
- Hosting/CDN, newsletter provider, analytics and search remain open (separate ADRs; paid services need Venkat's approval).
- Revisit if a feature needs heavy client-side interactivity.
