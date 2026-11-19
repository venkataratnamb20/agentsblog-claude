# Cross-platform task runner (stack: Astro + TypeScript, see docs/adr/0001-astro-typescript.md).
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
	npm run typecheck
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

format:     ; $(call TODO,format)
test-e2e:   ; $(call TODO,test-e2e)
test-bdd:   ; $(call TODO,test-bdd)
release:    ; $(call TODO,release)

# Copy shared skills from .agents/skills to .claude/skills (no symlinks, works on Windows).
sync-agents:
	@python -c "import shutil; shutil.copytree('.agents/skills', '.claude/skills', dirs_exist_ok=True)"
	@echo synced .agents/skills -> .claude/skills

clean:
	@python -c "import shutil; [shutil.rmtree(p, ignore_errors=True) for p in ('dist','build','coverage','.astro')]"
