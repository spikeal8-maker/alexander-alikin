import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const MAX_SOURCE = 300;
const MAX_ROUTE = 160;
const MAX_VALIDATOR = 250;

const ROUTE_DIRS = ["src/pages"];

function countLines(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8").split("\n").length;
  } catch {
    return 0;
  }
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      !["node_modules", "dist", ".astro", ".git", ".work", "tests"].includes(entry.name)
    ) {
      files.push(...walk(full));
    } else if (entry.isFile() && /\.(ts|mjs|css|astro)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const srcFiles = walk(path.join(root, "src"));
const scriptFiles = walk(path.join(root, "scripts"));
const allFiles = [...srcFiles, ...scriptFiles];

const violations = [];
for (const file of allFiles) {
  const lines = countLines(file);
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const isRoute = ROUTE_DIRS.some((d) => rel.startsWith(d));
  const isValidator = rel.startsWith("scripts/");
  const limit = isRoute ? MAX_ROUTE : isValidator ? MAX_VALIDATOR : MAX_SOURCE;

  if (lines > limit) {
    violations.push(`${rel}: ${lines} lines (limit: ${limit})`);
  }
}

if (violations.length) {
  console.error("FILE SIZE VIOLATIONS:");
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log(`File size check: PASS (${allFiles.length} files checked)`);
