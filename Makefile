# Cross-platform task runner. Every target calls scripts/task.mjs, the single definition of what
# each target does (docs/adr/0002-task-runner.md). Windows without GNU make: use ./make.ps1 <target>.

.PHONY: help setup dev lint format typecheck test test-e2e test-bdd coverage build preview audit release clean

help:
	@node scripts/task.mjs help
setup:
	@node scripts/task.mjs setup
dev:
	@node scripts/task.mjs dev
lint:
	@node scripts/task.mjs lint
format:
	@node scripts/task.mjs format
typecheck:
	@node scripts/task.mjs typecheck
test:
	@node scripts/task.mjs test
test-e2e:
	@node scripts/task.mjs test-e2e
test-bdd:
	@node scripts/task.mjs test-bdd
coverage:
	@node scripts/task.mjs coverage
build:
	@node scripts/task.mjs build
preview:
	@node scripts/task.mjs preview
audit:
	@node scripts/task.mjs audit
release:
	@node scripts/task.mjs release
clean:
	@node scripts/task.mjs clean
