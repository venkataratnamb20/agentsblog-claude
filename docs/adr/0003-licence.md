# ADR 0003: Licence

- **Status:** Accepted
- **Date:** 2026-11-20
- **Supersedes:** none
- **Deciders:** Venkat (owner and approver)
- **Reviewers:** Solution Architect

## Context

The repository is public and had no licence, so nobody could legally reuse the code or the posts. Venkat chose the Apache License 2.0 on 20 Nov 2026.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| No licence (all rights reserved) | Keeps every right | Nobody may reuse anything; looks unfinished for an open blog |
| **Apache License 2.0 for code and content** | One licence; patent grant; widely understood by engineers | Written for software; attribution terms are awkward for prose and diagrams |
| Apache License 2.0 for code, CC BY 4.0 for `content/` | Standard choice for prose; keeps the code licence | Two licences to explain and test |
| MIT for code | Shortest text | No patent grant |

## Decision

Apache License 2.0 for the whole repository, code and content (`LICENSE`, `package.json`, README, CONTRIBUTING).

## Cost and reversibility

No cost. Reversible for future work: a later move to CC BY 4.0 for `content/` only needs a new ADR, a `content/LICENSE` file and a README line. Copies already distributed under Apache-2.0 stay under it.

## Consequences

- Contributors license their work under Apache-2.0 (stated in CONTRIBUTING).
- Revisit before the first post is published (G2) if reusers of the prose need simpler terms.
