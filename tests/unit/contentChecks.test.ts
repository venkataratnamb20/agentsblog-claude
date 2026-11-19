import { describe, expect, it } from 'vitest';
import { findImagesMissingAlt } from '../../src/lib/contentChecks';

describe('findImagesMissingAlt', () => {
  it('accepts markdown images with alt text', () => {
    expect(findImagesMissingAlt('![An agent loop](loop.png)')).toEqual([]);
  });
  it('flags markdown images with empty or blank alt text', () => {
    expect(findImagesMissingAlt('![](a.png) and ![   ](b.png "title")')).toEqual([
      'a.png',
      'b.png',
    ]);
  });
  it('accepts html images with alt text in either quote style', () => {
    const html = `<img src="a.png" alt="x"> <img src="b.png" alt='y'>`;
    expect(findImagesMissingAlt(html)).toEqual([]);
  });
  it('flags html images with no or empty alt text', () => {
    expect(findImagesMissingAlt('<img src="a.png"> <img src="b.png" alt="">')).toEqual([
      'a.png',
      'b.png',
    ]);
  });
  it('flags an html image with no src using a placeholder', () => {
    expect(findImagesMissingAlt('<img alt="">')).toEqual(['(unknown)']);
  });
  it('ignores images inside fenced code blocks', () => {
    expect(findImagesMissingAlt('```md\n![](x.png)\n```')).toEqual([]);
  });
  it('returns nothing for text without images', () => {
    expect(findImagesMissingAlt('Just words.')).toEqual([]);
  });
});
