import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const evidenceStatus = z.enum([
  'verified',
  'self-reported',
  'requires-verification',
  'not-applicable'
]);

const common = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  topics: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  evidenceStatus: evidenceStatus.default('not-applicable'),
  sourceUrls: z.array(z.string().url()).default([])
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: common.extend({
    status: z.enum(['active', 'development', 'completed', 'archived', 'research']),
    role: z.string(),
    period: z.string().optional(),
    externalUrl: z.string().url().optional(),
    order: z.number().int().default(100)
  })
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stories' }),
  schema: common.extend({
    readingMinutes: z.number().int().positive().default(5)
  })
});

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/thoughts' }),
  schema: common.extend({
    statement: z.string().min(10)
  })
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: common.extend({
    kind: z.enum(['launch', 'publication', 'event', 'update', 'collaboration'])
  })
});

const now = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/now' }),
  schema: common.extend({
    expiresAt: z.coerce.date(),
    priority: z.number().int().default(100)
  })
});

export const collections = { projects, stories, thoughts, news, now };
