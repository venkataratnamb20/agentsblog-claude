# Native Windows wrapper (PowerShell, no WSL): ./make.ps1 <target>. Calls the same runner as the Makefile.
param([Parameter(Position = 0)][string]$Target = 'help')

node scripts/task.mjs $Target
exit $LASTEXITCODE
