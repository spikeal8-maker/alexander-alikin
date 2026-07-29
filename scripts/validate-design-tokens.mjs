import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokensFile = path.join(ROOT, "src", "styles", "tokens-v3.css");
const content = fs.readFileSync(tokensFile, "utf8");

const requiredTokens = [
  "--v3-paper",
  "--v3-paper-deep",
  "--v3-ink",
  "--v3-ink-soft",
  "--v3-muted",
  "--v3-line",
  "--v3-cobalt",
  "--v3-cobalt-dark",
  "--v3-cobalt-light",
  "--v3-white",
  "--v3-serif",
  "--v3-sans",
  "--v3-mono",
  "--v3-max",
  "--v3-gutter",
  "--v3-section",
  "--v3-shadow",
];

const errors = [];
for (const token of requiredTokens) {
  if (!content.includes(token + ":")) {
    errors.push(`Missing required token: ${token}`);
  }
}
if (errors.length) {
  console.error("TOKEN ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Design tokens: PASS (${requiredTokens.length} required tokens present)`);
