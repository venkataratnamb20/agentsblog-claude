# Test strategy, quality gates and review standards

How the Agents Blog is tested, which gates the work must pass, and how code is reviewed. Targets come from the charter (`docs/prd/charter.md`) and ADR-001. Numeric code limits stay in `docs/guidelines/code-quality.md`.

## Test pyramid

Most tests are small and fast. The higher the layer, the fewer tests and the slower they run.

| Kind | What it covers | How many | Where files live | When it runs |
|---|---|---|---|---|
| Unit (Vitest) | Pure logic in `src/lib/` and the spec and content checks | Many; every function and branch in `src/lib/` | `tests/unit/`, `tests/content/` | Every PR (`npm run coverage` in CI) |
| Integration | Pieces together: content collection to pages, feed, sitemap and robots output from a real build | Few dozen; one per build output or data flow | `tests/integration/` | Every PR, after the build step |
| E2E (Playwright) | User journeys in a browser: read a post, follow a tag, subscribe, draft is not reachable | About 10 journeys at launch (a planning figure), written as Gherkin in `tests/features/` once Cucumber is confirmed | `tests/e2e/`, `tests/features/` (folders exist; no tests yet) | Once installed: smoke journeys on every PR; the full set nightly |
| Visual regression | Screenshots of the home page, a post, a tag page and the 404 page at two viewport widths | One baseline per page type and width | `tests/e2e/visual/` (proposed, created by the stage 4 test suite task) | Once installed: nightly and on PRs that change styles or layouts |
| Accessibility (axe) | Automated WCAG checks on every page type, plus keyboard and alt text checks | One scan per page type | `tests/e2e/a11y/` (proposed, created by the stage 4 test suite task) | Once installed: every PR on the built site |
| Performance (Lighthouse CI) | Core Web Vitals and budgets on the home page, a post page and a tag page of a production-like build with `ALLOW_INDEXING=true` (the 404 page is excluded, see Gates) | Three runs per page type, median used | Config at the repo root (proposed, created by the stage 4 test suite task); results in CI artifacts | Once installed: every PR on a preview build; nightly on staging |
| Security | Dependency audit, secret scan, security headers, threat model checks | One check per control | `scripts/`, CI steps, `tests/integration/` | Audit and secret scan on every PR; headers check nightly on staging |

Rules for every layer:

- Test first. Show the failing run, then green (see TDD in `docs/guidelines/code-quality.md`).
- A threshold counts as enforced only after a deliberate violation has failed locally.
- A flaky test is a defect. Fix or remove it within the sprint; do not retry it into green.

## Tools

| Need | Tool | Why | Status |
|---|---|---|---|
| Unit and content tests, coverage | Vitest | Already in use; fast; thresholds are enforced in `vitest.config.ts` | Installed |
| Lint, format, types | ESLint, Prettier, `astro check` | Already in CI | Installed |
| Dependency audit | `npm audit --audit-level=high` through `node scripts/task.mjs audit` | CI fails on high and critical findings, matching the gates of 0 critical and 0 high | Installed |
| Secret scan | `scripts/scan-secrets.mjs` | Runs in CI and as a hook | Installed |
| E2E and visual regression | Playwright | One tool for browser journeys and screenshot comparison; runs on Windows, macOS and Linux; named in ADR-001 | Not installed. The stage 4 test suite task installs it |
| Performance and SEO budgets | Lighthouse CI | Asserts the Lighthouse category scores and Core Web Vitals budgets in CI and keeps the reports | Not installed. The stage 4 test suite task installs it |
| Accessibility | axe (`@axe-core/playwright`) | Standard rule engine; runs inside the Playwright journeys | Not installed. The stage 4 test suite task installs it |
| BDD | Cucumber | Gherkin files for journeys | Not installed; ADR-001 lists it as still to confirm. Decided in the stage 4 test suite task |

Notes:

- Until these tools exist, the pyramid rows for E2E, visual, accessibility and performance are a plan. Do not claim a gate that needs them as met. M3 needs none of them. M4 and M5 do.
- Check each tool against its official documentation before adopting it.
- `astro check` and `astro build` can be blocked by Windows Application Control on some machines. CI on Linux is the reference result.

