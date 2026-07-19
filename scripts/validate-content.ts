import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import {
  createProjectSchema,
  createFactSchema,
  createMediaSchema,
  createNowSchema,
  createNewsSchema,
  createJournalSchema,
} from "../src/lib/schemas";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const invalidDir = path.join(ROOT, "tests", "fixtures", "invalid");

interface TestCase {
  file: string;
  schema: ReturnType<typeof createProjectSchema>;
  expectedPath: string;
  expectedMessageFragment: string;
}

const tests: TestCase[] = [
  {
    file: "project-bad-evidence.md",
    schema: createProjectSchema(),
    expectedPath: "evidenceLevel",
    expectedMessageFragment: "Invalid option",
  },
  {
    file: "project-doc-verified-no-source.md",
    schema: createProjectSchema(),
    expectedPath: "sourceUrls",
    expectedMessageFragment: "document_verified requires",
  },
  {
    file: "fact-no-period.json",
    schema: createFactSchema(),
    expectedPath: "period",
    expectedMessageFragment: "Fact must have non-empty period",
  },
  {
    file: "media-no-rights.json",
    schema: createMediaSchema(),
    expectedPath: "rightsHolder",
    expectedMessageFragment: "required",
  },
  {
    file: "now-no-reviewat.md",
    schema: createNowSchema(),
    expectedPath: "reviewAt",
    expectedMessageFragment: "",
  },
  {
    file: "news-bad-status.md",
    schema: createNewsSchema(),
    expectedPath: "status",
    expectedMessageFragment: "Invalid option",
  },
];

const errors: string[] = [];
let passed = 0;

for (const test of tests) {
  const filePath = path.join(invalidDir, test.file);
  if (!fs.existsSync(filePath)) {
    errors.push(`MISSING: ${test.file}`);
    continue;
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const data = test.file.endsWith(".json") ? JSON.parse(raw) : matter(raw).data;
  const result = test.schema.safeParse(data);

  if (result.success) {
    errors.push(`${test.file}: expected FAIL but schema ACCEPTED`);
    continue;
  }

  const issue = result.error.issues.find(
    (i: { path: (string | number)[]; message: string }) =>
      i.path.join(".") === test.expectedPath &&
      (test.expectedMessageFragment === "" || i.message.includes(test.expectedMessageFragment)),
  );

  if (!issue) {
    const allPaths = result.error.issues.map(
      (i: { path: (string | number)[]; message: string }) => `${i.path.join(".")}: ${i.message}`,
    );
    errors.push(
      `${test.file}: no issue matching path="${test.expectedPath}" message="${test.expectedMessageFragment}". Got: ${allPaths.join("; ")}`,
    );
    continue;
  }

  passed++;
}

const draftFixturePath = path.join(invalidDir, "story-draft-leak.md");
if (fs.existsSync(draftFixturePath)) {
  const content = fs.readFileSync(draftFixturePath, "utf8");
  const parsed = matter(content);
  const draftSchema = createJournalSchema();
  const draftResult = draftSchema.safeParse(parsed.data);
  if (draftResult.success) {
    passed++;
  } else {
    errors.push(
      `story-draft-leak.md: draft fixture must be schema-valid but got: ${JSON.stringify(draftResult.error.issues)}`,
    );
  }
  if (!content.includes("DRAFT-TEST-LEAK-MARKER")) {
    errors.push("story-draft-leak.md: missing DRAFT-TEST-LEAK-MARKER");
  }
} else {
  errors.push("MISSING: story-draft-leak.md");
}

if (errors.length) {
  console.error("SCHEMA TEST ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Schema tests: PASS (${passed}/${tests.length + 1} fixtures verified)`);
