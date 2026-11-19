import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function load() {
  vi.resetModules();
  return import('../../src/config');
}

describe('site config', () => {
  beforeEach(() => {
    vi.stubEnv('DEV', false);
    vi.stubEnv('PREVIEW_DRAFTS', '');
    vi.stubEnv('ALLOW_INDEXING', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('hides drafts in a normal production build', async () => {
    expect((await load()).includeDrafts).toBe(false);
  });

  it('shows drafts when PREVIEW_DRAFTS is true', async () => {
    vi.stubEnv('PREVIEW_DRAFTS', 'true');
    expect((await load()).includeDrafts).toBe(true);
  });

  it('shows drafts in dev', async () => {
    vi.stubEnv('DEV', true);
    expect((await load()).includeDrafts).toBe(true);
  });

  it('ignores other PREVIEW_DRAFTS values', async () => {
    vi.stubEnv('PREVIEW_DRAFTS', '1');
    expect((await load()).includeDrafts).toBe(false);
  });

  it('stays noindex unless ALLOW_INDEXING is exactly true', async () => {
    expect((await load()).allowIndexing).toBe(false);
    vi.stubEnv('ALLOW_INDEXING', 'yes');
    expect((await load()).allowIndexing).toBe(false);
    vi.stubEnv('ALLOW_INDEXING', 'true');
    expect((await load()).allowIndexing).toBe(true);
  });

  it('uses the configured site URL, else the local default', async () => {
    const { siteUrl } = await load();
    expect(siteUrl(new URL('https://example.com'))).toBe('https://example.com/');
    expect(siteUrl(undefined)).toBe('http://localhost:4321');
  });
});
