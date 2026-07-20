import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokensFile = path.join(ROOT, "src", "styles", "tokens.css");
const content = fs.readFileSync(tokensFile, "utf8");

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return [r, g, b];
}

function luminance([r, g, b]) {
  const rs = r / 255,
    gs = g / 255,
    bs = b / 255;
  const toLin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLin(rs) + 0.7152 * toLin(gs) + 0.0722 * toLin(bs);
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getColor(name) {
  const match = content.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`));
  return match ? match[1] : null;
}

const pairs = [
  ["Text on background", "text", "bg"],
  ["Primary on background", "primary", "bg"],
  ["Primary on surface", "primary", "surface"],
  ["Accent on background", "accent", "bg"],
  ["Primary button text", "surface", "primary"],
];

const errors = [];
const results = [];

for (const [label, fgName, bgName] of pairs) {
  const fg = getColor(fgName);
  const bg = getColor(bgName);
  if (!fg || !bg) {
    errors.push(`Cannot find colors: ${fgName}/${bgName}`);
    continue;
  }
  const ratio = contrastRatio(luminance(hexToRgb(fg)), luminance(hexToRgb(bg)));
  const pass = ratio >= 4.5;
  results.push(`${label}: ${ratio.toFixed(2)}:1 ${pass ? "AA PASS" : "FAIL"}`);
  if (!pass && !label.includes("button"))
    errors.push(`${label}: contrast ${ratio.toFixed(2)} < 4.5`);
  if (!pass && label.includes("button") && ratio < 3)
    errors.push(`${label}: contrast ${ratio.toFixed(2)} < 3.0`);
}

console.log("Contrast results:");
console.log(results.join("\n"));

if (errors.length) {
  console.error("\nCONTRAST ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("\nContrast gate: PASS");
