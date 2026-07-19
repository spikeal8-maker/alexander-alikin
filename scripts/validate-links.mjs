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
const BASE_PATH = "/alexander-alikin";

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

// Check internal links in generated HTML
for (const html of walk(distDir)) {
  const content = fs.readFileSync(html, "utf8");
  const hrefs = [...content.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

  for (const href of hrefs) {
    if (
      href.startsWith("http") ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.includes("${")
    )
      continue;
    if (!href.startsWith(BASE_PATH)) {
      errors.push(`${html}: internal link missing base path: ${href}`);
    }
  }
}

if (errors.length) {
  console.error("LINK ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Link validation: PASS");
