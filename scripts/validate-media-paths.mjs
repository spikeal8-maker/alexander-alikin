import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOCUMENTARY_DIR = path.join(ROOT, "public", "images", "alikin", "documentary");
const errors = [];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(filePath));
    else files.push(filePath);
  }
  return files;
}

const documentaryFiles = fs.existsSync(DOCUMENTARY_DIR)
  ? fs.readdirSync(DOCUMENTARY_DIR).filter((file) => file.endsWith(".webp"))
  : [];
const hashes = new Map();

for (const file of documentaryFiles) {
  const filePath = path.join(DOCUMENTARY_DIR, file);
  const hash = crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  if (hashes.has(hash)) errors.push(`duplicate documentary media: ${hashes.get(hash)} and ${file}`);
  hashes.set(hash, file);
}

const sourceFiles = walk(path.join(ROOT, "src")).filter((file) =>
  /\.(astro|css|md|json|ts|mjs)$/.test(file),
);
const referenced = new Set();

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  if (/\/images\/alikin\/visualized\//.test(content)) {
    errors.push(`generated media reference is forbidden: ${path.relative(ROOT, file)}`);
  }
  for (const match of content.matchAll(/\/images\/alikin\/[a-zA-Z0-9_/.-]+\.(?:webp|svg)/g)) {
    referenced.add(match[0]);
  }
}

for (const ref of referenced) {
  if (!fs.existsSync(path.join(ROOT, "public", ref.replace(/^\//, "")))) {
    errors.push(`referenced media is missing: ${ref}`);
  }
}

const visualizedDir = path.join(ROOT, "public", "images", "alikin", "visualized");
if (fs.existsSync(visualizedDir))
  errors.push("generated visualized media directory must be absent");

if (errors.length) {
  console.error("MEDIA ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Media check: PASS (${documentaryFiles.length} documentary files, ${referenced.size} references, 0 generated media)`,
);
