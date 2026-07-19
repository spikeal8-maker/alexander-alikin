import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const invalidDir = path.join(root, "tests", "fixtures", "invalid");

const requiredFixtures = [
  {
    file: "project-bad-evidence.md",
    expectedError: "unknown evidenceLevel",
    collection: "projects",
  },
  {
    file: "project-doc-verified-no-source.md",
    expectedError: "document_verified without source",
    collection: "projects",
  },
  { file: "fact-no-period.json", expectedError: "Fact without period", collection: "facts" },
  { file: "media-no-rights.json", expectedError: "Media without rights/alt", collection: "media" },
  { file: "now-no-reviewat.md", expectedError: "Now without reviewAt", collection: "now" },
  { file: "news-bad-status.md", expectedError: "unknown publication status", collection: "news" },
  { file: "story-draft-leak.md", expectedError: "draft leak marker", collection: "stories" },
];

let errors = [];

for (const fixture of requiredFixtures) {
  const filePath = path.join(invalidDir, fixture.file);
  if (!fs.existsSync(filePath)) {
    errors.push(`MISSING: ${fixture.file}`);
    continue;
  }
  const content = fs.readFileSync(filePath, "utf8");
  if (fixture.file === "story-draft-leak.md") {
    if (!content.includes("DRAFT-TEST-LEAK-MARKER")) {
      errors.push(`${fixture.file}: missing DRAFT-TEST-LEAK-MARKER`);
    }
    if (!content.includes("status:") || !content.includes("draft")) {
      errors.push(`${fixture.file}: missing draft status`);
    }
  }
  if (fixture.file === "project-bad-evidence.md") {
    if (!content.includes('"verified"') && !content.includes("verified")) {
      errors.push(`${fixture.file}: missing bad evidence level 'verified'`);
    }
  }
  if (fixture.file === "project-doc-verified-no-source.md") {
    if (!content.includes("document_verified")) {
      errors.push(`${fixture.file}: missing document_verified`);
    }
    if (!content.includes("sourceUrls: []") && !content.includes("sourceUrls:[]")) {
      errors.push(`${fixture.file}: missing empty sourceUrls`);
    }
  }
  if (fixture.file === "fact-no-period.json") {
    try {
      const data = JSON.parse(content);
      if (data.period) errors.push(`${fixture.file}: has period field`);
      if (data.periodNotApplicable !== false && data.periodNotApplicable !== undefined) {
        errors.push(`${fixture.file}: periodNotApplicable is truthy`);
      }
    } catch {
      errors.push(`${fixture.file}: invalid JSON`);
    }
  }
  if (fixture.file === "media-no-rights.json") {
    try {
      const data = JSON.parse(content);
      if (data.rightsHolder) errors.push(`${fixture.file}: has rightsHolder`);
      if (data.alt) errors.push(`${fixture.file}: has alt`);
    } catch {
      errors.push(`${fixture.file}: invalid JSON`);
    }
  }
  if (fixture.file === "now-no-reviewat.md") {
    if (content.includes("reviewAt:")) {
      errors.push(`${fixture.file}: has reviewAt`);
    }
  }
  if (fixture.file === "news-bad-status.md") {
    if (!content.includes('"deleted"') && !content.includes("deleted")) {
      errors.push(`${fixture.file}: missing bad status 'deleted'`);
    }
  }
}

if (errors.length) {
  console.error("CONTENT FIXTURE ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Content fixtures: PASS (${requiredFixtures.length} negative fixtures verified)`);
