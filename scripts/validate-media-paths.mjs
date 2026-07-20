import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function dirHashes(dirPath) {
  const result = {};
  if (!fs.existsSync(dirPath)) return result;
  for (const f of fs.readdirSync(dirPath)) {
    if (f.endsWith(".webp")) result[f] = sha256(path.join(dirPath, f));
  }
  return result;
}

const visDir = path.join(ROOT, "public", "images", "alikin", "visualized");
const docDir = path.join(ROOT, "public", "images", "alikin", "documentary");
const visHashes = dirHashes(visDir);
const docHashes = dirHashes(docDir);

console.log(
  `Visualized: ${Object.keys(visHashes).length} files, ${new Set(Object.values(visHashes)).size} unique`,
);
console.log(
  `Documentary: ${Object.keys(docHashes).length} files, ${new Set(Object.values(docHashes)).size} unique`,
);

const errors = [];

// Check no cross-duplicates
for (const [vn, vh] of Object.entries(visHashes)) {
  for (const [dn, dh] of Object.entries(docHashes)) {
    if (vh === dh)
      errors.push(`SHA MATCH: visualized/${vn} == documentary/${dn} (${vh.substring(0, 12)})`);
  }
}

// Check no internal duplicates in visualized
const seenV = {};
for (const [name, hash] of Object.entries(visHashes)) {
  if (seenV[hash])
    errors.push(
      `SHA DUPLICATE in visualized: ${seenV[hash]} == ${name} (${hash.substring(0, 12)})`,
    );
  seenV[hash] = name;
}

// Manifest check
const manifestPath = path.join(ROOT, "docs", "media", "media-manifest.json");
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const asset of manifest.assets) {
    const pubPath = path.join(ROOT, "public", asset.file.replace(/^\//, ""));
    if (!fs.existsSync(pubPath)) errors.push(`MANIFEST: ${asset.file} not found`);
  }
}

// Src reference check
function walkPages(dir) {
  const files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walkPages(fp));
    else if (/\.(astro|ts|md)$/.test(e.name)) files.push(fp);
  }
  return files;
}
const srcRefs = new Set();
for (const f of walkPages(path.join(ROOT, "src"))) {
  const m = fs.readFileSync(f, "utf8").matchAll(/\/images\/alikin\/[a-zA-Z0-9_/.-]+\.webp/g);
  for (const x of m) srcRefs.add(x[0]);
}
for (const ref of srcRefs) {
  const pubPath = path.join(ROOT, "public", ref.replace(/^\//, ""));
  if (!fs.existsSync(pubPath)) errors.push(`SRC: ${ref} not found`);
}

if (errors.length) {
  console.error("MEDIA ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Media SHA: PASS (${Object.keys(visHashes).length}v + ${Object.keys(docHashes).length}d, ${srcRefs.size} refs)`,
);
