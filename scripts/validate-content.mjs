import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const invalidDir = path.join(root, "tests", "fixtures", "invalid");

const errors = [];
if (!fs.existsSync(invalidDir)) {
  console.error("Invalid fixture directory not found. Skipping negative tests.");
  process.exit(0);
}

const fixtureFiles = fs
  .readdirSync(invalidDir, { withFileTypes: true })
  .filter((e) => ((e.isFile() && !e.name.endsWith(".md")) || e.name === "README.md" ? false : true))
  .map((e) => path.join(invalidDir, e.name));

// Validate that each invalid fixture exists
for (const fixture of fixtureFiles) {
  if (!fs.existsSync(fixture)) {
    errors.push(`Missing expected invalid fixture: ${fixture}`);
  }
}

// Check for evidence levels
const requiredFixtures = [
  "project-bad-evidence.md",
  "project-doc-verified-no-source.md",
  "fact-no-period.json",
  "media-no-rights.json",
  "now-no-reviewat.md",
  "news-bad-status.md",
  "story-draft-leak.md",
];

for (const name of requiredFixtures) {
  if (!fs.existsSync(path.join(invalidDir, name))) {
    errors.push(`Missing required negative fixture: ${name}`);
  }
}

// Also check that the draft leak fixture has the marker
const draftFixture = path.join(invalidDir, "story-draft-leak.md");
if (fs.existsSync(draftFixture)) {
  const content = fs.readFileSync(draftFixture, "utf8");
  if (!content.includes("DRAFT-TEST-LEAK-MARKER")) {
    errors.push("story-draft-leak.md missing DRAFT-TEST-LEAK-MARKER");
  }
  if (
    !content.includes("status: draft") &&
    !content.includes('status: "draft"') &&
    !content.includes("status:\ndraft")
  ) {
    errors.push("story-draft-leak.md missing draft status");
  }
}

if (errors.length) {
  console.error("CONTENT FIXTURE ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Content fixture validation: PASS (${requiredFixtures.length} negative fixtures)`);
