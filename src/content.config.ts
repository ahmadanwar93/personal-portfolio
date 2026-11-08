import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string(),
      /** build = engineering project (lacquer tile), study = visual/design study (silver tile) */
      kind: z.enum(['build', 'study']),
      /** optional: pin the engraved figure for the formal edition; otherwise the slug picks one */
      flower: z.enum(['bloom', 'daisy', 'star', 'rose', 'lotus', 'seedhead', 'leaf', 'sprig', 'fern']).optional(),
      status: z.enum(['done', 'in-progress']).default('done'),
      cover: image(),
      coverAlt: z.string(),
      stack: z.array(z.string()).default([]),
      links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    }),
});

export const collections = { posts };
