import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const manifestPath = resolve(root, "docs/content-v4/PUBLIC_CONTENT_MANIFEST.yaml");
const manifest = readFileSync(manifestPath, "utf8");
const errors = [];

const fail = (condition, message) => {
  if (!condition) errors.push(message);
};

const requiredFields = [
  "id",
  "sourcePath",
  "publicTarget",
  "contentType",
  "title",
  "publicationStatus",
  "evidenceStatus",
  "ownerApproval",
  "containsPersonalData",
  "containsThirdPartyData",
  "mediaRightsStatus",
  "externalLinksChecked",
  "lastVerifiedAt",
  "reviewAt",
  "blockers",
  "sourceReferences",
];

const itemBlocks = manifest
  .split(/\n(?= {2}- id: )/)
  .filter((block) => block.startsWith("  - id: "));

fail(itemBlocks.length === 29, `manifest must contain 29 items, found ${itemBlocks.length}`);

const getQuoted = (block, field) => {
  const prefix = field === "id" ? " {2}- " : " {4}";
  return block.match(new RegExp(`^${prefix}${field}: "([^"]*)"`, "m"))?.[1] ?? null;
};
const ids = new Set();
const sourcePaths = new Set();
const statuses = new Map();

for (const block of itemBlocks) {
  for (const field of requiredFields) {
    const prefix = field === "id" ? " {2}- " : " {4}";
    fail(
      new RegExp(`^${prefix}${field}:`, "m").test(block),
      `manifest item is missing ${field}: ${getQuoted(block, "id") ?? "unknown"}`,
    );
  }

  const id = getQuoted(block, "id");
  const sourcePath = getQuoted(block, "sourcePath");
  const status = getQuoted(block, "publicationStatus");
  const target = getQuoted(block, "publicTarget");
  const lastVerifiedAt = getQuoted(block, "lastVerifiedAt");
  const reviewAt = getQuoted(block, "reviewAt");
  const sourceRef = block.match(/^ {4}sourceReferences: \["([^"]+)"\]/m)?.[1] ?? "";

  fail(Boolean(id) && !ids.has(id), `duplicate or missing id: ${id}`);
  fail(
    Boolean(sourcePath) && !sourcePaths.has(sourcePath),
    `duplicate or missing sourcePath: ${sourcePath}`,
  );
  ids.add(id);
  sourcePaths.add(sourcePath);
  statuses.set(status, (statuses.get(status) ?? 0) + 1);

  fail(
    /^site-content-v1\/.+/.test(sourcePath ?? ""),
    `sourcePath is outside allowed scope: ${sourcePath}`,
  );
  fail(
    sourceRef === `private-pr6:${sourcePath}`,
    `source reference does not match sourcePath: ${id}`,
  );
  fail(/^\d{4}-\d{2}-\d{2}$/.test(lastVerifiedAt ?? ""), `invalid lastVerifiedAt: ${id}`);
  fail(/^\d{4}-\d{2}-\d{2}$/.test(reviewAt ?? ""), `invalid reviewAt: ${id}`);

  if (status === "ready_for_public_export") {
    fail(
      Boolean(target) && existsSync(resolve(root, target)),
      `export target does not exist: ${id}`,
    );
  }
}

const expectedStatuses = {
  ready_for_public_export: 0,
  owner_review: 20,
  fact_check: 6,
  blocked: 3,
  private_only: 0,
};
for (const [status, expected] of Object.entries(expectedStatuses)) {
  fail((statuses.get(status) ?? 0) === expected, `${status} count must be ${expected}`);
  fail(
    new RegExp(`^ {2}${status}: ${expected}$`, "m").test(manifest),
    `summary count does not match for ${status}`,
  );
}
fail(/^ {2}exported: 0$/m.test(manifest), "exported summary must remain zero");

const contactAllowlist = [];
fail(contactAllowlist.length === 0, "contact allowlist must remain empty before owner approval");

const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const changed = new Set();
try {
  for (const file of git("diff", "--name-only", "origin/main...HEAD")) changed.add(file);
} catch {
  // A local checkout without origin/main is still covered by status below.
}
for (const line of git("status", "--porcelain")) {
  const path = line.slice(3).replace(/^"|"$/g, "");
  changed.add(path);
}

const forbiddenUiPrefixes = ["src/pages/", "src/components/", "src/styles/", "public/"];
for (const file of changed) {
  fail(
    !forbiddenUiPrefixes.some((prefix) => file.startsWith(prefix)),
    `forbidden UI or public media change: ${file}`,
  );
  fail(
    !file.startsWith("site-content-v1/"),
    `private source copied into public repository: ${file}`,
  );
  fail(!/(^|\/)\.env(?:\.|$)/.test(file), `environment file must not be committed: ${file}`);
}

const changedContent = [...changed].filter((file) => file.startsWith("src/content/"));
fail(
  changedContent.length === 0,
  `no source is ready; content changes found: ${changedContent.join(", ")}`,
);

const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
];
for (const file of changed) {
  const absolutePath = resolve(root, file);
  if (
    !existsSync(absolutePath) ||
    !statSync(absolutePath).isFile() ||
    file === "package-lock.json"
  ) {
    continue;
  }
  const content = readFileSync(absolutePath, "utf8");
  for (const pattern of secretPatterns) {
    fail(!pattern.test(content), `potential secret in ${file}`);
  }
}

if (errors.length > 0) {
  console.error("CONTENT-EXPORT-001 validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "CONTENT-EXPORT-001 validation passed: 29 sources registered, 0 ready, 0 exported, UI/media unchanged.",
);
