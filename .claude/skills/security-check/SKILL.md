---
name: security-check
description: Use when a change touches dependencies, configuration, hosting, access or user input, or before launch: finds secrets, vulnerable dependencies and risky settings.
---

# security-check

## Steps
1. List what changed: `git diff <base>...HEAD --stat`.
2. Scan added lines for secrets (keys, tokens, private keys, `.env` files); report file, line and pattern name only, never the value.
3. Run `npm audit --audit-level=high` and review any new dependency (maintainer, licence, install scripts).
4. Confirm `.claude/settings.json` deny rules and hooks are intact.
5. If hosting or headers changed, check security headers and privacy impact.
6. Any access, permission or ruleset change is reported to Venkat, never applied.
7. Write a severity-ranked report: finding, evidence, owner, recommended fix.

## Done when
- The report lists every finding with severity, evidence and an owner.
- Critical and high items are fixed or explicitly accepted by Venkat.
