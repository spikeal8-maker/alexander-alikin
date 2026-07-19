import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const LEARN_MARKERS = [
  "DRAFT-TEST-LEAK-MARKER",
  "status: draft",
  "status: blocked",
  "status: review",
  "status: ready",
];

if (!fs.existsSync(distDir)) {
  console.error("BLOCKED: dist/ directory not found. Run build first.");
  process.exit(1);
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(html|xml|json|js|css|svg)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const distFiles = walk(distDir);
const errors = [];

for (const file of distFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const marker of LEARN_MARKERS) {
    if (content.includes(marker)) {
      errors.push(`${file}: contains draft/blocked/unpublished marker "${marker}"`);
    }
  }
}

if (errors.length) {
  console.error("LEAK ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Leak gate: PASS (${distFiles.length} files checked)`);
