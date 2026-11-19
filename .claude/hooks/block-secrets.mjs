// PreToolUse hook for Write, Edit, MultiEdit and NotebookEdit: blocks secret files and secret-looking content.
// Exit code 2 tells Claude Code to block the tool call and show stderr to the agent.
// It fails closed: input it cannot read is blocked, not allowed.
import { findSecrets, isSecretPath } from './lib/secrets.mjs';

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);

let input;
try {
  input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
} catch {
  console.error('Blocked by block-secrets hook: could not read the hook input.');
  process.exit(2);
}

const toolInput = input?.tool_input ?? {};
const path = String(toolInput.file_path ?? toolInput.notebook_path ?? '');
const texts = [
  toolInput.content,
  toolInput.new_string,
  toolInput.new_source,
  ...(Array.isArray(toolInput.edits) ? toolInput.edits.map((edit) => edit?.new_string) : []),
].filter((text) => typeof text === 'string');

const problems = [];
if (path && isSecretPath(path)) problems.push(`${path} is a secret file`);
for (const name of new Set(texts.flatMap((text) => findSecrets(text)))) {
  problems.push(`content looks like a ${name}`);
}

if (problems.length > 0) {
  console.error(
    `Blocked by block-secrets hook: ${problems.join('; ')}. Remove the secret and use an environment variable instead.`,
  );
  process.exit(2);
}
