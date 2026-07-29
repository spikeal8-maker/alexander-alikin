import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const COMPONENTS = [
  ["v3", "HeaderV3.astro"],
  ["v3", "FooterV3.astro"],
  ["v3", "home", "HeroV3.astro"],
  ["v3", "home", "EvidenceLedgerV3.astro"],
  ["v3", "home", "SelectedWorkV3.astro"],
  ["v3", "home", "PracticeV3.astro"],
  ["v3", "home", "JournalTeaserV3.astro"],
  ["v3", "home", "ClosingV3.astro"],
  ["v2", "journal", "JournalListingV2.astro"],
  ["v2", "journal", "JournalEntryShellV2.astro"],
];

const errors = [];
const found = [];

for (const segments of COMPONENTS) {
  const componentPath = path.join(ROOT, "src", "components", ...segments);
  if (fs.existsSync(componentPath)) {
    found.push(segments.join("/"));
  } else {
    errors.push(`Component ${segments.join("/")} not found`);
  }
}

if (errors.length) {
  console.error("COMPONENT ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Component inventory: PASS (${found.length} components found)`);
