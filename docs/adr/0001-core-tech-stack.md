# ADR 0001: Core tech stack

- **Status:** Proposed; Venkat chose Astro + TypeScript in chat on 2026-11-19. Formal approval is the Asana subtask "[Venkat] Approve ADR-001".
- **Asana task:** ADR-001: Core tech stack (gid 1220695311583149). Hosting, CDN, newsletter, analytics and search are a separate task (gid 1220692569579020).
- **Deciders:** Venkat (approver), Solution Architect Agent. Reviewers: DevOps & SRE Agent, Code Reviewer Agent.

## Context
A content-led blog on AI agents: weekly posts with diagrams and runnable code, strong SEO, Core Web Vitals (Lighthouse Perf 90+, A11y 95+, SEO 100), low running cost, Markdown/MDX authoring by agents, and a testable codebase (TDD, strict types) that every agent can run on Windows, macOS and Linux.

## Options considered
| Option | Pros | Cons |
|---|---|---|
| **Astro + TypeScript** | Typed content collections; near-zero JS by default; first-class MDX, RSS, sitemap; static output, cheap to host | Smaller ecosystem than Next.js; interactivity needs islands |
| Next.js + TypeScript | Huge ecosystem; flexible rendering | Heavier JS by default; more config and hosting coupling for a content site |
| Hugo | Very fast builds | Go templating, weaker TypeScript and component story |

## Decision
| Concern | Choice | Version / note |
|---|---|---|
| Language | TypeScript (strict, `astro/tsconfigs/strictest`) | 5.9.x |
| Site framework | Astro with MDX, sitemap, RSS; static output | Astro 7.4.x (see version note) |
| Runtime | Node.js | 22 LTS in CI; 26 on the primary dev machine |
| Package manager | npm (lockfile committed, `npm ci` in CI) | ships with Node |
| Unit / integration tests | Vitest + `@vitest/coverage-v8` | 100% on `src/lib/`, 80% CI floor |
| E2E tests | Playwright | planned; not installed yet (see Windows status) |
| BDD | `@cucumber/cucumber` with Gherkin features in `tests/features/` | planned; not installed yet |
| Linter | ESLint (flat config, `typescript-eslint`, `eslint-plugin-astro`) | zero warnings; `complexity` ≤ 10, `max-lines-per-function` ≤ 40 |
| Formatter | Prettier (+ `prettier-plugin-astro`) | |
| Type checker | `astro check` (wraps `tsc`) | runs in CI |
| Scripts | Node (`scripts/*.mjs`) | no Python required |

## Version note (2026-11-19)
**Update 20 Nov 2026 (Venkat approved):** upgraded to Astro 7.4.x with `@astrojs/mdx` 8, because `npm audit` reported 1 critical and 3 high advisories in the Astro 5 line and the fix is only in 7. The deployment target is a Linux server, so cross-platform builds are not required. `astro check` and `astro build` still cannot run on the Windows dev machine (Application Control blocks the native modules); CI on Linux is the reference result. The `audit` step in CI now fails the build on high severity.

Earlier note, kept for history: Astro was pinned to the 5 line. Astro 7 needs native `.node` compiler binaries that Windows Application Control blocks on the primary dev machine; Rollup's native binary is blocked there too, so `astro check` and `astro build` cannot run locally on that machine. They pass in CI on Linux (PR #2, run #1). Vitest, ESLint and Prettier are pure JavaScript and run on Windows. Revisit the pin if the policy is relaxed or builds move to WSL/Docker.

## Windows, macOS and Linux status (for the DevOps & SRE confirmation)
| Tool | Linux (CI) | Windows | macOS |
|---|---|---|---|
| Vitest, ESLint, Prettier | verified | verified (dev machine) | not tested; pure JS |
| `astro check`, `astro build` | verified (PR #2 CI) | **blocked by Application Control** on dev machine | not tested |
| Playwright, Cucumber | not installed | not installed | not installed; to confirm against official docs before adoption |

## Consequences
- Pure logic (slugs, reading time, post sorting, SEO metadata) lives in `src/lib/` and is unit-tested first; pages and components stay thin.
- Posts live in `content/posts/`, validated by a Zod schema.
- `make` / `make.ps1` targets map to npm scripts.
- Hosting/CDN, newsletter, analytics and search remain open (separate ADRs; paid services need Venkat's approval).
- Revisit if a feature needs heavy client-side interactivity.
