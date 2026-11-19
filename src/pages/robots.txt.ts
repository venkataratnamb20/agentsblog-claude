import type { APIRoute } from 'astro';
import { allowIndexing, siteUrl } from '../config';
import { robotsTxt } from '../lib/seo';

export const GET: APIRoute = ({ site }) =>
  new Response(robotsTxt(siteUrl(site), allowIndexing), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
