import { z } from "zod";

const dateField = () => z.coerce.date();

export const evidenceLevelSchema = z.enum([
  "author_statement",
  "public_source",
  "document_verified",
]);

export type EvidenceLevel = z.infer<typeof evidenceLevelSchema>;

export const publicationStatusSchema = z.enum([
  "draft",
  "review",
  "ready",
  "published",
  "blocked",
  "archived",
]);

export type PublicationStatus = z.infer<typeof publicationStatusSchema>;

export const urlSchema = z.string().url();

const validUrlOrEmpty = z
  .string()
  .refine((val) => val === "" || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL or empty string",
  });

export const profileSchema = z.object({
  fullName: z.string(),
  shortBio50: z.string(),
  shortBio150: z.string(),
  fullBio: z.string(),
  currentRole: z.string(),
  professionalFormula: z.string(),
  humanFormula: z.string(),
  status: publicationStatusSchema,
  owner: z.string(),
  publishedAt: dateField().optional(),
  updatedAt: dateField(),
  lastVerifiedAt: dateField(),
  reviewAt: dateField(),
  evidenceLevel: evidenceLevelSchema,
  sourceUrls: z.array(urlSchema).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  topics: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export const projectSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    status: publicationStatusSchema,
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
    relatedContent: z.array(z.string()).optional().default([]),
    evidenceLevel: evidenceLevelSchema,
    sourceUrls: z.array(urlSchema).optional().default([]),
    permissionIds: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
    demoUrl: validUrlOrEmpty.optional(),
    repoUrl: validUrlOrEmpty.optional(),
  })
  .refine(
    (data) => {
      if (
        data.evidenceLevel === "document_verified" &&
        (!data.sourceUrls || data.sourceUrls.length === 0)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "document_verified requires at least one valid sourceUrl",
      path: ["sourceUrls"],
    },
  );

export const caseSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: publicationStatusSchema,
  owner: z.string(),
  publishedAt: dateField(),
  updatedAt: dateField(),
  lastVerifiedAt: dateField(),
  reviewAt: dateField(),
  context: z.string(),
  role: z.string(),
  actions: z.array(z.string()),
  result: z.string(),
  limitations: z.string(),
  topics: z.array(z.string()).optional().default([]),
  relatedContent: z.array(z.string()).optional().default([]),
  evidenceLevel: evidenceLevelSchema,
  sourceUrls: z.array(urlSchema).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export const journalSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: publicationStatusSchema,
  owner: z.string(),
  publishedAt: dateField(),
  updatedAt: dateField(),
  type: z.enum(["story", "thought", "article", "news", "video"]),
  author: z.string().optional(),
  topics: z.array(z.string()).optional().default([]),
  relatedContent: z.array(z.string()).optional().default([]),
  evidenceLevel: evidenceLevelSchema,
  sourceUrls: z.array(urlSchema).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  seoTitle: z.string().optional(),
  proofLevel: z.string().optional(),
});

export const newsSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: publicationStatusSchema,
  owner: z.string(),
  publishedAt: dateField(),
  updatedAt: dateField(),
  type: z.literal("news"),
  topics: z.array(z.string()).optional().default([]),
  relatedContent: z.array(z.string()).optional().default([]),
  evidenceLevel: evidenceLevelSchema,
  sourceUrls: z.array(urlSchema).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export const nowSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: publicationStatusSchema,
  owner: z.string(),
  publishedAt: dateField(),
  updatedAt: dateField(),
  lastVerifiedAt: dateField(),
  reviewAt: dateField(),
  focus: z.string(),
  topics: z.array(z.string()).optional().default([]),
  relatedContent: z.array(z.string()).optional().default([]),
  evidenceLevel: evidenceLevelSchema,
  sourceUrls: z.array(urlSchema).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export const factSchema = z
  .object({
    statement: z.string(),
    period: z.string().optional(),
    periodNotApplicable: z.boolean().optional().default(false),
    status: publicationStatusSchema,
    owner: z.string(),
    publishedAt: dateField().optional(),
    updatedAt: dateField(),
    lastVerifiedAt: dateField(),
    reviewAt: dateField(),
    evidenceLevel: evidenceLevelSchema,
    sourceUrls: z.array(urlSchema),
    permissionIds: z.array(z.string()).optional().default([]),
    topics: z.array(z.string()).optional().default([]),
    limitations: z.string().optional(),
  })
  .refine(
    (data) => {
      const hasPeriod = data.period && data.period.trim().length > 0;
      const hasFlag = data.periodNotApplicable === true;
      return hasPeriod || hasFlag;
    },
    {
      message: "Fact must have non-empty period or periodNotApplicable: true",
      path: ["period"],
    },
  );

export const mediaSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    status: publicationStatusSchema,
    owner: z.string(),
    publishedAt: dateField().optional(),
    updatedAt: dateField(),
    rightsHolder: z.string().min(1, "rightsHolder is required"),
    allowedUses: z.array(z.string()).min(1, "At least one allowed use is required"),
    alt: z.string().min(1, "alt text is required"),
    caption: z.string().min(1, "caption is required"),
    src: z.string(),
    type: z.enum(["photo", "video", "document", "diagram", "screenshot"]),
    permissionIds: z.array(z.string()).optional().default([]),
    topics: z.array(z.string()).optional().default([]),
  })
  .refine((data) => data.src.length > 0, { message: "src must not be empty", path: ["src"] });
