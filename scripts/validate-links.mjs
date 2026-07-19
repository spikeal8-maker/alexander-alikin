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

const BASE_PATH = "/alexander-alikin";
const errors = [];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (
      entry.name.endsWith(".html") ||
      entry.name.endsWith(".xml") ||
      entry.name.endsWith(".json")
    )
      files.push(full);
  }
  return files;
}

const allFiles = walk(distDir);

for (const file of allFiles) {
  if (!file.endsWith(".html")) continue;
  const content = fs.readFileSync(file, "utf8");
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
      errors.push(`${file}: internal link missing base path: ${href}`);
      continue;
    }

    const relPath = href.slice(BASE_PATH.length);
    if (relPath.includes("#")) {
      const [page, anchor] = relPath.split("#");
      const targetPath = page ? path.join(distDir, page.replace(/^\//, ""), "index.html") : file;

      if (page && !fs.existsSync(targetPath)) {
        errors.push(`${file}: broken link ${href} → page not found`);
        continue;
      }

      if (anchor) {
        const decodedAnchor = decodeURIComponent(anchor);
        const targetFile = page ? targetPath : file;
        const targetContent = fs.readFileSync(targetFile, "utf8");
        const idPattern = new RegExp(
          `id=["']${decodedAnchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
          "i",
        );
        if (!idPattern.test(targetContent)) {
          errors.push(`${file}: broken anchor ${href} → #${decodedAnchor} not found in target`);
        }
      }
    } else {
      const targetPath = path.join(distDir, relPath.replace(/^\//, ""), "index.html");
      const altPath = path.join(distDir, relPath.replace(/^\//, ""));
      if (relPath.endsWith(".xml") || relPath.endsWith(".txt") || relPath.endsWith(".json")) {
        const dataPath = path.join(distDir, relPath.replace(/^\//, ""));
        if (!fs.existsSync(dataPath)) {
          errors.push(`${file}: broken link ${href} → endpoint not found`);
        }
      } else if (!fs.existsSync(targetPath) && !fs.existsSync(altPath)) {
        errors.push(`${file}: broken link ${href} → target not found`);
      }
    }
  }

  const canonicalMatch = content.match(/<link rel="canonical" href="([^"]+)"/);
  if (canonicalMatch) {
    const canonical = canonicalMatch[1];
    const baseCount = (canonical.match(new RegExp(BASE_PATH.replace(/\//g, "\\/"), "g")) || [])
      .length;
    if (baseCount !== 1) {
      errors.push(
        `${file}: canonical has ${baseCount} base-path occurrences (expected 1): ${canonical}`,
      );
    }
  }
}

const rssPath = path.join(distDir, "rss.xml");
if (fs.existsSync(rssPath)) {
  const rss = fs.readFileSync(rssPath, "utf8");
  if (rss.includes("draft") || rss.includes("DRAFT-TEST-LEAK-MARKER")) {
    errors.push("rss.xml contains draft/blocked content");
  }
  const baseCount = (rss.match(new RegExp(BASE_PATH.replace(/\//g, "\\/"), "g")) || []).length;
  if (baseCount === 0) errors.push("rss.xml: no base path found");
}

const siPath = path.join(distDir, "search-index.json");
if (fs.existsSync(siPath)) {
  const si = JSON.parse(fs.readFileSync(siPath, "utf8"));
  for (const item of si) {
    if (item.status === "draft" || item.status === "blocked") {
      errors.push(`search-index.json: contains ${item.status} item: ${item.title}`);
    }
    if (item.href) {
      const bc = (item.href.match(new RegExp(BASE_PATH.replace(/\//g, "\\/"), "g")) || []).length;
      if (bc !== 1)
        errors.push(`search-index.json: bad base-path count in ${item.title}: ${item.href}`);
    }
  }
}

if (errors.length) {
  console.error("LINK ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Link validation: PASS (${allFiles.filter((f) => f.endsWith(".html")).length} HTML files checked)`,
);
