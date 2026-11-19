// @ts-check
// Pure helper for the action-log hook. Targets are redacted and truncated; file contents are never logged.
import { redactSecrets } from './secrets.mjs';

const MAX_TARGET = 300;

/**
 * One action-log entry for a tool call.
 * @param {{ tool_name?: string, tool_input?: Record<string, unknown> }} input
 * @param {Date} now
 * @returns {{ time: string, tool: string, target: string }}
 */
export function buildLogEntry(input, now) {
  const toolInput = input.tool_input ?? {};
  let raw = '';
  if (typeof toolInput['command'] === 'string') raw = toolInput['command'];
  else if (typeof toolInput['file_path'] === 'string') raw = toolInput['file_path'];
  return {
    time: now.toISOString(),
    tool: input.tool_name ?? 'unknown',
    target: redactSecrets(raw).slice(0, MAX_TARGET),
  };
}
