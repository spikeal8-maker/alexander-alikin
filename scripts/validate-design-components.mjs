import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const COMPONENTS = [
  "ButtonLink",
  "SectionHeader",
  "ProjectCard",
  "ContentCard",
  "FactCard",
  "EvidenceBadge",
  "StatusBadge",
  "Timeline",
  "EditorialQuote",
  "EditorialCallout",
  "CTASection",
  "Header",
  "Footer",
  "Breadcrumbs",
];

const uiDir = path.join(ROOT, "src", "components", "ui");
const foundationDir = path.join(ROOT, "src", "components", "foundation");

const errors = [];
const found = [];

for (const comp of COMPONENTS) {
  const uiPath = path.join(uiDir, `${comp}.astro`);
  const fndPath = path.join(foundationDir, `${comp}.astro`);
  if (fs.existsSync(uiPath) || fs.existsSync(fndPath)) {
    found.push(comp);
  } else {
    errors.push(`Component ${comp} not found`);
  }
}

if (errors.length) {
  console.error("COMPONENT ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Component inventory: PASS (${found.length} components found)`);
