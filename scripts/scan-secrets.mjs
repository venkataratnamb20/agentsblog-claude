// Scan tracked files (or only the staged content with --staged) for secrets.
// Reports file, line and pattern name only, never the value. Exits 1 when anything is found.
// There is no opt-out marker: every line of every text file is scanned.
// It fails closed: a secret file name, or a file it cannot read, counts as a finding.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { isSecretPath, scanText } from '../.claude/hooks/lib/secrets.mjs';

const staged = process.argv.includes('--staged');
const gitArgs = staged
  ? ['-c', 'core.quotepath=off', 'diff', '--cached', '--name-only', '--diff-filter=ACMR']
  : ['-c', 'core.quotepath=off', 'ls-files'];
const files = execFileSync('git', gitArgs, { encoding: 'utf8' }).split('\n').filter(Boolean);
const SKIP = /(\.(png|jpe?g|gif|webp|ico|woff2?|pdf)|package-lock\.json)$/i;

/** The staged blob in --staged mode (what will be committed), the working copy otherwise. */
function contentOf(file) {
  return staged
    ? execFileSync('git', ['show', `:${file}`], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 })
    : readFileSync(file, 'utf8');
}

/** Problems for one file, as printable messages. A file deleted from the working tree is not one. */
function problemsIn(file) {
  if (isSecretPath(file)) return [`${file} is a secret file`];
  let text;
  try {
    text = contentOf(file);
  } catch (error) {
    if (!staged && error?.code === 'ENOENT') return [];
    return [`${file} could not be read`];
  }
  return scanText(text).map(({ line, name }) => `${file}:${line} looks like a ${name}`);
}

let findings = 0;
for (const file of files) {
  if (SKIP.test(file)) continue;
  for (const message of problemsIn(file)) {
    console.error(message);
    findings += 1;
  }
}

if (findings > 0) {
  console.error(`secret scan failed: ${findings} finding(s)`);
  process.exit(1);
}
console.log(`secret scan passed (${files.length} files)`);
