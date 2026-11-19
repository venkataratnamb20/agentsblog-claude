import { describe, expect, it } from 'vitest';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  canonicalUrl,
  pageTitle,
  robotsMeta,
  robotsTxt,
} from '../../src/lib/seo';

describe('pageTitle', () => {
  it('appends the site name', () => {
    expect(pageTitle('Tool calling', 'Agents Blog')).toBe('Tool calling | Agents Blog');
  });
  it('returns only the site name when there is no page title', () => {
    expect(pageTitle('', 'Agents Blog')).toBe('Agents Blog');
  });
});

describe('canonicalUrl', () => {
  it('joins site and path with a single slash', () => {
    expect(canonicalUrl('https://example.com/', '/posts/a/')).toBe('https://example.com/posts/a/');
  });
  it('accepts a path without a leading slash', () => {
    expect(canonicalUrl('https://example.com', 'posts/a')).toBe('https://example.com/posts/a');
  });
  it('strips query string and hash', () => {
    expect(canonicalUrl('https://example.com', '/posts/a?utm=1#x')).toBe(
      'https://example.com/posts/a',
    );
  });
  it('keeps the home page as a trailing slash', () => {
    expect(canonicalUrl('https://example.com', '/')).toBe('https://example.com/');
  });
});

describe('articleJsonLd', () => {
  const base = {
    title: 'T',
    description: 'D',
    date: new Date('2026-12-14T00:00:00Z'),
    url: 'https://example.com/posts/t/',
    siteName: 'Agents Blog',
  };
  it('builds schema.org Article data', () => {
    expect(articleJsonLd(base)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'T',
      description: 'D',
      datePublished: '2026-12-14T00:00:00.000Z',
      dateModified: '2026-12-14T00:00:00.000Z',
      mainEntityOfPage: 'https://example.com/posts/t/',
      author: { '@type': 'Organization', name: 'Agents Blog' },
    });
  });
  it('uses the updated date for dateModified when present', () => {
    const data = articleJsonLd({ ...base, updated: new Date('2027-01-02T00:00:00Z') });
    expect(data.dateModified).toBe('2027-01-02T00:00:00.000Z');
    expect(data.datePublished).toBe('2026-12-14T00:00:00.000Z');
  });
});

describe('breadcrumbJsonLd', () => {
  it('numbers each crumb from 1', () => {
    expect(
      breadcrumbJsonLd([
        { name: 'Home', url: 'https://example.com/' },
        { name: 'Post', url: 'https://example.com/posts/a/' },
      ]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/' },
        { '@type': 'ListItem', position: 2, name: 'Post', item: 'https://example.com/posts/a/' },
      ],
    });
  });
});

describe('indexing controls', () => {
  it('allows indexing on production', () => {
    expect(robotsMeta(true)).toBe('index, follow');
    expect(robotsTxt('https://example.com/', true)).toBe(
      'User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap-index.xml\n',
    );
  });
  it('blocks indexing on staging', () => {
    expect(robotsMeta(false)).toBe('noindex, nofollow');
    expect(robotsTxt('https://staging.example.com', false)).toBe('User-agent: *\nDisallow: /\n');
  });
});
