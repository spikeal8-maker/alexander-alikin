import { z, defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import * as s from "./lib/schemas";

const dateField = () => z.coerce.date();

const ev = s.evidenceLevelSchema;
const ps = s.publicationStatusSchema;

export const profileCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/profile" }),
  schema: z.object({
    fullName: z.string(),
    shortBio50: z.string(),
    shortBio150: z.string(),
    fullBio: z.string(),
    currentRole: z.string(),
    professionalFormula: z.string(),
    humanFormula: z.string(),
    status: ps,
    owner: z.string(),
    publishedAt: dateField().optional(),
    updatedAt: dateField(),
    lastVerifiedAt: dateField(),
    reviewAt: dateField(),
    evidenceLevel: ev,
    sourceUrls: z.array(z.string()).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    topics: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
  }),
});

const projectFields = {
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: ps,
  owner: z.string(),
  publishedAt: dateField(),
  updatedAt: dateField(),
  lastVerifiedAt: dateField(),
  reviewAt: dateField(),
  category: z.enum(["product", "education", "business", "research", "automation"]),
  role: z.string(),
  period: z.string(),
  projectStatus: z.enum(["active", "completed", "paused", "archived"]),
  result: z.string(),
  limitations: z.string().optional(),
  topics: z.array(z.string()).optional().default([]),
  evidenceLevel: ev,
  sourceUrls: z.array(z.string()).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  demoUrl: z.string().optional(),
  repoUrl: z.string().optional(),
};

export const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    ...projectFields,
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const casesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    status: ps,
    owner: z.string(),
    publishedAt: dateField(),
    updatedAt: dateField(),
    lastVerifiedAt: dateField(),
    reviewAt: dateField(),
    project: reference("projects"),
    context: z.string(),
    role: z.string(),
    actions: z.array(z.string()),
    result: z.string(),
    limitations: z.string(),
    topics: z.array(z.string()).optional().default([]),
    evidenceLevel: ev,
    sourceUrls: z.array(z.string()).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

const journalFields = {
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: ps,
  owner: z.string(),
  publishedAt: dateField(),
  updatedAt: dateField(),
  type: z.enum(["story", "thought", "article", "news", "video"]),
  author: z.string().optional(),
  topics: z.array(z.string()).optional().default([]),
  evidenceLevel: ev,
  sourceUrls: z.array(z.string()).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  seoTitle: z.string().optional(),
  proofLevel: z.string().optional(),
};

const withProjects = (extra) =>
  z.object({
    ...journalFields,
    relatedProjects: z.array(reference("projects")).optional(),
    ...extra,
  });

export const storiesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories" }),
  schema: withProjects({}),
});
export const thoughtsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/thoughts" }),
  schema: withProjects({}),
});
export const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: withProjects({}),
});

export const newsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: withProjects({ type: z.literal("news") }),
});

export const nowCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/now" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    status: ps,
    owner: z.string(),
    publishedAt: dateField(),
    updatedAt: dateField(),
    lastVerifiedAt: dateField(),
    reviewAt: dateField(),
    focus: z.string(),
    topics: z.array(z.string()).optional().default([]),
    evidenceLevel: ev,
    sourceUrls: z.array(z.string()).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const factsCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/facts" }),
  schema: z.object({
    statement: z.string(),
    period: z.string().optional(),
    periodNotApplicable: z.boolean().optional().default(false),
    status: ps,
    owner: z.string(),
    publishedAt: dateField().optional(),
    updatedAt: dateField(),
    lastVerifiedAt: dateField(),
    reviewAt: dateField(),
    evidenceLevel: ev,
    sourceUrls: z.array(z.string()),
    permissionIds: z.array(z.string()).optional().default([]),
    topics: z.array(z.string()).optional().default([]),
    limitations: z.string().optional(),
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const mediaCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/media" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    status: ps,
    owner: z.string(),
    publishedAt: dateField().optional(),
    updatedAt: dateField(),
    rightsHolder: z.string(),
    allowedUses: z.array(z.string()),
    alt: z.string(),
    caption: z.string(),
    src: z.string(),
    type: z.enum(["photo", "video", "document", "diagram", "screenshot"]),
    permissionIds: z.array(z.string()).optional().default([]),
    topics: z.array(z.string()).optional().default([]),
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const collections = {
  profile: profileCollection,
  projects: projectsCollection,
  cases: casesCollection,
  stories: storiesCollection,
  thoughts: thoughtsCollection,
  articles: articlesCollection,
  news: newsCollection,
  now: nowCollection,
  facts: factsCollection,
  media: mediaCollection,
};
