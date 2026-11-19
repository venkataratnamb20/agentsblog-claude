import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findImagesMissingAlt } from '../../src/lib/contentChecks';

const dir = 'content/posts';
const files = readdirSync(dir).filter((f) => /\.mdx?$/.test(f));

describe('post content', () => {
  it.each(files)('%s has alt text on every image', (file) => {
    expect(findImagesMissingAlt(readFileSync(join(dir, file), 'utf8'))).toEqual([]);
  });
});
