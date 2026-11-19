# Code quality

- Clean Code: intention-revealing names, small single-purpose functions, no dead code.
- SOLID; prefer composition over inheritance.
- TDD: write a failing test, make it pass, refactor. BDD `.feature` files for user journeys in `tests/bdd/`.
- Data structures: pick by access pattern; note time/space complexity on hot paths.
- TypeScript: `strict` on. Python: PEP 8, type hints, Google-style docstrings.
- Coverage: 100% on core logic; CI fails below 80% overall.
- Review: every PR is checked by the Code Reviewer agent against this list.
