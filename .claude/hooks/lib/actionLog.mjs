// @ts-check
// Pure helpers for the action-log hook. Targets are redacted and truncated; file contents are never logged.
import { redactSecrets } from './secrets.mjs';

const MAX_TARGET = 300;

/**
 * Replace secret-looking text with a marker that names the pattern.
 * @param {string} text
 * @returns {string}
 */
export function redact(text) {
  return redactSecrets(text);
}

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
    target: redact(raw).slice(0, MAX_TARGET),
  };
}
