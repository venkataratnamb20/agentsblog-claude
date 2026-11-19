// PreToolUse hook for Write, Edit, MultiEdit and NotebookEdit: blocks secret files and secret-looking content.
// Exit code 2 tells Claude Code to block the tool call and show stderr to the agent.
// It fails closed: input it cannot read, and any crash (even a failed import), is blocked, not allowed.
// Claude Code lets a call through on any other non-zero exit, so every failure path ends in exit 2.
const NAME = 'block-secrets hook';

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

function textsOf(toolInput) {
  return [
    toolInput.content,
    toolInput.new_string,
    toolInput.new_source,
    ...(Array.isArray(toolInput.edits) ? toolInput.edits.map((edit) => edit?.new_string) : []),
  ].filter((text) => typeof text === 'string');
}

async function main() {
  const { findSecrets, isSecretPath } = await import('./lib/secrets.mjs');
  const toolInput = (await readInput())?.tool_input ?? {};
  const path = String(toolInput.file_path ?? toolInput.notebook_path ?? '');

  const problems = [];
  if (path && isSecretPath(path)) problems.push(`${path} is a secret file`);
  for (const name of new Set(textsOf(toolInput).flatMap((text) => findSecrets(text)))) {
    problems.push(`content looks like a ${name}`);
  }
  if (problems.length > 0) {
    block(`${problems.join('; ')}. Remove the secret and use an environment variable instead.`);
  }
}

try {
  await main();
} catch (error) {
  block(
    `unexpected error (${error instanceof Error ? error.message : 'unknown'}); failing closed.`,
  );
}
