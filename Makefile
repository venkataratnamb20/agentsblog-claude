# Cross-platform task runner. Stack-specific targets are stubs until the tech stack ADR is approved (Asana: "Select tech stack").
# Windows: run with GNU make (e.g. via Git Bash or `winget install GnuWin32.Make`).

.PHONY: help setup dev lint format typecheck test test-e2e test-bdd coverage build preview audit sync-agents release clean

help:
	@echo Targets: setup dev lint format typecheck test test-e2e test-bdd coverage build preview audit sync-agents release clean

define TODO
	@echo "[$(1)] not configured yet - waiting on tech stack ADR"
endef

setup:      ; $(call TODO,setup)
dev:        ; $(call TODO,dev)
lint:       ; $(call TODO,lint)
format:     ; $(call TODO,format)
typecheck:  ; $(call TODO,typecheck)
test:       ; $(call TODO,test)
test-e2e:   ; $(call TODO,test-e2e)
test-bdd:   ; $(call TODO,test-bdd)
coverage:   ; $(call TODO,coverage)
build:      ; $(call TODO,build)
preview:    ; $(call TODO,preview)
audit:      ; $(call TODO,audit)
release:    ; $(call TODO,release)

# Copy shared skills from .agents/skills to .claude/skills (no symlinks, works on Windows).
sync-agents:
	@python -c "import shutil; shutil.copytree('.agents/skills', '.claude/skills', dirs_exist_ok=True)"
	@echo synced .agents/skills -> .claude/skills

clean:
	@python -c "import shutil; [shutil.rmtree(p, ignore_errors=True) for p in ('dist','build','coverage')]"
