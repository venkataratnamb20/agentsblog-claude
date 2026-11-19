import { describe, expect, it } from 'vitest';
import { readingTime } from '../../src/lib/readingTime';

const words = (n: number) => Array.from({ length: n }, () => 'word').join(' ');

describe('readingTime', () => {
  it('returns at least 1 minute for short or empty text', () => {
    expect(readingTime('')).toBe(1);
    expect(readingTime('hello world')).toBe(1);
  });
  it('rounds up at 220 words per minute', () => {
    expect(readingTime(words(220))).toBe(1);
    expect(readingTime(words(221))).toBe(2);
    expect(readingTime(words(1100))).toBe(5);
  });
  it('ignores extra whitespace', () => {
    expect(readingTime(`  ${words(10)} \n\n `)).toBe(1);
  });
});