## Test environments and data

| Environment | Purpose | Data | Indexing |
|---|---|---|---|
| Local | Development and TDD; `make test`, `make build`, `make preview` | Fixtures only; drafts visible with `PREVIEW_DRAFTS=true` | Not indexed |
| Preview (per PR build, access-controlled) | E2E, accessibility and Lighthouse runs against a built site; posts 1 to 3 are reviewed here | Fixtures; drafts visible only here and locally, with `PREVIEW_DRAFTS=true` | `noindex` |
| Staging (`develop`) | M3 and M4 checks, nightly runs | Fixtures and published posts only; drafts are excluded | `noindex` unless `ALLOW_INDEXING=true` |
| Production (`main`) | The live site | Published posts only; drafts excluded | Indexed |

Test data:

- Keep fixtures in `tests/fixtures/` (proposed, created by the stage 4 test suite task; it does not exist yet). Build them from small factory functions, not large copied files.
- Post fixtures cover: a published post, a draft (`draft: true`), a post with several tags, a post in a series, a post at the title limit (70 characters) and the description limit (160), and a post with an image that has alt text.
- Add negative fixtures that must fail `npm run check:content`: a title over 70 characters, a description over 160, an image without alt text, a post with no explicit `draft` field, a tag not on the approved list, a duplicate title and a `javascript:` link.
- Today only the alt-text check exists. The other rejections are required stage 3 or stage 4 work. Each starts with a failing test.
- Never use real subscriber data. Use made-up addresses on a reserved domain such as `example.com`. Use the newsletter provider's test mode only after Venkat approves the account.
- Never put secrets in fixtures. The secret scan runs on them too.

## Gates

Dates and the Lighthouse category scores come from the charter. The LCP, INP and CLS values come from the SRS task text, not the charter. A gate is passed only when every Exit item has evidence on the Asana task (a link or command output). Entry items must be true before the gate checks start.

Every gate also needs the Definition of Done items from `CLAUDE.md`. They are listed once here and repeated as the last Exit item of each gate:

- A named reviewer (not the session that did the work) comments `REVIEW: APPROVED`, or Venkat waives the review in writing.
- Every PR behind the gate links its Asana task.
- Any `[Venkat]` subtask on the gate task is complete.

### M3: Feature-complete on staging (4 Dec 2026)

- Entry: M2 (design approved, 1 Dec) is complete. All planned features are merged into `develop` through PRs. Staging builds from `develop` and is `noindex`.
- Exit:
  - CI is green on `develop`: lint with zero warnings, format check, typecheck, tests, build.
  - Coverage is 100% on `src/lib/` and at least 80% overall.
  - Every launch acceptance criterion in the SRS has at least one test or a recorded manual check. Post-launch items are excluded. There is no search at launch (ADR 0007), so there is no search E2E at M3, M4 or M5.
  - Open Sev 1 and Sev 2 defects: 0. Sev 3 and Sev 4 defects are listed with owners.
  - Dependency audit shows 0 critical and 0 high vulnerabilities.
  - Staging builds and serves the pages; the integration checks on the built output pass (drafts excluded, `noindex`, sitemap, feed). Browser journeys wait for M4, because Playwright is installed after M3.
  - The Definition of Done items above: reviewer `REVIEW: APPROVED`, PRs link their Asana tasks, any `[Venkat]` subtask complete.

### M4: Quality gates passed, go for launch (9 Dec 2026)

