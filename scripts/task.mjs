// Runner behind `make <target>` and `./make.ps1 <target>`: node scripts/task.mjs <target>.
// Same behaviour on Windows, macOS and Linux. See docs/adr/0002-task-runner.md.
import { spawnSync } from 'node:child_process';
import { TASKS, describeTasks } from './lib/tasks.mjs';

const name = process.argv[2] ?? 'help';

if (name === 'help') {
  console.log(
    `Usage: make <target>   (Windows PowerShell: ./make.ps1 <target>)\n\n${describeTasks()}`,
  );
  process.exit(0);
}

const task = TASKS[name];
if (!task) {
  console.error(`Unknown target '${name}'. Run: make help`);
  process.exit(1);
}

if (task.unavailable) {
  console.error(`${name} is not available yet: ${task.unavailable}.`);
  process.exit(1);
}

const result = spawnSync('npm', task.npm ?? [], { stdio: 'inherit', shell: true });
process.exit(result.status ?? 1);
