import { describe, expect, it } from 'vitest';
import {
  commitsAll,
  findSecrets,
  isCommitCommand,
  isSecretPath,
  usesNoVerify,
} from '../../.claude/hooks/lib/secrets.mjs';

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

describe('findSecrets: more token formats', () => {
  const cases: [string, string][] = [
    ['github-token', 'github_pat_' + 'A1b2C3d4E5f6G7h8I9j0K1'],
    ['anthropic-key', 'sk-ant-' + 'api03-abcdefghijklmnopqrst'],
    ['openai-key', 'sk-' + 'abcdefghijklmnopqrstuvwxyz123456'],
    ['stripe-key', 'sk_live_' + 'abcdefghijklmnop'],
    ['google-api-key', 'AIza' + 'SyA1234567890abcdefghijklmnopqrstuv'],
    [
      'jwt',
      'eyJhbGciOiJIUzI1NiJ9' +
        '.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIn0' +
        '.' +
        'abcdefghijklmnopqrstuvwx',
    ],
    ['npm-token', 'npm_' + 'a'.repeat(36)],
    ['bearer-token', 'Authorization: Bearer ' + 'abcdefghijklmnopqrstuvwxyz1234'],
    ['env-secret', 'AWS_SECRET_ACCESS_KEY=' + 'abcdefghijklmnopqrstuvwxyz0123456789ABCD'],
  ];
  it.each(cases)('detects %s', (name, text) => {
    expect(findSecrets(text)).toContain(name);
  });
  it('does not flag short values or ordinary settings', () => {
    expect(findSecrets('API_KEY=changeme')).toEqual([]);
    expect(findSecrets('NODE_ENV=production')).toEqual([]);
  });
});

describe('isCommitCommand: quoted and wrapped commits', () => {
  it.each(['bash -c "git commit -m x"', "sh -c 'git commit'", 'eval "git commit -m x"'])(
    'is true for %s',
    (command) => {
      expect(isCommitCommand(command)).toBe(true);
    },
  );
});

describe('usesNoVerify', () => {
  it.each(['git commit --no-verify -m x', 'git commit -n -m x', 'git commit -an -m x'])(
    'is true for %s',
    (command) => {
      expect(usesNoVerify(command)).toBe(true);
    },
  );
  it.each(['git commit -m "fix: x"', 'git commit -am x', 'git status'])(
    'is false for %s',
    (command) => {
      expect(usesNoVerify(command)).toBe(false);
    },
  );
});

describe('commitsAll', () => {
  it.each(['git commit -a -m x', 'git commit -am x', 'git commit --all -m x'])(
    'is true for %s',
    (command) => {
      expect(commitsAll(command)).toBe(true);
    },
  );
  it.each(['git commit -m x', 'git commit --amend -m x'])('is false for %s', (command) => {
    expect(commitsAll(command)).toBe(false);
  });
});

describe('isSecretPath: case and more secret file names', () => {
  it.each([
    'C:/x/.ENV',
    '.npmrc',
    '.netrc',
    '.pgpass',
    '.git-credentials',
    'android/release.keystore',
    'keys/AuthKey_ABC.p8',
    'infra/terraform.tfstate',
    'gcp/service-account-prod.json',
    'home/.ssh/id_custom_key',
  ])('is true for %s', (path) => {
    expect(isSecretPath(path)).toBe(true);
  });
  it('is false for a document about service accounts', () => {
    expect(isSecretPath('docs/service-accounts.md')).toBe(false);
  });
});

describe('usesNoVerify: abbreviations, quoting and hook overrides', () => {
  it.each([
    'git commit -m x --no-ver',
    'git commit -m x --no-v',
    'git commit --no-ve"rify" -m x',
    "git commit $'--no-verify' -m x",
    'git -c core.hooksPath=/x commit -m x',
    'HUSKY=0 git commit -m x',
  ])('is true for %s', (command) => {
    expect(usesNoVerify(command)).toBe(true);
  });
  it.each(['git commit --no-edit', 'git commit --no-gpg-sign -m x', 'git commit -m "fix: x"'])(
    'is false for %s',
    (command) => {
      expect(usesNoVerify(command)).toBe(false);
    },
  );
});

describe('findSecrets: fewer false positives', () => {
  it.each([
    ['CACHE_KEY=', 'build-cache-key-v1-linux-x64'],
    ['MY_KEY=', 'abcdefghijklmnopqrstuvwxyz'],
    ['Bearer ', 'authentication-scheme-and-more-text'],
  ])('does not flag %s…', (name, value) => {
    expect(findSecrets(name + value)).toEqual([]);
  });
  it('still flags a realistic mixed-case value', () => {
    expect(findSecrets('MY_TOKEN=' + 'Abcdefghij0123456789KLMNOP')).toContain('env-secret');
  });
});
