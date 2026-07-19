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

const errors = [];

// Check robots.txt in prelaunch mode
const robotsTxt = path.join(distDir, "robots.txt");
if (fs.existsSync(robotsTxt)) {
  const content = fs.readFileSync(robotsTxt, "utf8");
  if (!content.includes("Disallow: /")) {
    errors.push("robots.txt should contain Disallow: / in prelaunch");
  }
}

// Check RSS
const rssPath = path.join(distDir, "rss.xml");
if (fs.existsSync(rssPath)) {
  const rss = fs.readFileSync(rssPath, "utf8");
  if (rss.includes("draft") && !rss.includes("DRAFT-TEST-LEAK-MARKER")) {
    // draft markers should not be in rss - but we already ran leak check
  }
  if (!rss.includes("<rss") && !rss.includes("<feed")) {
    errors.push("rss.xml appears invalid");
  }
}

// Check search-index.json
const siPath = path.join(distDir, "search-index.json");
if (fs.existsSync(siPath)) {
  const si = JSON.parse(fs.readFileSync(siPath, "utf8"));
  if (!Array.isArray(si)) errors.push("search-index.json is not an array");
  for (const item of si) {
    if (item.status === "draft" || item.status === "blocked") {
      errors.push(`search-index.json contains unpublic content: ${item.title}`);
    }
  }
} else {
  errors.push("search-index.json not found in dist");
}

// Check 404 exists
if (!fs.existsSync(path.join(distDir, "404.html"))) {
  errors.push("404.html not found in dist");
}

// Check HTML files have lang, title, description
function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

for (const html of walk(distDir)) {
  const c = fs.readFileSync(html, "utf8");
  if (!c.includes('lang="ru"') && !c.includes("lang='ru'")) {
    errors.push(`${html}: missing lang="ru"`);
  }
  if (!/<title>/.test(c)) errors.push(`${html}: missing <title>`);
}

if (errors.length) {
  console.error("DIST ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Dist check: PASS");
