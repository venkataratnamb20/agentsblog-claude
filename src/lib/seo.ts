export interface Crumb {
  name: string;
  url: string;
}

export interface ArticleInput {
  title: string;
  description: string;
  date: Date;
  updated?: Date | undefined;
  url: string;
  siteName: string;
}

/** `Page | Site`, or just the site name for the home page. */
export function pageTitle(title: string, siteName: string): string {
  return title ? `${title} | ${siteName}` : siteName;
}

/** Absolute canonical URL: single slash join, query string and hash removed. */
export function canonicalUrl(site: string, path: string): string {
  const clean = path.replace(/[?#].*$/, '').replace(/^\/+/, '');
  return `${site.replace(/\/+$/, '')}/${clean}`;
}

/** schema.org Article structured data. */
export function articleJsonLd(input: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    datePublished: input.date.toISOString(),
    dateModified: (input.updated ?? input.date).toISOString(),
    mainEntityOfPage: input.url,
    author: { '@type': 'Organization', name: input.siteName },
  };
}

/** schema.org BreadcrumbList structured data; positions start at 1. */
export function breadcrumbJsonLd(crumbs: readonly Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/** Value for the robots meta tag. Only production is indexable. */
export function robotsMeta(allowIndexing: boolean): string {
  return allowIndexing ? 'index, follow' : 'noindex, nofollow';
}

/** robots.txt body; staging disallows everything, production points at the sitemap. */
export function robotsTxt(site: string, allowIndexing: boolean): string {
  if (!allowIndexing) return 'User-agent: *\nDisallow: /\n';
  return `User-agent: *\nAllow: /\nSitemap: ${canonicalUrl(site, '/sitemap-index.xml')}\n`;
}
