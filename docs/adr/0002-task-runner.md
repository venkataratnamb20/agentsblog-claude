# ADR 0002: Task runner

- **Status:** Accepted (Asana task "Cross-platform task runner: Makefile with Windows support", 19 Nov 2026). Windows support is about the developer's operating system, not the IDE, so it stays.
- **Deciders:** DevOps & SRE Agent, Venkat (approver)

## Context

Agents and people need one set of commands (`setup`, `lint`, `test`, ...) that behaves the same on Windows PowerShell without WSL, macOS, Linux and CI. ADR 0001 chose npm scripts as the underlying commands.

## Options considered

| Option | Pros | Cons |
|---|---|---|
| Makefile and `make.ps1`, each with its own commands | No extra dependency | Two copies of every command that drift apart |
| **Makefile and `make.ps1` as thin wrappers over one Node runner** | One definition of each target; no new tool; works wherever Node works | Two small wrapper files to keep in step (a test checks it) |
| `just` | Nice syntax, cross-platform | Another binary to install on every machine and CI runner |
| Task (go-task) | Cross-platform, YAML | Another binary to install; YAML for what is a short list |

## Decision

Use a **Makefile for macOS, Linux and CI** and **`make.ps1` for native Windows PowerShell**. Both only call `node scripts/task.mjs <target>`. The targets are defined once in `scripts/lib/tasks.mjs`; `npm` scripts stay the real commands (ADR 0001). A target that cannot work yet exits 1 with a message that says what it waits for (`test-e2e`, `test-bdd`, `release`).

## Consequences

- Node is the only requirement on every OS; GNU make is optional on Windows.
- `tests/unit/tasks.test.ts` fails if the Makefile, `make.ps1` and the table disagree.
- The `bootstrap-check` workflow runs `setup`, `lint`, `typecheck` and `test` through `make` on Linux and macOS and through `./make.ps1` on Windows.
- Unavailable targets are listed in the README as "available after <task>"; they are enabled by editing one table entry.
- No `sync-agents` target exists: Claude Code reads `.claude/` directly.
