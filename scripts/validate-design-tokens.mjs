import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokensFile = path.join(ROOT, "src", "styles", "tokens.css");
const content = fs.readFileSync(tokensFile, "utf8");

const requiredTokens = [
  "--color-bg",
  "--color-surface",
  "--color-text",
  "--color-primary",
  "--color-accent",
  "--color-muted",
  "--color-border",
  "--color-verified",
  "--color-warning",
  "--color-danger",
  "--color-focus",
  "--font-sans",
  "--font-mono",
  "--fw-normal",
  "--fw-semibold",
  "--fw-bold",
  "--text-xs",
  "--text-base",
  "--text-xl",
  "--text-3xl",
  "--leading-normal",
  "--leading-tight",
  "--space-1",
  "--space-4",
  "--space-8",
  "--space-16",
  "--container-main",
  "--container-reading",
  "--container-wide",
  "--gutter",
  "--grid-gap",
  "--radius-sm",
  "--radius-lg",
  "--border-width",
  "--shadow-sm",
  "--motion-fast",
  "--motion-standard",
  "--motion-ease",
  "--target-size",
  "--z-sticky",
  "--z-modal",
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
