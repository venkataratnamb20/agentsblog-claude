import { describe, expect, it } from 'vitest';
import { normalizeTags } from '../../src/lib/tags';

describe('normalizeTags', () => {
  it('trims and lowercases each tag', () => {
    expect(normalizeTags(['  Agents ', 'LLM'])).toEqual(['agents', 'llm']);
  });

  it('removes duplicates after normalising and keeps the first position', () => {
    expect(normalizeTags(['Agents', 'llm', ' agents '])).toEqual(['agents', 'llm']);
  });

  it('drops empty tags', () => {
    expect(normalizeTags(['', '   ', 'rag'])).toEqual(['rag']);
  });

  it('turns inner whitespace into single hyphens', () => {
    expect(normalizeTags(['Tool  Use', 'multi agent'])).toEqual(['tool-use', 'multi-agent']);
  });

  it('does not change the input array', () => {
    const input = [' A ', 'a'];
    normalizeTags(input);
    expect(input).toEqual([' A ', 'a']);
  });

  it('returns an empty list for an empty list', () => {
    expect(normalizeTags([])).toEqual([]);
  });
});
