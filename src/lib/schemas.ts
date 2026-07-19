import { z } from "zod";

const dateField = () => z.coerce.date();

export const evidenceLevelSchema = z.enum([
  "author_statement",
  "public_source",
  "document_verified",
]);

export const publicationStatusSchema = z.enum([
  "draft",
  "review",
  "ready",
  "published",
  "blocked",
  "archived",
]);

export const urlField = z.string().url();

export const baseProfile = {
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
  sourceUrls: z.array(urlField).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  topics: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
};

export function createProfileSchema() {
  return z.object({ ...baseProfile });
}

export const baseProject = {
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
  evidenceLevel: evidenceLevelSchema,
  sourceUrls: z.array(urlField).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  demoUrl: urlField.optional().or(z.literal("")),
  repoUrl: urlField.optional().or(z.literal("")),
};

export function createProjectSchema(extra: Record<string, z.ZodTypeAny> = {}) {
  return z.object({ ...baseProject, ...extra }).refine(
    (data) => {
      if (
        data.evidenceLevel === "document_verified" &&
        (!data.sourceUrls || data.sourceUrls.length === 0)
      ) {
        return false;
      }
      return true;
    },
    { message: "document_verified requires at least one sourceUrl", path: ["sourceUrls"] },
  );
}

export const baseCase = {
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
  evidenceLevel: evidenceLevelSchema,
  sourceUrls: z.array(urlField).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
};

export function createCaseSchema(extra: Record<string, z.ZodTypeAny> = {}) {
  return z.object({ ...baseCase, ...extra });
}

export const baseJournal = {
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
  evidenceLevel: evidenceLevelSchema,
  sourceUrls: z.array(urlField).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  seoTitle: z.string().optional(),
  proofLevel: z.string().optional(),
};

export function createJournalSchema(extra: Record<string, z.ZodTypeAny> = {}) {
  return z.object({ ...baseJournal, ...extra });
}

export const baseNews = {
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  status: publicationStatusSchema,
  owner: z.string(),
  publishedAt: dateField(),
  updatedAt: dateField(),
  type: z.literal("news"),
  topics: z.array(z.string()).optional().default([]),
  evidenceLevel: evidenceLevelSchema,
  sourceUrls: z.array(urlField).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
};

export function createNewsSchema(extra: Record<string, z.ZodTypeAny> = {}) {
  return z.object({ ...baseNews, ...extra });
}

export const baseNow = {
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
  evidenceLevel: evidenceLevelSchema,
  sourceUrls: z.array(urlField).optional().default([]),
  permissionIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
};

export function createNowSchema(extra: Record<string, z.ZodTypeAny> = {}) {
  return z.object({ ...baseNow, ...extra });
}

export function createFactSchema(extra: Record<string, z.ZodTypeAny> = {}) {
  return z
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
      sourceUrls: z.array(urlField),
      permissionIds: z.array(z.string()).optional().default([]),
      topics: z.array(z.string()).optional().default([]),
      limitations: z.string().optional(),
      ...extra,
    })
    .refine(
      (data) => {
        const hasPeriod = data.period && data.period.trim().length > 0;
        return hasPeriod || data.periodNotApplicable === true;
      },
      { message: "Fact must have non-empty period or periodNotApplicable: true", path: ["period"] },
    );
}

export function createMediaSchema(extra: Record<string, z.ZodTypeAny> = {}) {
  return z.object({
    title: z.string(),
    slug: z.string(),
    status: publicationStatusSchema,
    owner: z.string(),
    publishedAt: dateField().optional(),
    updatedAt: dateField(),
    rightsHolder: z.string().min(1, "rightsHolder required"),
    allowedUses: z.array(z.string()).min(1, "allowedUses required"),
    alt: z.string().min(1, "alt required"),
    caption: z.string().min(1, "caption required"),
    src: z.string().min(1, "src required"),
    type: z.enum(["photo", "video", "document", "diagram", "screenshot"]),
    permissionIds: z.array(z.string()).optional().default([]),
    topics: z.array(z.string()).optional().default([]),
    ...extra,
  });
}
