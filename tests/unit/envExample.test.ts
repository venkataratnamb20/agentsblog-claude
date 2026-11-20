import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { isSecretPath, scanText } from '../../.claude/hooks/lib/secrets.mjs';

// Decision (Venkat, 20 Nov 2026): develop with a local .env and placeholder secrets.
const text = existsSync('.env.example')
  ? readFileSync('.env.example', 'utf8').replace(/\r\n/g, '\n')
  : '';
const entries = text
  .split('\n')
  .filter((line) => line.trim() !== '' && !line.startsWith('#'))
  .map((line) => {
    const [key = '', ...rest] = line.split('=');
    return { key, value: rest.join('=') };
  });
const SECRETISH = /(KEY|TOKEN|SECRET|PASSWORD)/;

describe('.env.example (names and placeholders only)', () => {
  it('exists and is the one env file the secret guards allow', () => {
    expect(text).not.toBe('');
    expect(isSecretPath('.env.example')).toBe(false);
  });

  it('documents the variables the site reads today', () => {
    const keys = entries.map((e) => e.key);
    expect(keys).toContain('PREVIEW_DRAFTS');
    expect(keys).toContain('ALLOW_INDEXING');
  });

  it('gives every key, token, secret and password a placeholder, never a real value', () => {
    const secretish = entries.filter((e) => SECRETISH.test(e.key));
    expect(secretish.length).toBeGreaterThan(0);
    for (const { key, value } of secretish) expect(value, key).toBe('replace-me');
  });

  it('passes the secret scanner', () => {
    expect(scanText(text)).toEqual([]);
  });

  it('keeps indexing and drafts off by default', () => {
    const byKey = Object.fromEntries(entries.map((e) => [e.key, e.value]));
    expect(byKey['ALLOW_INDEXING']).toBe('false');
    expect(byKey['PREVIEW_DRAFTS']).toBe('false');
  });

  it('is not gitignored, while a real .env file is', () => {
    const ignored = (path: string) =>
      spawnSync('git', ['check-ignore', '-q', path], { encoding: 'utf8' }).status === 0;
    expect(ignored('.env.example')).toBe(false);
    expect(ignored('.env')).toBe(true);
  });

  it('no real .env file is tracked', () => {
    const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n');
    expect(tracked.filter((f) => /(^|\/)\.env($|\.)/.test(f) && !f.endsWith('.example'))).toEqual(
      [],
    );
  });
});

describe('secrets guide explains the placeholder workflow', () => {
  const guide = readFileSync('docs/guidelines/secrets-and-access.md', 'utf8');

  it('says to copy .env.example to .env and that real secrets wait for the hosting choice', () => {
    expect(guide).toContain('cp .env.example .env');
    expect(guide).toContain('placeholder');
    expect(guide).toContain('Decision (Venkat, 20 Nov 2026)');
  });
});
