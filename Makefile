# Cross-platform task runner (stack: docs/adr/0001-core-tech-stack.md).
# Windows without GNU make: use ./make.ps1 <target>.

.PHONY: help setup dev lint format typecheck test test-e2e test-bdd coverage build preview audit sync-agents release clean

help:
	@echo Targets: setup dev lint format typecheck test test-e2e test-bdd coverage build preview audit sync-agents release clean

define TODO
	@echo "[$(1)] not configured yet"
endef

setup:
	npm ci
dev:
	npm run dev
lint:
	npm run lint
format:
	npm run format
typecheck:
	npm run typecheck
test:
	npm test
coverage:
	npm run coverage
build:
	npm run build
preview:
	npm run preview
audit:
	npm audit --audit-level=high
sync-agents:
	npm run sync-agents
clean:
	npm run clean

test-e2e:   ; $(call TODO,test-e2e)
test-bdd:   ; $(call TODO,test-bdd)
release:    ; $(call TODO,release)
