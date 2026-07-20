import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "http://localhost:4321";
const BASE = "/alexander-alikin";
const SCREENSHOT_DIR = path.join(ROOT, ".work", "screenshots");

const ROUTES = [
  { name: "home", path: `${BASE}/` },
  { name: "project", path: `${BASE}/projects/test-platform/` },
  { name: "article", path: `${BASE}/journal/articles/test-article/` },
];

const VIEWPORTS = [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1024", width: 1024, height: 768 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

const errors = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();

try {
  for (const route of ROUTES) {
    for (const vp of [...VIEWPORTS, ...VIEWPORTS.slice(-2)]) {
      if (vp.name.includes("320") || vp.name.includes("1440")) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`${SITE}${route.path}`, { waitUntil: "networkidle" });
        const title = await page.title();
        if (!title) errors.push(`${route.name} @${vp.name}: no title`);

        const overflow = await page.evaluate(() => {
          const body = document.body;
          return body.scrollWidth > window.innerWidth;
        });
        if (overflow) errors.push(`${route.name} @${vp.name}: horizontal overflow`);
      }
    }
  }

  // Screenshots: desktop (1440) and mobile (390)
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const desktopViewport = { width: 1440, height: 900 };
  const mobileViewport = { width: 390, height: 844 };

  for (const route of ROUTES) {
    await page.setViewportSize(desktopViewport);
    await page.goto(`${SITE}${route.path}`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${route.name}-desktop.png`),
      fullPage: true,
    });

    await page.setViewportSize(mobileViewport);
    await page.goto(`${SITE}${route.path}`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${route.name}-mobile.png`),
      fullPage: true,
    });
  }

  // Keyboard test
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${SITE}${BASE}/`, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  if (!focused || focused === "BODY") errors.push("Keyboard: no element focused after Tab");

  // No-JS: get main content text
  const noJsText = await page.evaluate(() => {
    const main = document.querySelector("main");
    return main ? main.textContent?.trim().length > 20 : false;
  });
  if (!noJsText) errors.push("No-JS: no main content text");

  // Axe scan
  try {
    const axeCore = await import("@axe-core/playwright");
    const results = await new axeCore.default({ page }).analyze();
    for (const violation of results.violations) {
      if (violation.impact === "serious" || violation.impact === "critical") {
        errors.push(`Axe: ${violation.impact} violation: ${violation.id} — ${violation.help}`);
      }
    }
  } catch {
    errors.push("Axe scan failed to run");
  }
} finally {
  await browser.close();
}

console.log(`Screenshots: ${fs.readdirSync(SCREENSHOT_DIR).length} files in ${SCREENSHOT_DIR}`);
console.log(`Viewport check: ${VIEWPORTS.length} viewports tested`);

if (errors.length) {
  console.error("BROWSER ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Browser check: PASS");
