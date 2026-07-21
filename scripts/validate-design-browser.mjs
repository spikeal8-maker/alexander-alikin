import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { checkV2Design } from "./browser-checks/v2-design-tokens.mjs";
import { checkNotFound } from "./browser-checks/not-found.mjs";
import { readImagesAfterLoad } from "./browser-checks/image-readiness.mjs";
import { findOverflowOffenders } from "./browser-checks/overflow-diagnostics.mjs";
import {
  BASE,
  NOT_FOUND_PATH,
  ROUTES,
  SCREENSHOT_NAMES,
  VIEWPORTS,
} from "./browser-checks/routes.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "http://localhost:4321";
const SCREENSHOT_DIR = path.join(ROOT, ".work", "screenshots");
const FORBIDDEN = [
  "Тестовая",
  "Синтетическая",
  "Будет заменён",
  "test-platform",
  "test-article",
  "test-story",
  "test-thought",
];
const errors = [];
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(`${SITE}${route.path}`, {
        waitUntil: "networkidle",
        timeout: 15000,
      });
      if (!response || response.status() >= 400) {
        errors.push(`${route.name} @${viewport.name}: HTTP ${response?.status() || "no response"}`);
        continue;
      }
      const title = await page.title();
      if (!title) errors.push(`${route.name} @${viewport.name}: no title`);
      if (FORBIDDEN.some((word) => title.includes(word))) {
        errors.push(`${route.name} @${viewport.name}: forbidden text in title: ${title}`);
      }
      const bodyText = await page.evaluate(() => document.body.innerText || "");
      if (FORBIDDEN.some((word) => bodyText.includes(word))) {
        errors.push(`${route.name} @${viewport.name}: forbidden text in body`);
      }
      const mainText = await page.evaluate(
        () => document.querySelector("main")?.textContent?.trim().length || 0,
      );
      if (mainText < 20) {
        errors.push(`${route.name} @${viewport.name}: main content too short (${mainText})`);
      }
      const overflow = await page.evaluate(() => {
        const scrollWidth = document.body.scrollWidth;
        const viewportWidth = window.innerWidth;
        return scrollWidth > viewportWidth + 2
          ? { overflow: true, scrollWidth, viewportWidth }
          : { overflow: false };
      });
      if (overflow.overflow) {
        const offenders = await findOverflowOffenders(page);
        errors.push(
          `${route.name} @${viewport.name}: horizontal overflow (${overflow.scrollWidth} vs ${overflow.viewportWidth})`,
        );
        for (const offender of offenders) {
          errors.push(
            `  └─ ${offender.selector}: left=${offender.left} right=${offender.right} width=${offender.width} client=${offender.clientWidth} scroll=${offender.scrollWidth} min=${offender.minWidth} position=${offender.position} display=${offender.display} grid=${offender.grid} text="${offender.text}"`,
          );
        }
      }
      for (const issue of await checkV2Design(page, route.name, viewport.width)) {
        errors.push(`${route.name} @${viewport.name}: ${issue}`);
      }
      const images = await readImagesAfterLoad(page);
      for (const image of images) {
        if (!image.complete) {
          errors.push(`${route.name} @${viewport.name}: image not complete: ${image.src}`);
        }
        if (image.naturalWidth === 0) {
          errors.push(`${route.name} @${viewport.name}: broken image: ${image.src}`);
        }
      }
    }
  }

  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  for (const route of ROUTES.filter((candidate) => SCREENSHOT_NAMES.has(candidate.name))) {
    for (const viewport of [
      { suffix: "desktop", width: 1440, height: 900 },
      { suffix: "mobile", width: 390, height: 844 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${SITE}${route.path}`, { waitUntil: "networkidle" });
      await readImagesAfterLoad(page);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${route.name}-${viewport.suffix}.png`),
        fullPage: true,
      });
    }
  }
  await checkNotFound({
    page,
    site: SITE,
    notFoundPath: NOT_FOUND_PATH,
    viewports: VIEWPORTS,
    screenshotDir: SCREENSHOT_DIR,
    checkDesign: checkV2Design,
    errors,
  });

  const noJsContext = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
  });
  const noJsPage = await noJsContext.newPage();
  await noJsPage.setViewportSize({ width: 1440, height: 900 });
  for (const routeName of ["home", "about", "izo-asa", "project-learning", "contacts", "search"]) {
    const route = ROUTES.find((candidate) => candidate.name === routeName);
    if (!route) continue;
    await noJsPage.goto(`${SITE}${route.path}`, { waitUntil: "networkidle", timeout: 15000 });
    const text = await noJsPage.evaluate(
      () => document.querySelector("main")?.textContent?.trim() || "",
    );
    if (text.length < 20) errors.push(`No-JS ${routeName}: no main content`);
    if (!(await noJsPage.title())) errors.push(`No-JS ${routeName}: no title`);
  }
  await noJsContext.close();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${SITE}${BASE}/`, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName || "NONE");
  if (focused === "BODY" || focused === "NONE") errors.push("Keyboard: Tab did not focus element");

  await page.goto(`${SITE}${BASE}/about/`, { waitUntil: "networkidle" });
  const zoomOk = await page.evaluate(() => {
    document.body.style.zoom = "200%";
    return document.body.scrollWidth <= window.innerWidth + 10;
  });
  if (!zoomOk) errors.push("Zoom 200%: horizontal overflow detected");

  await page.goto(`${SITE}${BASE}/about/`, { waitUntil: "networkidle" });
  const textZoomOk = await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
    return document.body.scrollWidth <= window.innerWidth + 10;
  });
  if (!textZoomOk) errors.push("Text zoom 200%: horizontal overflow");

  try {
    await page.goto(`${SITE}${BASE}/`, { waitUntil: "networkidle" });
    const axeCore = await import("@axe-core/playwright");
    const results = await new axeCore.default({ page }).analyze();
    for (const violation of results.violations) {
      if (violation.impact === "serious" || violation.impact === "critical") {
        const nodes = violation.nodes
          .slice(0, 3)
          .map((node) => node.html)
          .join(" | ");
        errors.push(`Axe: ${violation.impact} ${violation.id} — ${violation.help} [${nodes}]`);
      }
    }
  } catch (error) {
    errors.push(`Axe scan failed: ${error.message}`);
  }
} finally {
  await browser.close();
}

console.log(`Routes tested: ${ROUTES.length} × ${VIEWPORTS.length} viewports + 404`);
console.log(
  `Screenshots: ${fs.existsSync(SCREENSHOT_DIR) ? fs.readdirSync(SCREENSHOT_DIR).length : 0} files`,
);
if (errors.length) {
  const report = errors.join("\n");
  console.error("BROWSER ERRORS:");
  console.error(report);
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  fs.writeFileSync(path.join(SCREENSHOT_DIR, "browser-errors.txt"), `${report}\n`, "utf8");
  process.exit(1);
}
console.log("Browser check: PASS");
