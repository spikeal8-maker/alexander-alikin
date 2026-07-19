import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

if (!fs.existsSync(distDir)) {
  console.error("BLOCKED: dist/ not found. Run build first.");
  process.exit(1);
}

const EXPECTED_DYNAMIC_ROUTES = [
  "projects/test-platform/index.html",
  "journal/stories/test-story/index.html",
  "journal/thoughts/test-thought/index.html",
  "journal/articles/test-article/index.html",
  "journal/news/platform-launch/index.html",
];

const BLOCKED_ROUTES = ["journal/stories/draft-test/index.html"];

const errors = [];

for (const route of EXPECTED_DYNAMIC_ROUTES) {
  const fullPath = path.join(distDir, route);
  if (!fs.existsSync(fullPath)) {
    errors.push(`MISSING expected dynamic route: ${route}`);
  }
}

for (const route of BLOCKED_ROUTES) {
  const fullPath = path.join(distDir, route);
  if (fs.existsSync(fullPath)) {
    errors.push(`BLOCKED route exists (should not): ${route}`);
  }
}

if (errors.length) {
  console.error("DYNAMIC ROUTE ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}

const generated = EXPECTED_DYNAMIC_ROUTES.filter((r) => fs.existsSync(path.join(distDir, r)));
console.log(
  `Generated dynamic routes: PASS (${generated.length}/${EXPECTED_DYNAMIC_ROUTES.length} confirmed, ${BLOCKED_ROUTES.length} blocked verified)`,
);
