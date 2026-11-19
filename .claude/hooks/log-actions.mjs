// PostToolUse hook for Bash, Write, Edit and MultiEdit: appends one JSON line per action to
// .claude/logs/actions.jsonl (gitignored). It records the command or path only, never file
// contents, and it never blocks a tool call.
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildLogEntry } from './lib/actionLog.mjs';

try {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  const dir = join(process.env.CLAUDE_PROJECT_DIR ?? process.cwd(), '.claude', 'logs');
  mkdirSync(dir, { recursive: true });
  appendFileSync(
    join(dir, 'actions.jsonl'),
    `${JSON.stringify(buildLogEntry(input, new Date()))}\n`,
  );
} catch {
  // Logging must never break the agent's work.
}
