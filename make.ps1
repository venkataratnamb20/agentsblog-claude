# Native Windows wrapper (PowerShell, no WSL): ./make.ps1 <target>. Calls the same runner as the Makefile.
# Works from any folder: the runner is found relative to this file.
param([Parameter(Position = 0)][string]$Target = 'help')

$ErrorActionPreference = 'Stop'
node "$PSScriptRoot/scripts/task.mjs" $Target
if ($null -eq $LASTEXITCODE) { exit 1 }
exit $LASTEXITCODE
