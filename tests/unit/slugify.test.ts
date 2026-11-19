import { describe, expect, it } from 'vitest';
import { slugify } from '../../src/lib/slugify';

describe('slugify', () => {
  it('lowercases and joins words with hyphens', () => {
    expect(slugify('What is an AI Agent?')).toBe('what-is-an-ai-agent');
  });
  it('collapses punctuation and repeated separators', () => {
    expect(slugify('Tool calling & MCP -- explained!')).toBe('tool-calling-mcp-explained');
  });
  it('strips accents', () => {
    expect(slugify('Café résumé')).toBe('cafe-resume');
  });
  it('trims leading and trailing separators', () => {
    expect(slugify('  --Hello--  ')).toBe('hello');
  });
  it('returns an empty string when nothing usable remains', () => {
    expect(slugify('?!')).toBe('');
  });
});
