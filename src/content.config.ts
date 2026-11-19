import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { postSchema } from './lib/postSchema';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/posts' }),
  schema: postSchema,
});

export const collections = { posts };
