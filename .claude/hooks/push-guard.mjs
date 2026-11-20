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

// The branch the current branch tracks, such as origin/main. Empty when there is none.
function upstreamBranch(cwd) {
  const args = ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'];
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.error) return block('could not read the upstream branch.');
  return result.status === 0 ? result.stdout.trim() : '';
}

function checkTargets(lib, command) {
  if (lib.pushesToProtectedBranch(command)) {
    block('this push names main or develop. Push a feature branch and open a pull request.');
  }
  if (lib.pushesAllRefs(command)) {
    block('--all and --mirror push every branch, main and develop included. Push one branch.');
  }
}

function checkBranch(lib, command) {
  const cwd = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const branch = currentBranch(cwd);
  if (branch === '') block('HEAD is detached. Check out a feature branch before pushing.');
  if (PROTECTED.has(branch)) {
    block(`${branch} is checked out. Switch to a feature branch and open a pull request.`);
  }
  // A push with no branch named goes to the upstream, which may be main or develop.
  if (lib.isBarePush(command) && PROTECTED.has(upstreamBranch(cwd).split('/').pop() ?? '')) {
    block('the upstream is main or develop. Name the branch: git push -u origin HEAD.');
  }
}

async function main() {
  const lib = await import('./lib/secrets.mjs');
  const command = String((await readInput())?.tool_input?.command ?? '');
  if (!lib.isPushCommand(command)) process.exit(0);
  checkTargets(lib, command);
  checkBranch(lib, command);
}

try {
  await main();
} catch (error) {
  block(
    `unexpected error (${error instanceof Error ? error.message : 'unknown'}); failing closed.`,
  );
}
