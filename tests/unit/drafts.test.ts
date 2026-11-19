import { describe, expect, it } from 'vitest';
import { filterVisible } from '../../src/lib/drafts';

const posts = [
  { id: 'a', data: { draft: false } },
  { id: 'b', data: { draft: true } },
];

describe('filterVisible', () => {
  it('hides drafts by default', () => {
    expect(filterVisible(posts, false).map((p) => p.id)).toEqual(['a']);
  });
  it('shows drafts when previewing', () => {
    expect(filterVisible(posts, true).map((p) => p.id)).toEqual(['a', 'b']);
  });
});
