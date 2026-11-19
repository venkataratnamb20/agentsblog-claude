// PreToolUse hook for Bash: before any `git commit`, scan the diff for secrets and run the tests.
// Exit code 2 blocks the commit and shows stderr to the agent. It fails closed: anything it cannot
// read or run is blocked, not allowed. Commits that skip the git hooks (--no-verify, -n) are blocked.
import { spawnSync } from 'node:child_process';
import { commitsAll, findSecrets, isCommitCommand, usesNoVerify } from './lib/secrets.mjs';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

let input;
try {
  input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
} catch {
  console.error('Blocked by pre-commit-gate: could not read the hook input.');
  process.exit(2);
}

const command = String(input?.tool_input?.command ?? '');
if (!isCommitCommand(command)) process.exit(0);

if (usesNoVerify(command)) {
  console.error(
    'Blocked by pre-commit-gate: --no-verify (or -n) skips the secret scan and the format check. Commit without it.',
  );
  process.exit(2);
}

const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
// -a and -am stage tracked changes at commit time, so scan everything against HEAD in that case.
const diffArgs = commitsAll(command) ? ['diff', 'HEAD', '-U0'] : ['diff', '--cached', '-U0'];
const diff = spawnSync('git', diffArgs, { cwd, encoding: 'utf8' });
if (diff.error || diff.status !== 0) {
  console.error('Blocked by pre-commit-gate: could not read the diff to scan it for secrets.');
  process.exit(2);
}

const added = diff.stdout
  .split('\n')
  .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
  .join('\n');
const found = findSecrets(added);
if (found.length > 0) {
  console.error(
    `Blocked by pre-commit-gate: the changes look like secrets (${found.join(', ')}). Unstage them and remove the secret.`,
  );
  process.exit(2);
}

// The tests themselves exercise this script; never start a second test run from inside the first.
if (process.env.CLAUDE_GATE_RUNNING === '1') process.exit(0);

const tests = spawnSync('npm', ['test', '--silent'], {
  cwd,
  encoding: 'utf8',
  shell: true,
  env: { ...process.env, CLAUDE_GATE_RUNNING: '1' },
});
if (tests.status !== 0) {
  const output = `${tests.stdout ?? ''}${tests.stderr ?? ''}`.split('\n').slice(-25).join('\n');
  console.error(`Blocked by pre-commit-gate: tests failed. Fix them before committing.\n${output}`);
  process.exit(2);
}
