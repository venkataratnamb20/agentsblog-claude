import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// `site` is the production domain, set via SITE_URL when the domain is provisioned
// (Asana: hosting, environments, domain & HTTPS).
export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  integrations: [mdx(), sitemap()],
});
