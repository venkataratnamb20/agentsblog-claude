// PreToolUse hook for Bash: before any `git commit`, scan the staged diff for secrets and run the tests.
// Exit code 2 blocks the commit and shows stderr to the agent.
import { spawnSync } from 'node:child_process';
import { findSecrets, isCommitCommand } from './lib/secrets.mjs';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

let input;
try {
  input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
} catch {
  process.exit(0);
}

if (!isCommitCommand(String(input?.tool_input?.command ?? ''))) process.exit(0);

const diff = spawnSync('git', ['diff', '--cached', '-U0'], { encoding: 'utf8' });
const added = (diff.stdout ?? '')
  .split('\n')
  .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
  .join('\n');
const found = findSecrets(added);
if (found.length > 0) {
  console.error(
    `Blocked by pre-commit-gate: staged changes look like secrets (${found.join(', ')}). Unstage them and remove the secret.`,
  );
  process.exit(2);
}

const tests = spawnSync('npm', ['test', '--silent'], { encoding: 'utf8', shell: true });
if (tests.status !== 0) {
  const output = `${tests.stdout ?? ''}${tests.stderr ?? ''}`.split('\n').slice(-25).join('\n');
  console.error(`Blocked by pre-commit-gate: tests failed. Fix them before committing.\n${output}`);
  process.exit(2);
}
