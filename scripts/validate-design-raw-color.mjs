import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ALLOWED_RAW_FILES = [path.join("src", "styles", "tokens.css"), path.join("src", "styles", "tokens-v2.css")];

function walk(dir, exts) {
  const files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && !["node_modules", "dist", ".astro", ".git", ".work"].includes(e.name)) {
      files.push(...walk(fp, exts));
    } else if (e.isFile() && exts.some((x) => e.name.endsWith(x))) {
      files.push(fp);
    }
  }
  return files;
}

const errors = [];
const hexPattern = /#[0-9A-Fa-f]{3,8}\b/g;

for (const file of walk(path.join(ROOT, "src"), [".css", ".astro", ".ts", ".mjs"])) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  if (ALLOWED_RAW_FILES.includes(rel)) continue;
  if (rel.includes("tokens.css")) continue;
  const content = fs.readFileSync(file, "utf8");
  const matches = content.match(hexPattern);
  if (matches) {
    for (const m of [...new Set(matches)]) {
      errors.push(`${file}: raw color ${m} found outside token file`);
    }
  }
}

if (errors.length) {
  console.error("RAW COLOR ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Raw color gate: PASS");
