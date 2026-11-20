// PreToolUse hook for Bash: blocks `git push` while main or develop is checked out, and any push that
// names main or develop as its target (HEAD:main, refs/heads/main). Branch protection on GitHub is the
// real control; this stops the mistake before it reaches the server.
// Exit code 2 blocks the call. It fails closed: if it cannot read the input, tell the branch, or
// import its library, a push is blocked. Claude Code lets a call through on any other non-zero exit.
import { spawnSync } from 'node:child_process';

const NAME = 'push-guard';
const PROTECTED = new Set(['main', 'develop']);

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

function currentBranch(cwd) {
  const result = spawnSync('git', ['branch', '--show-current'], { cwd, encoding: 'utf8' });
  if (result.error || result.status !== 0) return block('could not read the current branch.');
  return result.stdout.trim();
}

async function main() {
  const lib = await import('./lib/secrets.mjs');
  const command = String((await readInput())?.tool_input?.command ?? '');
  if (!lib.isPushCommand(command)) process.exit(0);
  if (lib.pushesToProtectedBranch(command)) {
    block('this push names main or develop. Push a feature branch and open a pull request.');
  }
  const branch = currentBranch(process.env.CLAUDE_PROJECT_DIR ?? process.cwd());
  if (branch === '') block('HEAD is detached. Check out a feature branch before pushing.');
  if (PROTECTED.has(branch)) {
    block(`${branch} is checked out. Switch to a feature branch and open a pull request.`);
  }
}

try {
  await main();
} catch (error) {
  block(
    `unexpected error (${error instanceof Error ? error.message : 'unknown'}); failing closed.`,
  );
}
