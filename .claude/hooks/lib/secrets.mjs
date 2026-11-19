// @ts-check
// Pure helpers for the Claude Code hooks. Only pattern names are ever reported, never matched values.

/** @type {ReadonlyArray<readonly [string, RegExp]>} */
const PATTERNS = [
  ['aws-access-key', /\bAKIA[0-9A-Z]{16}\b/],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9]{36,}\b/],
  ['slack-token', /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ['private-key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  [
    'generic-api-key',
    /\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*["'][A-Za-z0-9_\-/+=]{24,}["']/i,
  ],
];

/**
 * Names of the secret patterns found in the text.
 * @param {string} text
 * @returns {string[]}
 */
export function findSecrets(text) {
  return PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([name]) => name);
}

/**
 * True when a shell command runs `git commit`.
 * @param {string} command
 * @returns {boolean}
 */
export function isCommitCommand(command) {
  return /\bgit\b[^;&|\n]*\scommit(?=\s|$)/.test(command);
}

const SAFE_ENV_FILES = new Set(['.env.example', '.env.sample', '.env.template']);

/**
 * True for paths that normally hold secrets (.env files, keys, credentials).
 * @param {string} path
 * @returns {boolean}
 */
export function isSecretPath(path) {
  const base = path.replace(/\\/g, '/').split('/').pop() ?? '';
  if (SAFE_ENV_FILES.has(base)) return false;
  if (base === '.env' || base.startsWith('.env.')) return true;
  if (/\.(pem|key|p12|pfx)$/i.test(base)) return true;
  if (/^id_(rsa|ed25519|ecdsa|dsa)/.test(base)) return true;
  return /^(credentials|secrets?)\.(json|ya?ml|toml|env|ini|txt)$/i.test(base);
}

/**
 * Findings per line (1-based line numbers). Never includes the matched value.
 * A line that contains "secret-scan-ignore" is skipped, for documented examples.
 * @param {string} text
 * @returns {{ line: number, name: string }[]}
 */
export function scanText(text) {
  /** @type {{ line: number, name: string }[]} */
  const findings = [];
  text.split(/\r?\n/).forEach((content, index) => {
    if (content.includes('secret-scan-ignore')) return;
    for (const name of findSecrets(content)) findings.push({ line: index + 1, name });
  });
  return findings;
}

/**
 * Replace every secret-looking match with a marker that names the pattern.
 * @param {string} text
 * @returns {string}
 */
export function redactSecrets(text) {
  let result = text;
  for (const [name, pattern] of PATTERNS) {
    const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
    result = result.replace(new RegExp(pattern.source, flags), `[REDACTED:${name}]`);
  }
  return result;
}
