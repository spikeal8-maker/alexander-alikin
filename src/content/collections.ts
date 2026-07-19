import { z, defineCollection, reference } from "astro:content";

export const profileCollection = defineCollection({
  type: "data",
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
    publishedAt: z.date().optional(),
    updatedAt: z.date(),
    lastVerifiedAt: z.date(),
    reviewAt: z.date(),
    evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
    sourceUrls: z.array(z.string().url()).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    topics: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
  }),
});

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
  owner: z.string(),
  publishedAt: z.date(),
  updatedAt: z.date(),
  lastVerifiedAt: z.date(),
  reviewAt: z.date(),
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
  sourceUrls: z.array(z.string().url()).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  demoUrl: z.string().url().optional(),
  repoUrl: z.string().url().optional(),
});

export const projectsCollection = defineCollection({
  type: "content",
  schema: projectSchema,
});

export const caseSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
  owner: z.string(),
  publishedAt: z.date(),
  updatedAt: z.date(),
  lastVerifiedAt: z.date(),
  reviewAt: z.date(),
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
  sourceUrls: z.array(z.string().url()).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export const casesCollection = defineCollection({
  type: "content",
  schema: caseSchema,
});

export const journalSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
  owner: z.string(),
  publishedAt: z.date(),
  updatedAt: z.date(),
  type: z.enum(["story", "thought", "article", "news", "video"]),
  author: z.string().optional(),
  topics: z.array(z.string()).optional().default([]),
  relatedProjects: z.array(reference("projects")).optional(),
  relatedContent: z.array(z.string()).optional().default([]),
  evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
  sourceUrls: z.array(z.string().url()).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  seoTitle: z.string().optional(),
  proofLevel: z.string().optional(),
});

export const storiesCollection = defineCollection({
  type: "content",
  schema: journalSchema,
});

export const thoughtsCollection = defineCollection({
  type: "content",
  schema: journalSchema,
});

export const articlesCollection = defineCollection({
  type: "content",
  schema: journalSchema,
});

export const newsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
    owner: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date(),
    type: z.literal("news"),
    topics: z.array(z.string()).optional().default([]),
    relatedProjects: z.array(reference("projects")).optional(),
    relatedContent: z.array(z.string()).optional().default([]),
    evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
    sourceUrls: z.array(z.string().url()).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
  }),
});

export const nowSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
  owner: z.string(),
  publishedAt: z.date(),
  updatedAt: z.date(),
  lastVerifiedAt: z.date(),
  reviewAt: z.date(),
  focus: z.string(),
  relatedProjects: z.array(reference("projects")).optional(),
  topics: z.array(z.string()).optional().default([]),
  relatedContent: z.array(z.string()).optional().default([]),
  evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
  sourceUrls: z.array(z.string().url()).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export const nowCollection = defineCollection({
  type: "content",
  schema: nowSchema,
});

export const factSchema = z.object({
  statement: z.string(),
  period: z.string(),
  periodNotApplicable: z.boolean().optional().default(false),
  status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
  owner: z.string(),
  publishedAt: z.date().optional(),
  updatedAt: z.date(),
  lastVerifiedAt: z.date(),
  reviewAt: z.date(),
  evidenceLevel: z.enum(["author_statement", "public_source", "document_verified"]),
  sourceUrls: z.array(z.string().url()),
  permissionIds: z.array(z.string()).optional().default([]),
  relatedProjects: z.array(reference("projects")).optional(),
  topics: z.array(z.string()).optional().default([]),
  limitations: z.string().optional(),
});

export const factsCollection = defineCollection({
  type: "data",
  schema: factSchema,
});

export const mediaSchema = z.object({
  title: z.string(),
  slug: z.string(),
  status: z.enum(["draft", "review", "ready", "published", "blocked", "archived"]),
  owner: z.string(),
  publishedAt: z.date().optional(),
  updatedAt: z.date(),
  rightsHolder: z.string(),
  allowedUses: z.array(z.string()),
  alt: z.string(),
  caption: z.string(),
  src: z.string(),
  type: z.enum(["photo", "video", "document", "diagram", "screenshot"]),
  permissionIds: z.array(z.string()).optional().default([]),
  relatedProjects: z.array(reference("projects")).optional(),
  topics: z.array(z.string()).optional().default([]),
});

export const mediaCollection = defineCollection({
  type: "data",
  schema: mediaSchema,
});
