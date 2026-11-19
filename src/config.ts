export const SITE_NAME = 'Agents Blog';
export const SITE_DESCRIPTION =
  'Practical, research-backed writing on AI agents for engineers building production systems.';
const DEFAULT_SITE = 'http://localhost:4321';

/** Drafts are shown in dev or when PREVIEW_DRAFTS=true; never in a normal production build. */
export const includeDrafts: boolean = import.meta.env.DEV || process.env.PREVIEW_DRAFTS === 'true';

/** Only the production deploy sets ALLOW_INDEXING=true; staging stays noindex. */
export const allowIndexing: boolean = process.env.ALLOW_INDEXING === 'true';

export const siteUrl = (site: URL | undefined): string => site?.toString() ?? DEFAULT_SITE;
