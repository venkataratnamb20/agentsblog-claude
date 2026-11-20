import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const text = read('docs/threat-model.md');
const risks = (text.split('## Risk register')[1] ?? '')
  .split('\n')
  .filter((l) => l.startsWith('|') && !l.includes('---') && !l.includes('Rating'))
  .map((l) => l.split('|').map((c) => c.trim()));
const HEADINGS = [
  'STRIDE',
  'OWASP Top 10',
  'ASVS Level 1',
  'Security headers and CSP',
  'Supply-chain policy',
  'Risk register',
];
const STRIDE = [
  'Site',
  'CI/CD',
  'Agent access',
  'Spoofing',
  'Tampering',
  'Repudiation',
  'Information disclosure',
  'Denial of service',
  'Elevation of privilege',
];

describe('docs/threat-model.md', () => {
  it.each(HEADINGS)('has the section %s', (heading) => {
    expect(text).toContain(`## ${heading}`);
  });

  it('covers site, CI/CD and agent access with all six STRIDE categories', () => {
    const stride = text.split('## STRIDE')[1]?.split('\n## ')[0] ?? '';
    for (const part of STRIDE) expect(stride, part).toContain(part);
  });

  it('maps A01 to A10', () => {
    for (let i = 1; i <= 10; i += 1) expect(text).toContain(`A${String(i).padStart(2, '0')}`);
  });

  it('states a CSP and a supply-chain policy', () => {
    for (const part of ['Content-Security-Policy', 'lockfile', 'pinned', 'SBOM']) {
      expect(text, part).toContain(part);
    }
  });

  it('gives every high risk a control and a stage 4 test', () => {
    const high = risks.filter((cells) => cells.includes('High'));
    expect(high.length).toBeGreaterThan(0);
    for (const cells of high) {
      expect(cells[4], cells.join('|')).toBeTruthy();
      expect(cells[5], cells.join('|')).toBeTruthy();
    }
  });
});
