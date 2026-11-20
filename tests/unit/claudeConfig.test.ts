import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROLES = [
  'pm-orchestrator',
  'product-strategist',
  'solution-architect',
  'ux-ui-designer',
  'frontend-engineer',
  'devops-sre',
  'qa-engineer',
  'security-engineer',
  'code-reviewer',
  'seo-analytics',
  'research-analyst',
  'technical-writer',
  'technical-editor',
  'growth-community',
];
const SKILLS = [
  'new-post',
  'review-pr',
  'security-check',
  'seo-audit',
  'gate-check',
  'release',
  'hotfix',
];
const ALLOWED_TOOLS = ['Read', 'Grep', 'Glob', 'Edit', 'Write', 'Bash', 'WebSearch', 'WebFetch'];

function parse(path: string): { meta: Record<string, string>; body: string } {
  const text = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  expect(match, `${path} must start with a frontmatter block`).not.toBeNull();
  const meta: Record<string, string> = {};
  for (const line of (match?.[1] ?? '').split('\n')) {
    const colon = line.indexOf(':');
    if (colon > 0) meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return { meta, body: match?.[2] ?? '' };
}

describe('subagents (.claude/agents)', () => {
  const dir = '.claude/agents';

  it('has exactly one file per role and nothing else', () => {
    const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
    expect(files.sort()).toEqual(ROLES.map((r) => `${r}.md`).sort());
  });

  it.each(ROLES)('%s has name, trigger description, tools allow-list and model', (role) => {
    const { meta, body } = parse(join(dir, `${role}.md`));
    expect(meta['name']).toBe(role);
    expect(meta['description']).toMatch(/\buse (when|proactively)\b/i);
    expect((meta['description'] ?? '').length).toBeLessThanOrEqual(400);
    const tools = (meta['tools'] ?? '').split(',').map((t) => t.trim());
    expect(tools.length).toBeGreaterThan(0);
    for (const tool of tools) expect(ALLOWED_TOOLS).toContain(tool);
    expect(meta['model']).toBeTruthy();
    expect(body).toContain('## Boundaries');
    expect(body).toContain('## Done when');
  });

  it('gives every role a distinct description', () => {
    const descriptions = ROLES.map((r) => parse(join(dir, `${r}.md`)).meta['description']);
    expect(new Set(descriptions).size).toBe(ROLES.length);
  });

  it.each(['code-reviewer', 'security-engineer'])('%s cannot modify files', (role) => {
    const tools = (parse(join(dir, `${role}.md`)).meta['tools'] ?? '')
      .split(',')
      .map((t) => t.trim());
    expect(tools).not.toContain('Edit');
    expect(tools).not.toContain('Write');
  });
});

describe('skills (.claude/skills)', () => {
  it('has exactly the required skills', () => {
    const dirs = readdirSync('.claude/skills', { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    expect(dirs.sort()).toEqual([...SKILLS].sort());
  });

  it.each(SKILLS)('%s has name, description, steps and done-when', (skill) => {
    const { meta, body } = parse(join('.claude/skills', skill, 'SKILL.md'));
    expect(meta['name']).toBe(skill);
    expect(meta['description']).toMatch(/\buse when\b/i);
    expect(body).toContain('## Steps');
    expect(body).toContain('## Done when');
  });
});

describe('slash commands (.claude/commands)', () => {
  it('every command has a description', () => {
    const dir = '.claude/commands';
    const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
    for (const file of files) {
      expect(parse(join(dir, file)).meta['description'], file).toBeTruthy();
    }
  });
});

const settings = JSON.parse(readFileSync('.claude/settings.json', 'utf8')) as {
  permissions: { allow: string[]; deny: string[]; ask: string[] };
  hooks: {
    PreToolUse: { matcher: string; hooks: { command: string }[] }[];
    PostToolUse: { matcher: string; hooks: { command: string }[] }[];
  };
};

describe('settings permissions (.claude/settings.json)', () => {
  it('denies reading .env and key files', () => {
    for (const rule of ['Read(./.env)', 'Read(./.env.local)', 'Read(./**/*.pem)']) {
      expect(settings.permissions.deny).toContain(rule);
    }
  });

  it('does not deny whole families of ordinary source files', () => {
    for (const rule of ['Read(./**/secrets*)', 'Read(./**/credentials*)']) {
      expect(settings.permissions.deny).not.toContain(rule);
    }
  });

  it('denies specific secret file names', () => {
    for (const rule of ['Read(./**/secrets.json)', 'Read(./**/credentials.json)']) {
      expect(settings.permissions.deny).toContain(rule);
    }
  });

  it('denies force pushes and requires approval for merges and releases', () => {
    expect(settings.permissions.deny).toContain('Bash(git push --force*)');
    expect(settings.permissions.ask).toContain('Bash(gh pr merge*)');
    expect(settings.permissions.ask).toContain('Bash(git tag*)');
  });
});

describe('settings hooks (.claude/settings.json)', () => {
  it('registers an action-log hook that exists on disk', () => {
    const commands = settings.hooks.PostToolUse.flatMap((e) => e.hooks.map((h) => h.command));
    expect(commands.some((c) => c.includes('log-actions.mjs'))).toBe(true);
    expect(existsSync('.claude/hooks/log-actions.mjs')).toBe(true);
  });

  it('registers a secret-blocking hook and a pre-commit test hook that exist on disk', () => {
    const commands = settings.hooks.PreToolUse.flatMap((e) => e.hooks.map((h) => h.command));
    expect(commands.some((c) => c.includes('block-secrets.mjs'))).toBe(true);
    expect(commands.some((c) => c.includes('pre-commit-gate.mjs'))).toBe(true);
    expect(existsSync('.claude/hooks/block-secrets.mjs')).toBe(true);
    expect(existsSync('.claude/hooks/pre-commit-gate.mjs')).toBe(true);
  });
});

describe('multi-tool leftovers', () => {
  it.each(['.agents', '.codex', '.cursor', 'scripts/sync-agents.mjs'])('%s is gone', (path) => {
    expect(existsSync(path)).toBe(false);
  });

  it('Makefile has no sync-agents target', () => {
    expect(readFileSync('Makefile', 'utf8')).not.toContain('sync-agents');
  });
});

describe('settings guardrails (.claude/settings.json)', () => {
  it('allows only narrow commands, not wildcards that can smuggle arguments', () => {
    for (const rule of [
      'Bash(npm run *)',
      'Bash(git push origin feature/*)',
      'Bash(git push -u origin feature/*)',
    ]) {
      expect(settings.permissions.allow).not.toContain(rule);
    }
    expect(settings.permissions.allow).toContain('Bash(git push -u origin HEAD)');
    for (const script of [
      'lint',
      'format:check',
      'typecheck',
      'coverage',
      'build',
      'secrets:scan',
    ]) {
      expect(settings.permissions.allow).toContain(`Bash(npm run ${script})`);
    }
  });

  it('denies the push and commit forms that bypass protection', () => {
    for (const rule of [
      'Bash(git push*--force*)',
      'Bash(git push*:main*)',
      'Bash(git push*:develop*)',
      'Bash(git push*:refs/*)',
      'Bash(git push*+*)',
      'Bash(git push*--delete*)',
      'Bash(git commit*--no-verify*)',
    ]) {
      expect(settings.permissions.deny).toContain(rule);
    }
  });

  it('denies shell reads of env files on a best-effort basis', () => {
    for (const rule of ['Bash(cat *.env*)', 'Bash(type *.env*)']) {
      expect(settings.permissions.deny).toContain(rule);
    }
  });
});

describe('settings protect their own files (.claude/settings.json)', () => {
  it('asks before editing its own guardrails', () => {
    for (const path of [
      '.claude/settings.json',
      '.claude/hooks/**',
      '.husky/**',
      'scripts/scan-secrets.mjs',
      '.github/workflows/**',
      '.claude/settings.local.json',
    ]) {
      expect(settings.permissions.ask).toContain(`Edit(./${path})`);
    }
  });

  it('uses only Edit rules for file edits, because Claude Code ignores Write rules', () => {
    const fileRules = [...settings.permissions.ask, ...settings.permissions.deny];
    expect(fileRules.filter((rule) => rule.startsWith('Write('))).toEqual([]);
  });

  it('has no Bash rule that mixes * with the trailing :* prefix syntax', () => {
    const all = [
      ...settings.permissions.allow,
      ...settings.permissions.ask,
      ...settings.permissions.deny,
    ];
    const mixed = all.filter((rule) => /^Bash\(.*\*.*:\*\)$/.test(rule));
    expect(mixed).toEqual([]);
  });

  it('the secret-blocking hook also covers notebooks', () => {
    const entry = settings.hooks.PreToolUse.find((e) =>
      e.hooks.some((h) => h.command.includes('block-secrets.mjs')),
    );
    expect(entry?.matcher).toContain('NotebookEdit');
  });
});

const RISKY_ALLOWS = [
  'Bash(git diff*)',
  'Bash(git log*)',
  'Bash(git branch*)',
  'Bash(git fetch*)',
  'Bash(npx vitest *)',
  'Bash(npx prettier *)',
  'Bash(npx eslint *)',
];
const NARROW_ALLOWS = [
  'Bash(git diff)',
  'Bash(git diff --stat*)',
  'Bash(git diff --cached*)',
  'Bash(git diff HEAD*)',
  'Bash(git diff develop*)',
  'Bash(git log --oneline*)',
  'Bash(git branch --show-current)',
  'Bash(git branch --list*)',
  'Bash(git fetch origin*)',
  'Bash(npx vitest run*)',
  'Bash(npx prettier --check*)',
];
const DANGEROUS_OPTION_DENIES = [
  'Bash(git*--upload-pack*)',
  'Bash(git*--output*)',
  'Bash(git*--ext-diff*)',
  'Bash(git branch -f*)',
  'Bash(git branch -d*)',
  'Bash(git branch -m*)',
  'Bash(git branch*--delete*)',
  'Bash(npx*--config*)',
  'Bash(npx*--plugin*)',
];

describe('settings least privilege (security review round)', () => {
  it.each(RISKY_ALLOWS)('does not allow the open-ended rule %s', (rule) => {
    expect(settings.permissions.allow).not.toContain(rule);
  });

  it('still allows the narrow read-only forms agents need', () => {
    for (const rule of NARROW_ALLOWS) expect(settings.permissions.allow).toContain(rule);
  });

  it('denies the options that run commands, write files or move branches', () => {
    for (const rule of DANGEROUS_OPTION_DENIES) expect(settings.permissions.deny).toContain(rule);
  });
});

describe('settings deny parity (security review round)', () => {
  it('denies editing every file it denies reading', () => {
    const reads = settings.permissions.deny
      .filter((r) => r.startsWith('Read('))
      .map((r) => r.slice(5));
    const edits = new Set(
      settings.permissions.deny.filter((r) => r.startsWith('Edit(')).map((r) => r.slice(5)),
    );
    expect(reads.length).toBeGreaterThan(0);
    expect(reads.filter((path) => !edits.has(path))).toEqual([]);
  });

  it('denies reading git and netrc credential files', () => {
    for (const path of ['./.git-credentials', './**/.git-credentials', './**/.netrc']) {
      expect(settings.permissions.deny).toContain(`Read(${path})`);
    }
  });
});

const SHELL_READ_DENIES = [
  'Bash(grep*.env*)',
  'Bash(sed*.env*)',
  'Bash(awk*.env*)',
  'Bash(findstr*.env*)',
  'Bash(Select-String*.env*)',
  'Bash(less*.env*)',
  'Bash(more*.env*)',
  'Bash(node -e*.env*)',
  'Bash(python*.env*)',
];
const HOME_READ_DENIES = [
  'Read(~/.netrc)',
  'Read(~/.npmrc)',
  'Read(~/.git-credentials)',
  'Read(~/.ssh/**)',
  'Read(~/.aws/**)',
];
const MORE_ENV_DENIES = ['Read(./**/.env.*.local)', 'Read(./**/.env.prod*)'];

describe('settings close the gaps from the deferred security findings (R03)', () => {
  it.each(SHELL_READ_DENIES)('denies the shell read %s', (rule) => {
    expect(settings.permissions.deny).toContain(rule);
  });

  it('denies npm runs that load a config or plugin from the command line', () => {
    for (const rule of ['Bash(npm*--config*)', 'Bash(npm*--plugin*)']) {
      expect(settings.permissions.deny).toContain(rule);
    }
  });

  it.each([...HOME_READ_DENIES, ...MORE_ENV_DENIES])('denies reading %s', (rule) => {
    expect(settings.permissions.deny).toContain(rule);
  });

  it('denies editing every file it denies reading, including the new ones', () => {
    const edits = new Set(
      settings.permissions.deny.filter((r) => r.startsWith('Edit(')).map((r) => r.slice(5)),
    );
    const reads = settings.permissions.deny
      .filter((r) => r.startsWith('Read('))
      .map((r) => r.slice(5));
    expect(reads.filter((path) => !edits.has(path))).toEqual([]);
  });

  it('registers the push guard on Bash and the file exists', () => {
    const entry = settings.hooks.PreToolUse.find((e) => e.matcher === 'Bash');
    const commands = (entry?.hooks ?? []).map((h) => h.command);
    expect(commands.some((c) => c.includes('push-guard.mjs'))).toBe(true);
    expect(existsSync('.claude/hooks/push-guard.mjs')).toBe(true);
  });
});
