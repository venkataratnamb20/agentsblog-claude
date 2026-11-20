import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Acceptance tests for the editorial and content QA checklist (Asana task 1220692713231022). The task
// lists what every post must pass before approval. The checklist lives in the editorial style guide.
const read = (path: string) =>
  existsSync(path) ? readFileSync(path, 'utf8').replace(/\r\n/g, '\n') : '';

const guide = read('docs/guidelines/editorial-style-guide.md');
const section = (heading: string) => guide.split(`## ${heading}`)[1]?.split('\n## ')[0] ?? '';
const checklist = section('Content QA checklist');
const items = checklist.split('\n').filter((line) => line.startsWith('- [ ] '));

// One entry per line of the Asana checklist, with a pattern that must appear in an item.
const ASANA_ITEMS: ReadonlyArray<readonly [string, RegExp]> = [
  ['every factual claim cited to a primary source', /facts match the sources/i],
  ['code samples run and tested, with versions pinned', /pinned/i],
  ['code sample dependencies pinned', /dependencies are pinned/i],
  ['code samples tested in CI', /tested in CI/i],
  ['original writing, no copied passages', /original writing/i],
  ['quotes attributed', /quotes? (are|is) attributed/i],
  ['images and diagrams have alt text', /alt text/i],
  ['all links work', /links work/i],
  ['SEO fields complete including internal links', /internal links/i],
  ['AI assistance noted', /AI assistance is noted/i],
  ['Venkat has reviewed', /Venkat/],
];

describe('the checklist covers every line of the Asana task', () => {
  it.each(ASANA_ITEMS)('has an item for: %s', (_name, pattern) => {
    expect(
      items.some((item) => pattern.test(item)),
      String(pattern),
    ).toBe(true);
  });

  it('says how each item is checked', () => {
    for (const item of items) expect(item, item).toMatch(/: .{8,}/);
  });

  it('says plainly that "tested in CI" is not available, and what to record', () => {
    const ci = items.find((item) => /tested in CI/i.test(item)) ?? '';
    expect(ci.toLowerCase()).toContain('not available');
    expect(ci).toContain('QA comment');
    expect(ci.toLowerCase()).toContain('no ci job');
  });

  it('names only npm scripts that exist in package.json', () => {
    const scripts = Object.keys(JSON.parse(read('package.json')).scripts ?? {});
    const named = [...checklist.matchAll(/npm run ([a-z:-]+)/g)].map((match) => match[1]);
    expect(named.length).toBeGreaterThan(0);
    for (const script of named) expect(scripts, script).toContain(script);
  });

  it('keeps at least 21 items and closes internal links with the SEO item', () => {
    expect(items.length).toBeGreaterThanOrEqual(21);
    const seo = items.find((item) => /SEO basics/.test(item)) ?? '';
    expect(seo).toMatch(/internal links/i);
    expect(items.filter((item) => /internal links/i.test(item))).toHaveLength(1);
  });

  it('still ends with the approval request, so it is the last thing done', () => {
    expect(items.at(-1)).toMatch(/Approval is requested from Venkat/);
  });
});

describe('the AI assistance section', () => {
  const policy = section('AI assistance');

  it('exists and says what is disclosed and where', () => {
    expect(policy.length).toBeGreaterThan(0);
    expect(policy.toLowerCase()).toContain('end of the post');
    expect(policy).toMatch(/every post/i);
  });

  it('says Venkat reviews every post before publication, and no one else approves it', () => {
    expect(policy).toMatch(/Venkat reviews every post/);
    expect(guide).toContain('Venkat alone approves `draft: false`');
  });

  it('records that Venkat decided the disclosure and its wording', () => {
    expect(policy).toContain('Decided by Venkat, 20 Nov 2026');
    expect(policy).toContain('Status: approved');
    expect(policy).not.toMatch(/proposed wording|Decision for Venkat/);
    expect(policy).toContain('needs Venkat');
  });

  it('gives a note that a post can use as written', () => {
    const note = policy.split('\n').find((line) => line.startsWith('> ')) ?? '';
    expect(note.length).toBeGreaterThan(20);
    expect(note).toMatch(/\bAI\b/);
  });

  it('claims only what the process guarantees: no human editor, the owner approves', () => {
    const note = policy.split('\n').find((line) => line.startsWith('> ')) ?? '';
    expect(note).not.toMatch(/human (reviewer|editor)/i);
    expect(note.toLowerCase()).toContain('approved by the blog owner');
    expect(policy.toLowerCase()).toContain('the one human step');
  });

  it('has the editor re-check the note if Venkat changes the wording', () => {
    expect(policy).toMatch(/re-checks the note/);
  });
});
