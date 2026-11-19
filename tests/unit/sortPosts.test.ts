import { describe, expect, it } from 'vitest';
import { sortPostsByDateDesc } from '../../src/lib/sortPosts';

const post = (slug: string, date: string) => ({ slug, date: new Date(date) });

describe('sortPostsByDateDesc', () => {
  it('orders newest first', () => {
    const sorted = sortPostsByDateDesc([post('a', '2026-12-14'), post('c', '2027-01-04'), post('b', '2026-12-21')]);
    expect(sorted.map((p) => p.slug)).toEqual(['c', 'b', 'a']);
  });
  it('does not mutate the input', () => {
    const input = [post('a', '2026-12-14'), post('b', '2026-12-21')];
    sortPostsByDateDesc(input);
    expect(input.map((p) => p.slug)).toEqual(['a', 'b']);
  });
  it('keeps original order for equal dates (stable)', () => {
    const sorted = sortPostsByDateDesc([post('x', '2026-12-14'), post('y', '2026-12-14')]);
    expect(sorted.map((p) => p.slug)).toEqual(['x', 'y']);
  });
  it('handles an empty list', () => {
    expect(sortPostsByDateDesc([])).toEqual([]);
  });
});
