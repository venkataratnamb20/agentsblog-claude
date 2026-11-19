# Native Windows wrapper: ./make.ps1 <target>. Mirrors the Makefile; run `make help` equivalents here.
param([Parameter(Position = 0)][string]$Target = 'help')

$stubs = 'setup','dev','lint','format','typecheck','test','test-e2e','test-bdd','coverage','build','preview','audit','release'

switch ($Target) {
    'help' { Write-Host "Targets: $($stubs -join ' ') sync-agents clean" }
    'sync-agents' {
        python -c "import shutil; shutil.copytree('.agents/skills', '.claude/skills', dirs_exist_ok=True)"
        Write-Host 'synced .agents/skills -> .claude/skills'
    }
    'clean' {
        python -c "import shutil; [shutil.rmtree(p, ignore_errors=True) for p in ('dist','build','coverage')]"
    }
    { $stubs -contains $_ } { Write-Host "[$Target] not configured yet - waiting on tech stack ADR" }
    default { Write-Error "Unknown target '$Target'. Run ./make.ps1 help"; exit 1 }
}
