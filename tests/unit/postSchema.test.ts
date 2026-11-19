import { describe, expect, it } from 'vitest';
import { postSchema } from '../../src/lib/postSchema';

const valid = {
  title: 'Tool calling & MCP',
  description: 'How tools reach agents.',
  date: '2026-12-14',
};

describe('postSchema', () => {
  it('accepts valid front-matter and applies defaults', () => {
    const result = postSchema.parse(valid);
    expect(result.tags).toEqual([]);
    expect(result.draft).toBe(false);
    expect(result.date).toBeInstanceOf(Date);
  });
  it('rejects a missing title', () => {
    expect(postSchema.safeParse({ ...valid, title: undefined }).success).toBe(false);
  });
  it('rejects a title over 70 characters', () => {
    expect(postSchema.safeParse({ ...valid, title: 'x'.repeat(71) }).success).toBe(false);
  });
  it('rejects a description over 160 characters', () => {
    expect(postSchema.safeParse({ ...valid, description: 'x'.repeat(161) }).success).toBe(false);
  });
  it('rejects an invalid date', () => {
    expect(postSchema.safeParse({ ...valid, date: 'not a date' }).success).toBe(false);
  });
  it('accepts an optional updated date', () => {
    expect(postSchema.parse({ ...valid, updated: '2027-01-02' }).updated).toBeInstanceOf(Date);
  });
});
