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

describe('settings (.claude/settings.json)', () => {
  const settings = JSON.parse(readFileSync('.claude/settings.json', 'utf8')) as {
    permissions: { allow: string[]; deny: string[]; ask: string[] };
    hooks: { PreToolUse: { matcher: string; hooks: { command: string }[] }[] };
  };

  it('denies reading .env and key files', () => {
    for (const rule of ['Read(./.env)', 'Read(./.env.local)', 'Read(./**/*.pem)']) {
      expect(settings.permissions.deny).toContain(rule);
    }
  });

  it('denies force pushes and requires approval for merges and releases', () => {
    expect(settings.permissions.deny).toContain('Bash(git push --force*)');
    expect(settings.permissions.ask).toContain('Bash(gh pr merge*)');
    expect(settings.permissions.ask).toContain('Bash(git tag*)');
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
