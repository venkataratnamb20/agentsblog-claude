// PreToolUse hook for Bash: before any `git commit`, scan the diff for secrets and run the tests.
// Exit code 2 blocks the commit and shows stderr to the agent. It fails closed: anything it cannot
// read or run, and any crash (even a failed import), is blocked, not allowed. Claude Code lets a
// call through on any other non-zero exit, so every failure path ends in exit 2.
// Commits that skip the git hooks (--no-verify, -n) are blocked.
import { spawnSync } from 'node:child_process';

const NAME = 'pre-commit-gate';
const BIG = 64 * 1024 * 1024;

function block(message) {
  console.error(`Blocked by ${NAME}: ${message}`);
  process.exit(2);
}

async function readInput() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return block('could not read the hook input.');
  }
}

function addedLines(command, cwd, commitsAll) {
  // -a and -am stage tracked changes at commit time, so scan everything against HEAD in that case.
  const args = commitsAll(command) ? ['diff', 'HEAD', '-U0'] : ['diff', '--cached', '-U0'];
  const diff = spawnSync('git', args, { cwd, encoding: 'utf8', maxBuffer: BIG });
  if (diff.error || diff.status !== 0) block('could not read the diff to scan it for secrets.');
  return diff.stdout
    .split('\n')
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
    .join('\n');
}

function runTests(cwd) {
  const tests = spawnSync('npm', ['test', '--silent'], {
    cwd,
    encoding: 'utf8',
    shell: true,
    maxBuffer: BIG,
    env: { ...process.env, CLAUDE_GATE_RUNNING: '1' },
  });
  if (tests.status !== 0) {
    const output = `${tests.stdout ?? ''}${tests.stderr ?? ''}`.split('\n').slice(-25).join('\n');
    block(`tests failed. Fix them before committing.\n${output}`);
  }
}

async function main() {
  const lib = await import('./lib/secrets.mjs');
  const command = String((await readInput())?.tool_input?.command ?? '');
  if (!lib.isCommitCommand(command)) process.exit(0);
  if (lib.usesNoVerify(command)) {
    block('--no-verify (or -n) skips the secret scan and the format check. Commit without it.');
  }

  const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const found = lib.findSecrets(addedLines(command, cwd, lib.commitsAll));
  if (found.length > 0) {
    block(
      `the changes look like secrets (${found.join(', ')}). Unstage them and remove the secret.`,
    );
  }

  // The tests themselves exercise this script; never start a second test run from inside the first.
  if (process.env.CLAUDE_GATE_RUNNING === '1') process.exit(0);
  runTests(cwd);
}

try {
  await main();
} catch (error) {
  block(
    `unexpected error (${error instanceof Error ? error.message : 'unknown'}); failing closed.`,
  );
}
