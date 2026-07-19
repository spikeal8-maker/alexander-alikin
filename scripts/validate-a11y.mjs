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
  const content = fs.readFileSync(html, "utf8");

  if (!content.includes('lang="ru"') && !content.includes("lang='ru'"))
    errors.push(`${html}: missing lang="ru"`);

  if ((content.match(/<main/g) || []).length === 0) errors.push(`${html}: missing <main>`);

  if ((content.match(/<h1/g) || []).length === 0) errors.push(`${html}: missing <h1>`);

  if (!/<title>[^<]+<\/title>/i.test(content)) errors.push(`${html}: empty or missing <title>`);

  if (!/content="[^"]+"/.test(content)) errors.push(`${html}: missing description meta`);

  if (!content.includes("skip-link") && !content.includes("skip link"))
    errors.push(`${html}: missing skip link`);

  // Check for empty href
  if (/href\s*=\s*""/.test(content)) errors.push(`${html}: empty href attribute`);
}

if (errors.length) {
  console.error("A11Y ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}

// Native mobile contract check
const mobileErrors = [];
const headerHtmls = walk(distDir).filter((f) => !f.includes("404.html") && !f.includes("search"));
for (const html of headerHtmls) {
  const content = fs.readFileSync(html, "utf8");

  const hasDetails = content.includes("<details");
  if (hasDetails) {
    const detailsMatch = content.match(/<details[^>]*>([\s\S]*?)<\/details>/m);
    if (detailsMatch) {
      const detailsContent = detailsMatch[1];
      if (!detailsContent.includes("<summary")) {
        mobileErrors.push(`${html}: <details> missing <summary>`);
      }
      if (!detailsContent.includes("<nav")) {
        mobileErrors.push(`${html}: mobile nav not inside <details>`);
      }
    }
  } else {
    mobileErrors.push(`${html}: missing <details> for mobile nav`);
  }

  if (/tabindex\s*=\s*"-1"/.test(content)) {
    mobileErrors.push(`${html}: found tabindex="-1" — tabIndex should not be disabled`);
  }
}

if (mobileErrors.length) {
  console.error("MOBILE CONTRACT ERRORS:");
  console.error(mobileErrors.join("\n"));
  process.exit(1);
}
console.log("Accessibility smoke: PASS (mobile details/summary contract verified)");
