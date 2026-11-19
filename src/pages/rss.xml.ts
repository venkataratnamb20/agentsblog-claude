import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_NAME, includeDrafts, siteUrl } from '../config';
import { filterVisible } from '../lib/drafts';
import { sortPostsByDateDesc } from '../lib/sortPosts';

export async function GET(context: APIContext) {
  const entries = filterVisible(await getCollection('posts'), includeDrafts);
  const posts = sortPostsByDateDesc(entries.map((entry) => ({ id: entry.id, ...entry.data })));
  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: siteUrl(context.site),
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      pubDate: post.date,
      link: `/posts/${post.id}/`,
    })),
  });
}
