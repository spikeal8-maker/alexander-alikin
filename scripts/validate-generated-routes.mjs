import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(ROOT, "dist");

if (!fs.existsSync(distDir)) {
  console.error("BLOCKED: dist/ not found. Run build first.");
  process.exit(1);
}

const REAL_ROUTES = [
  "projects/izo-asa/index.html",
  "projects/engineering-education/index.html",
  "journal/articles/project-learning/index.html",
  "journal/stories/children-and-robots/index.html",
  "journal/stories/one-method/index.html",
  "journal/thoughts/projects-over-theory/index.html",
  "journal/thoughts/ai-as-exoskeleton/index.html",
  "journal/thoughts/business-as-system/index.html",
];

const BLOCKED_ROUTES = [
  "projects/test-platform/index.html",
  "journal/articles/test-article/index.html",
  "journal/stories/test-story/index.html",
  "journal/thoughts/test-thought/index.html",
  "journal/stories/draft-test/index.html",
];

const errors = [];

for (const route of REAL_ROUTES) {
  if (!fs.existsSync(path.join(distDir, route))) {
    errors.push(`MISSING: ${route}`);
  }
}

for (const route of BLOCKED_ROUTES) {
  if (fs.existsSync(path.join(distDir, route))) {
    errors.push(`BLOCKED route should not exist: ${route}`);
  }
}

if (errors.length) {
  console.error("DYNAMIC ROUTE ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}

const found = REAL_ROUTES.filter((r) => fs.existsSync(path.join(distDir, r)));
const blocked = BLOCKED_ROUTES.filter((r) => !fs.existsSync(path.join(distDir, r)));
console.log(
  `Dynamic routes: PASS (${found.length}/${REAL_ROUTES.length} real, ${blocked.length}/${BLOCKED_ROUTES.length} blocked absent)`,
);
