import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const CANONICAL_ROUTES = [
  "/",
  "/about/",
  "/projects/",
  "/projects/[slug]/",
  "/business/",
  "/education/",
  "/journal/",
  "/journal/stories/",
  "/journal/stories/[slug]/",
  "/journal/thoughts/",
  "/journal/thoughts/[slug]/",
  "/journal/articles/",
  "/journal/articles/[slug]/",
  "/journal/news/",
  "/journal/news/[slug]/",
  "/journal/video/",
  "/now/",
  "/facts/",
  "/press/",
  "/second-brain/",
  "/collaboration/",
  "/contacts/",
  "/search/",
  "/privacy/",
  "/404.html",
  "/rss.xml",
  "/robots.txt",
];

function routePath(pageFile) {
  let p = pageFile
    .replace(/\\/g, "/")
    .replace(/^src\/pages\//, "/")
    .replace(/\/index\.astro$/, "/")
    .replace(/\.astro$/, "")
    .replace(/\.ts$/, "");
  if (!p.endsWith("/") && !p.includes(".")) p += "/";
  if (p.endsWith("/404/")) p = "/404.html";
  else if (p === "/rss.xml" || p === "/robots.txt") p = `/${p}`;
  return p.replace(/\/+/g, "/").replace(/\/\[/g, "/[").replace(/\]\//g, "]/");
}

const pagesDir = path.join(root, "src", "pages");
function findPages(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...findPages(full));
    else if (/\.(astro|ts)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const pageFiles = findPages(pagesDir);
const builtRoutes = new Set();
for (const f of pageFiles) {
  const rel = path.relative(pagesDir, f);
  let route = "/" + rel.replace(/\\/g, "/");
  route = routePath("src/pages/" + rel);
  builtRoutes.add(route);
}

const missing = CANONICAL_ROUTES.filter((r) => !builtRoutes.has(r));
if (missing.length) {
  console.error("MISSING ROUTES:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const extra = [...builtRoutes].filter(
  (r) => !CANONICAL_ROUTES.includes(r) && !r.startsWith("/sitemap"),
);
if (extra.length) {
  console.warn("EXTRA ROUTES (info):");
  console.warn(extra.join("\n"));
}

console.log(
  `Routes check: PASS (${[...builtRoutes].length} built, ${CANONICAL_ROUTES.length} required)`,
);
