import { describe, expect, it } from 'vitest';
import {
  findSecrets,
  isPushCommand,
  pushesToProtectedBranch,
  redactSecrets,
  usesGitAlias,
} from '../../.claude/hooks/lib/secrets.mjs';
import { buildLogEntry } from '../../.claude/hooks/lib/actionLog.mjs';

// Every fixture that looks like a secret is built at runtime, so no secret-shaped text is in this file.
const mixed = 'Zq8' + 'x7K2m9Vb4Nc1Rt5Yw3';
const hex40 = 'a1b2c3d4e5'.repeat(4);
const hex64 = 'f0e1d2c3b4a59687'.repeat(4);
const PW = 'pass' + 'word';
const KEY = 'api' + '_key';

describe('secret patterns catch the evasion forms from the security review', () => {
  it.each([
    ['an unquoted password assignment', `${PW}: ${mixed}`],
    ['a password in an env style line', `DB_${PW.toUpperCase()}=${mixed}`],
    ['a lowercase api key assignment', `${KEY}=${mixed}`],
    ['an all-hex secret', `client_secret = "${hex40}"`],
    ['an all-hex token', `AUTH_TOKEN=${hex64}`],
    ['an x-api-key header', `X-Api-Key: ${mixed}`],
    ['a basic authorization header', `Authorization: Basic ${mixed}=`],
    ['credentials inside a url', `https://deploy:${mixed}@example.com/repo.git`],
  ])('flags %s', (_name, line) => {
    expect(findSecrets(line).length, line).toBeGreaterThan(0);
  });
});

describe('placeholders and ordinary text are not flagged', () => {
  it.each([
    `${PW}: string`,
    `${PW}: z.string().min(8)`,
    `${PW} manager and recovery codes`,
    'NEWSLETTER_API_KEY=replace-me',
    `${KEY}=replace-me`,
    `${PW}: process.env.DB_PASSWORD`,
    `${PW}: <your-value>`,
    'Authorization: Bearer <token>',
    'https://user:password@host.example/path',
    'https://example.com/docs/page',
    `commit ${hex40} on develop`,
    `sha256 ${hex64}`,
    'secret_key: see the provider settings',
  ])('passes: %s', (line) => {
    expect(findSecrets(line), line).toEqual([]);
  });
});

describe('the action log redacts the new forms', () => {
  it('redacts header values and url credentials in a logged command', () => {
    const command = `curl -H "X-Api-Key: ${mixed}" https://deploy:${mixed}@example.com/x`;
    const entry = buildLogEntry({ tool_name: 'Bash', tool_input: { command } }, new Date(0));
    expect(entry.target).not.toContain(mixed);
    expect(entry.target).toContain('REDACTED');
  });

  it('redactSecrets names the pattern it removed', () => {
    expect(redactSecrets(`${KEY}=${mixed}`)).toContain('[REDACTED:');
  });
});

describe('isPushCommand', () => {
  it.each([
    'git push',
    'git push origin HEAD',
    'git push -u origin HEAD',
    'git -C ../other push origin x',
    'bash -c "git push origin HEAD"',
    'cd repo && git push',
  ])('detects %s', (command) => {
    expect(isPushCommand(command)).toBe(true);
  });

  it.each(['git status', 'git pull --ff-only', 'git log --oneline', 'echo git push is blocked'])(
    'ignores %s',
    (command) => {
      expect(isPushCommand(command)).toBe(false);
    },
  );
});

describe('pushesToProtectedBranch looks only at the push command itself', () => {
  it.each([
    'git push origin HEAD:main',
    'git push origin main',
    'git push origin +HEAD:develop',
    'git push origin feature/x:refs/heads/main',
    'git -C ../x push origin main',
    'echo done && git push origin HEAD:main',
  ])('detects %s', (command) => {
    expect(pushesToProtectedBranch(command)).toBe(true);
  });

  it.each([
    'git push origin HEAD',
    'git push -u origin HEAD',
    'git push origin feature/maintain-x',
    'printf "fix main or develop" > m.txt && git push -u origin HEAD',
    'git commit -m "touch main and develop docs" && git push -u origin HEAD 2>&1 | tail -1',
    'git push -u origin HEAD; echo main',
    'git status',
  ])('ignores %s', (command) => {
    expect(pushesToProtectedBranch(command)).toBe(false);
  });
});

describe('usesGitAlias', () => {
  it.each([
    'git -c alias.x=commit x',
    'git -c "alias.ci=commit -m x" ci',
    'git config alias.ci commit',
    'git config --global alias.ci commit',
  ])('detects %s', (command) => {
    expect(usesGitAlias(command)).toBe(true);
  });

  it.each([
    'git commit -m x',
    'git status',
    'git config user.name x',
    'git -c core.quotepath=off diff',
  ])('ignores %s', (command) => {
    expect(usesGitAlias(command)).toBe(false);
  });
});
