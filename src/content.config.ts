import { z, defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import {
  createProfileSchema,
  createProjectSchema,
  createCaseSchema,
  createJournalSchema,
  createNewsSchema,
  createNowSchema,
  createFactSchema,
  createMediaSchema,
} from "./lib/schemas";

export const profileCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/profile" }),
  schema: createProfileSchema(),
});

export const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: createProjectSchema({
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const casesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cases" }),
  schema: createCaseSchema({
    project: reference("projects"),
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const storiesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories" }),
  schema: createJournalSchema({
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const thoughtsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/thoughts" }),
  schema: createJournalSchema({
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const articlesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: createJournalSchema({
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const newsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: createNewsSchema({
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const nowCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/now" }),
  schema: createNowSchema({
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const factsCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/facts" }),
  schema: createFactSchema({
    relatedProjects: z.array(reference("projects")).optional(),
  }),
});

export const mediaCollection = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/media" }),
  schema: createMediaSchema({
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
