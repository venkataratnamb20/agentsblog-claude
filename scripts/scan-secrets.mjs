// Scan tracked files (or only staged files with --staged) for secrets.
// Reports file, line and pattern name only, never the value. Exits 1 when anything is found.
// A line containing "secret-scan-ignore" is skipped (documented examples only).
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { scanText } from '../.claude/hooks/lib/secrets.mjs';

const staged = process.argv.includes('--staged');
const gitArgs = staged ? ['diff', '--cached', '--name-only', '--diff-filter=ACM'] : ['ls-files'];
const files = execFileSync('git', gitArgs, { encoding: 'utf8' }).split('\n').filter(Boolean);
const SKIP = /(\.(png|jpe?g|gif|webp|ico|svg|woff2?|pdf)|package-lock\.json)$/i;

let findings = 0;
for (const file of files) {
  if (SKIP.test(file)) continue;
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  for (const { line, name } of scanText(text)) {
    console.error(`${file}:${line} looks like a ${name}`);
    findings += 1;
  }
}

if (findings > 0) {
  console.error(`secret scan failed: ${findings} finding(s)`);
  process.exit(1);
}
console.log(`secret scan passed (${files.length} files)`);
