import { z } from 'astro/zod';

/** Front-matter schema for posts. Used by the Astro content collection, so an invalid post fails the build. */
export const postSchema = z.object({
  title: z.string().min(1).max(70),
  description: z.string().min(1).max(160),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export type PostData = z.infer<typeof postSchema>;
