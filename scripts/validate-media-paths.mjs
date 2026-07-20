import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(ROOT, "docs", "media", "media-manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.error("BLOCKED: media-manifest.json not found");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const errors = [];
let count = 0;

for (const asset of manifest.assets) {
  const pubPath = path.join(ROOT, "public", asset.file.replace(/^\//, ""));
  if (!fs.existsSync(pubPath)) {
    errors.push(`${asset.file}: not found in public/`);
  }
  count++;
}

function walkPages(dir) {
  const files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walkPages(fp));
    else if (/\.(astro|ts|md)$/.test(e.name)) files.push(fp);
  }
  return files;
}

const srcFiles = walkPages(path.join(ROOT, "src"));
const srcPaths = new Set();
for (const f of srcFiles) {
  const content = fs.readFileSync(f, "utf8");
  const matches = content.matchAll(/\/images\/alikin\/[a-zA-Z0-9_/.-]+\.webp/g);
  for (const m of matches) srcPaths.add(m[0]);
}

for (const p of srcPaths) {
  const pubFullPath = path.join(ROOT, "public", p.replace(/^\//, ""));
  if (!fs.existsSync(pubFullPath)) {
    errors.push(`${p}: referenced in src but not found in public/`);
  }
  count++;
}

if (errors.length) {
  console.error("MEDIA ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Media validation: PASS (${count} manifest assets, ${srcPaths.size} src references)`);
