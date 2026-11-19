import { describe, expect, it } from 'vitest';
import { findSecrets, isCommitCommand, isSecretPath } from '../../.claude/hooks/lib/secrets.mjs';

// Fake secrets are assembled at runtime so no secret-looking literal sits in the source.
const awsKey = 'AKIA' + 'IOSFODNN7EXAMPLE';
const githubToken = 'ghp_' + 'a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8';
const slackToken = 'xoxb-' + '1234567890-abcdefghijklmnop';
const privateKey = '-----BEGIN ' + 'RSA PRIVATE KEY-----';

describe('findSecrets', () => {
  it('detects an AWS access key id', () => {
    expect(findSecrets(`id = ${awsKey}`)).toContain('aws-access-key');
  });
  it('detects a GitHub token', () => {
    expect(findSecrets(`token: ${githubToken}`)).toContain('github-token');
  });
  it('detects a Slack token', () => {
    expect(findSecrets(slackToken)).toContain('slack-token');
  });
  it('detects a private key header', () => {
    expect(findSecrets(privateKey)).toContain('private-key');
  });
  it('detects a hard-coded api key assignment', () => {
    expect(findSecrets('const apiKey = "' + 'abcdefghijklmnopqrstuvwxyz123456' + '";')).toContain(
      'generic-api-key',
    );
  });
  it('returns every match, not only the first', () => {
    expect(findSecrets(`${awsKey}\n${privateKey}`).sort()).toEqual([
      'aws-access-key',
      'private-key',
    ]);
  });
  it('ignores ordinary code and placeholders', () => {
    expect(findSecrets('export function slugify(text) { return text; }')).toEqual([]);
    expect(findSecrets('API_KEY=your-key-here')).toEqual([]);
  });
});

describe('isCommitCommand', () => {
  it.each([
    'git commit -m "feat: x"',
    'git -C . commit --amend',
    'npm test && git commit -m x',
    'git add -A; git commit -m x',
  ])('is true for %s', (command) => {
    expect(isCommitCommand(command)).toBe(true);
  });
  it.each(['git status', 'git commit-tree abc', 'npm run commitlint', 'echo hello'])(
    'is false for %s',
    (command) => {
      expect(isCommitCommand(command)).toBe(false);
    },
  );
});

describe('isSecretPath', () => {
  it.each([
    '.env',
    '.env.local',
    'config/.env.production',
    'C:\\repo\\.env',
    'keys/server.pem',
    'home/.ssh/id_rsa',
    'config/credentials.json',
    'deploy/secrets.yaml',
  ])('is true for %s', (path) => {
    expect(isSecretPath(path)).toBe(true);
  });
  it.each([
    '.env.example',
    'src/lib/seo.ts',
    'docs/guidelines/code-quality.md',
    '.claude/hooks/lib/secrets.mjs',
    'src/secrets.ts',
    'docs/guidelines/secrets-and-access.md',
    'docs/credentials-policy.md',
  ])('is false for %s', (path) => {
    expect(isSecretPath(path)).toBe(false);
  });
});
