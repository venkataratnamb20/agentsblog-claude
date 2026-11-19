# Native Windows wrapper: ./make.ps1 <target>. Mirrors the Makefile.
param([Parameter(Position = 0)][string]$Target = 'help')

$npm = @{
    setup = 'ci'; dev = 'run dev'; lint = 'run lint'; format = 'run format'; typecheck = 'run typecheck'
    test = 'test'; coverage = 'run coverage'; build = 'run build'; preview = 'run preview'
    audit = 'audit --audit-level=high'; 'sync-agents' = 'run sync-agents'; clean = 'run clean'
}
$stubs = 'test-e2e', 'test-bdd', 'release'

if ($Target -eq 'help') { Write-Host "Targets: $(($npm.Keys + $stubs | Sort-Object) -join ' ')" }
elseif ($npm.ContainsKey($Target)) { & npm ($npm[$Target] -split ' '); exit $LASTEXITCODE }
elseif ($stubs -contains $Target) { Write-Host "[$Target] not configured yet" }
else { Write-Error "Unknown target '$Target'. Run ./make.ps1 help"; exit 1 }
