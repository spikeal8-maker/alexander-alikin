import { z, defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";

const dateField = () => z.coerce.date();

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
    status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
    owner: z.string(),
    publishedAt: dateField().optional(),
    updatedAt: dateField(),
    lastVerifiedAt: dateField(),
    reviewAt: dateField(),
    evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
    sourceUrls: z.array(z.string()).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    topics: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
  }),
});

export const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
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
    relatedProjects: z.array(reference("projects")).optional(),
    relatedContent: z.array(z.string()).optional().default([]),
    evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
    sourceUrls: z.array(z.string()).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
  }),
});

export const casesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
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
    relatedProjects: z.array(reference("projects")).optional(),
    relatedContent: z.array(z.string()).optional().default([]),
    evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
    sourceUrls: z.array(z.string()).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
  }),
});

export const journalSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
  owner: z.string(),
  publishedAt: dateField(),
  updatedAt: dateField(),
  type: z.enum(["story", "thought", "article", "news", "video"]),
  author: z.string().optional(),
  topics: z.array(z.string()).optional().default([]),
  relatedProjects: z.array(reference("projects")).optional(),
  relatedContent: z.array(z.string()).optional().default([]),
  evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
  sourceUrls: z.array(z.string()).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  seoTitle: z.string().optional(),
  proofLevel: z.string().optional(),
});

export const storiesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories" }),
  schema: journalSchema,
});
export const thoughtsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/thoughts" }),
  schema: journalSchema,
});
export const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: journalSchema,
});

export const newsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
    owner: z.string(),
    publishedAt: dateField(),
    updatedAt: dateField(),
    type: z.literal("news"),
    topics: z.array(z.string()).optional().default([]),
    relatedProjects: z.array(reference("projects")).optional(),
    relatedContent: z.array(z.string()).optional().default([]),
    evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
    sourceUrls: z.array(z.string()).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
  }),
});

export const nowCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/now" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
    owner: z.string(),
    publishedAt: dateField(),
    updatedAt: dateField(),
    lastVerifiedAt: dateField(),
    reviewAt: dateField(),
    focus: z.string(),
    relatedProjects: z.array(reference("projects")).optional(),
    topics: z.array(z.string()).optional().default([]),
    relatedContent: z.array(z.string()).optional().default([]),
    evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
    sourceUrls: z.array(z.string()).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
  }),
});

export const factsCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/facts" }),
  schema: z.object({
    statement: z.string(),
    period: z.string(),
    periodNotApplicable: z.boolean().optional().default(false),
    status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
    owner: z.string(),
    publishedAt: dateField().optional(),
    updatedAt: dateField(),
    lastVerifiedAt: dateField(),
    reviewAt: dateField(),
    evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
    sourceUrls: z.array(z.string()),
    permissionIds: z.array(z.string()).optional().default([]),
    relatedProjects: z.array(reference("projects")).optional(),
    topics: z.array(z.string()).optional().default([]),
    limitations: z.string().optional(),
  }),
});

export const mediaCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/media" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
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
    relatedProjects: z.array(reference("projects")).optional(),
    topics: z.array(z.string()).optional().default([]),
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
