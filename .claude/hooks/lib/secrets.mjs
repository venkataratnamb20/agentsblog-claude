// @ts-check
// Pure helpers for the Claude Code hooks. Only pattern names are ever reported, never matched values.

/** @type {ReadonlyArray<readonly [string, RegExp]>} */
const PATTERNS = [
  ['aws-access-key', /\bAKIA[0-9A-Z]{16}\b/],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})/],
  ['slack-token', /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  ['private-key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['anthropic-key', /\bsk-ant-[A-Za-z0-9_-]{20,}/],
  ['openai-key', /\bsk-[A-Za-z0-9]{32,}/],
  ['stripe-key', /\bsk_live_[A-Za-z0-9]{16,}/],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{35}/],
  ['jwt', /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ['npm-token', /\bnpm_[A-Za-z0-9]{36}\b/],
  ['bearer-token', /\bBearer\s+(?=[A-Za-z0-9._~+/=-]*[0-9])[A-Za-z0-9._~+/=-]{20,}/],
  [
    'env-secret',
    /\b[A-Z][A-Z0-9_]*(?:KEY|SECRET|TOKEN|PASSWORD)\s*=\s*(?=[A-Za-z0-9_\-/+=]*[A-Z])(?=[A-Za-z0-9_\-/+=]*[a-z])(?=[A-Za-z0-9_\-/+=]*[0-9])[A-Za-z0-9_\-/+=]{20,}/,
  ],
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
 * True when a shell command runs `git commit`, including inside bash -c, sh -c or eval.
 * @param {string} command
 * @returns {boolean}
 */
export function isCommitCommand(command) {
  return /\bgit\b[^;&|\n]*\scommit(?=[\s"'`);|&]|$)/.test(command);
}

/**
 * True for a commit that skips the git hooks: --no-verify and its abbreviations, -n (also inside a
 * flag cluster), a core.hooksPath override or HUSKY=0.
 * @param {string} command
 * @returns {boolean}
 */
export function usesNoVerify(command) {
  if (!isCommitCommand(command)) return false;
  // Strip quoting so that --no-ve"rify" and $'--no-verify' are seen as written.
  const plain = command.replace(/["'$\\]/g, '');
  return (
    /\s--no-v[a-z-]*(?=\s|$)/.test(plain) ||
    /\s-[a-zA-Z]*n[a-zA-Z]*(?=\s|$)/.test(plain) ||
    /core\.hooksPath/.test(plain) ||
    /\bHUSKY\s*=/.test(plain)
  );
}

/**
 * True for a commit that stages tracked changes itself (-a, -am, --all).
 * @param {string} command
 * @returns {boolean}
 */
export function commitsAll(command) {
  if (!isCommitCommand(command)) return false;
  return /\s--all(?=[\s"']|$)/.test(command) || /\s-[a-zA-Z]*a[a-zA-Z]*(?=[\s"']|$)/.test(command);
}

const SAFE_ENV_FILES = new Set(['.env.example', '.env.sample', '.env.template']);
const SECRET_FILE_NAMES = new Set([
  '.npmrc',
  '.netrc',
  '.pgpass',
  '.git-credentials',
  'terraform.tfstate',
  'terraform.tfstate.backup',
]);

/**
 * True for paths that normally hold secrets (env files, keys, credentials). Case-insensitive.
 * @param {string} path
 * @returns {boolean}
 */
export function isSecretPath(path) {
  const base = (path.replace(/\\/g, '/').split('/').pop() ?? '').toLowerCase();
  if (SAFE_ENV_FILES.has(base)) return false;
  if (base === '.env' || base.startsWith('.env.')) return true;
  if (SECRET_FILE_NAMES.has(base)) return true;
  if (/\.(pem|key|p12|pfx|keystore|jks|p8)$/.test(base)) return true;
  if (/^id_[a-z0-9_]+$/.test(base)) return true;
  if (/^service-account.*\.json$/.test(base)) return true;
  return /^(credentials|secrets?)\.(json|ya?ml|toml|env|ini|txt)$/.test(base);
}

/**
 * Findings per line (1-based line numbers). Never includes the matched value.
 * There is no opt-out marker: every line is scanned.
 * @param {string} text
 * @returns {{ line: number, name: string }[]}
 */
export function scanText(text) {
  /** @type {{ line: number, name: string }[]} */
  const findings = [];
  text.split(/\r?\n/).forEach((content, index) => {
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
