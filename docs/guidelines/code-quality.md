# Code quality

How code is written and reviewed on this project. `CLAUDE.md` holds the short summary and links here; the numbers below are the source of truth.

## Clean Code and SOLID

| Principle | Do | Don't |
|---|---|---|
| Names | Name things for what they mean (`readingTime`, `sortPostsByDateDesc`) | `calc2`, `data`, `tmp` |
| Single responsibility | `slugify` only slugifies; titles are built in `seo.ts` | One function that slugifies, validates and writes files |
| Open for extension | Add a pattern to the `PATTERNS` list in `.claude/hooks/lib/secrets.mjs` | Edit the matching loop for every new token type |
| Liskov | A function that takes `DatedPost` works for any post-like object | Sub-types that throw when `date` is read |
| Interface segregation | `DraftAware` needs only `data.draft` | One giant `Post` type passed everywhere |
| Dependency inversion | `src/lib` functions take data in; the page reads the collection and passes it | `src/lib` code that calls `getCollection` itself |

Also: return early instead of nesting, keep I/O out of pure helpers, and extract a block the second time it is copied.

## TDD workflow

1. Write one failing test that states the behaviour, run it, and keep the red output.
2. Write the smallest code that makes it pass.
3. Refactor with the tests green, then repeat.
4. A bug fix starts with a test that fails because of the bug.
5. A threshold counts as enforced only after a deliberate violation has been shown failing (paste the output in the PR).

## BDD

User journeys get a Gherkin file in `tests/features/` once the BDD runner is installed (Cucumber is not installed yet; ADR-001 lists it as still to confirm). Example:

```gherkin
Feature: Draft posts stay private
  Scenario: A draft is excluded from a production build
    Given a post with "draft: true"
    When the production site is built
    Then the post has no page, no sitemap entry and no feed item
```

## Data structures and algorithms

- Choose by access pattern: arrays for ordered scans, `Map` or `Set` for lookups and membership, and sorted copies (never in-place sorts) for ordering.
- State the time complexity of hot paths in the doc comment (for example `sortPostsByDateDesc` is O(n log n)).
- Do not optimise without a measurement; the Core Web Vitals budgets decide what is hot.

## Language standards

- TypeScript: `strict` on (inherited from `astro/tsconfigs/strictest`), no `any` (ESLint), explicit return types on exported functions (a review convention, not a lint rule), ESLint and Prettier clean.
- Python, only if it is ever added: PEP 8, type hints, Google-style docstrings and `ruff`. `ruff` is not installed and has no config yet.
- Node and shell scripts: fail loudly with a clear message and a non-zero exit code.

## Thresholds

| Rule | Limit | Enforced by |
|---|---|---|
| Function length | 40 lines | ESLint `max-lines-per-function` |
| Cyclomatic complexity | complexity of 10 | ESLint `complexity` |
| Lint warnings | zero lint warnings | `eslint --max-warnings 0` in CI |
| Coverage on core logic | 100% of `src/lib` | Vitest thresholds |
| Coverage overall | 80% floor | Vitest thresholds in CI |
| Formatting | Prettier-clean | `prettier --check` in CI |
| Commit messages | Conventional Commits | commitlint hook and CI |

## Review checklist

Used by the `code-reviewer` subagent and the `review-pr` skill. `.github/pull_request_template.md` carries the same items (plus the PR-title line); change both together, a test checks it.

- [ ] Tests came first, and a failing run is shown for new behaviour.
- [ ] The thresholds in `docs/guidelines/code-quality.md` hold in CI.
- [ ] No unrelated changes; the scope matches the Asana task.
- [ ] Names, comments and docs match what the code does.
- [ ] No secrets and no new dependency without a stated reason.
- [ ] Content PRs: front-matter valid, alt text present, `draft` unchanged.