- Entry: M3 is complete. The test suite from the stage 4 task is installed (Playwright, Lighthouse CI, axe). Posts 1 to 3 are reviewed in an access-controlled preview. Venkat approves `draft: false` for them before M5. The stage 4 test suite has ten tasks, which are the charter's 10/10 quality gates. The `check:content` rules listed under test data are in place.
- Exit:
  - Lighthouse Performance 90 or more, Accessibility 95 or more, SEO 100, on the home page, a post page and a tag page of a production-like build with `ALLOW_INDEXING=true`, median of three runs. The 404 page is excluded from the SEO score, and noindex staging and previews cannot score SEO 100.
  - All ten stage 4 quality gate tasks are done (the charter's 10/10).
  - Largest Contentful Paint under 2.5 s and Cumulative Layout Shift under 0.1.
  - Interaction to Next Paint (INP) is a field metric at the 75th percentile (SRS NFR-2), so it cannot be measured before launch. The gate uses a proxy: Lighthouse total blocking time under 200 ms, and scripted interactions under 200 ms in a Playwright trace.
  - axe reports 0 serious or critical violations on all page types, including the 404 page. Keyboard navigation and alt text checks pass.
  - Critical and high vulnerabilities: 0. Secret scan clean. Security review by the Security Engineer is approved.
  - Coverage is 100% on `src/lib/` and at least 80% overall.
  - Open Sev 1 and Sev 2 defects: 0.
  - Full E2E set, including the smoke journeys on staging, and visual regression pass, with no unreviewed screenshot changes.
  - `npm run check:content` passes for posts 1 to 3.
  - Reviews approved with `REVIEW: APPROVED` from the QA Engineer (test results), the Security Engineer (security review), the SEO & Analytics role (`seo-audit` on the posts) and the Code Reviewer (code). PRs link their Asana tasks. Every `[Venkat]` subtask, including the go decision for launch, is complete.

### M5: Production launch with posts 1 to 3 (14 Dec 2026)

- Entry: M4 is complete and Venkat's go is recorded on the task. Production deploy, domain and DNS steps have their own approval from Venkat (see `docs/guidelines/approval-gates.md`). Venkat has approved `draft: false` for posts 1 to 3.
- Exit:
  - The production build excludes drafts and is indexable (no `noindex`, `robots.txt` allows crawling, sitemap and feed present).
  - Smoke E2E journeys pass against the production URL.
  - Lighthouse run on production meets the M4 numbers: Performance 90 or more, Accessibility 95 or more, SEO 100, LCP under 2.5 s, CLS under 0.1. There is no field data yet, so the INP proxy from M4 applies (total blocking time under 200 ms and scripted interactions under 200 ms). Field INP under 200 ms at the 75th percentile is checked after launch, in stage 9 or hypercare.
  - Open Sev 1 and Sev 2 defects: 0. Critical and high vulnerabilities: 0.
  - A rollback has been rehearsed and the steps are in the runbook.
  - Hypercare checks start; uptime target is 99.9% or more to 23 Dec (M6).
  - The Definition of Done items above: a named reviewer comments `REVIEW: APPROVED`, PRs link their Asana tasks, and every `[Venkat]` subtask (go, deploy, DNS, publishing) is complete.

## Code review checklist

The checklist is in `docs/guidelines/code-quality.md` (section "Review checklist"). `.github/pull_request_template.md` mirrors it, and a test checks that they match. Do not copy the items here; change the guide and the template together.

How reviewers are used:

- Reviews are done by the reviewer subagent named on the task (for code, the `code-reviewer` through the `review-pr` skill; for security, the `security-engineer` through `security-check`). Reviewer subagents are read-only.
- The reviewer is never the session that did the work.
- The reviewer comments `REVIEW: APPROVED` or `REVIEW: CHANGES REQUESTED: <list>` on the Asana task.
- Evidence is a link, not a description: commit hash, PR URL, command output, file path or screenshot. A claim without evidence counts as not done (`docs/guidelines/operating-model.md`).
- A product defect found in review goes to the owning role as a defect report. The reviewer does not change product code.
- Only Venkat may waive a review. The waiver counts only when his words are quoted on the Asana task.

## Defect severity

| Severity | Meaning | Example | Response |
|---|---|---|---|
| Sev 1 | Site down, data exposed, or a secret leaked; no workaround | Production returns errors; a draft is published by mistake | Stop other work and fix now; blocks every gate |
| Sev 2 | A major feature is broken or a budget is missed; a workaround is hard | Subscribe form fails; Lighthouse Performance under 90 | Fix before the next gate; blocks M3, M4 and M5 |
| Sev 3 | A minor feature is broken and a workaround exists | One tag page sorts wrongly | Schedule in the current sprint |
| Sev 4 | Cosmetic or low impact | A spacing glitch; a typo in a label | Fix when convenient |
