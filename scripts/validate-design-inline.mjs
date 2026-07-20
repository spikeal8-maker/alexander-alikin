import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const errors = [];

function walk(dir) {
  const files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory() && !["node_modules", "dist", ".astro", ".git", ".work"].includes(e.name)) {
      files.push(...walk(fp));
    } else if (e.isFile() && e.name.endsWith(".astro")) {
      files.push(fp);
    }
  }
  return files;
}

const pagesDir = path.join(ROOT, "src", "pages");
const componentsDir = path.join(ROOT, "src", "components");

const controlRoutes = [
  path.join(pagesDir, "index.astro"),
  path.join(pagesDir, "projects", "[slug].astro"),
  path.join(pagesDir, "journal", "articles", "[slug].astro"),
];

for (const file of [...walk(componentsDir), ...controlRoutes]) {
  const content = fs.readFileSync(file, "utf8");
  if (
    /style="[^"]*(?:#[0-9a-fA-F]{3,8}|[0-9]+px|rgba?\(|margin|padding|font-size|color:)\s*[^"]*"/.test(
      content,
    )
  ) {
    const rel = path.relative(ROOT, file);
    const matches = [...content.matchAll(/style="([^"]*)"/g)].map((m) => m[1]);
    const badStyles = matches.filter(
      (s) => /#[0-9a-fA-F]{3,8}|([0-9]+px)|rgba?\(/.test(s) && !/var\(--/.test(s),
    );
    if (badStyles.length) {
      errors.push(`${rel}: hardcoded styles: ${badStyles.join("; ")}`);
    }
  }
}

if (errors.length) {
  console.error("INLINE STYLE ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Inline presentation gate: PASS");
