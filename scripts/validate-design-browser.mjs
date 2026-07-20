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
  { name: "about", path: `${BASE}/about/` },
  { name: "business", path: `${BASE}/business/` },
  { name: "education", path: `${BASE}/education/` },
  { name: "projects", path: `${BASE}/projects/` },
  { name: "izo-asa", path: `${BASE}/projects/izo-asa/` },
  { name: "engineering-education", path: `${BASE}/projects/engineering-education/` },
  { name: "journal", path: `${BASE}/journal/` },
  { name: "project-learning", path: `${BASE}/journal/articles/project-learning/` },
  { name: "children-and-robots", path: `${BASE}/journal/stories/children-and-robots/` },
  { name: "one-method", path: `${BASE}/journal/stories/one-method/` },
  { name: "projects-over-theory", path: `${BASE}/journal/thoughts/projects-over-theory/` },
  { name: "contacts", path: `${BASE}/contacts/` },
];

const VIEWPORTS = [
  { name: "320", width: 320, height: 568 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

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
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const resp = await page.goto(`${SITE}${route.path}`, {
        waitUntil: "networkidle",
        timeout: 15000,
      });
      if (!resp || resp.status() >= 400) {
        errors.push(`${route.name} @${vp.name}: HTTP ${resp?.status() || "no response"}`);
        continue;
      }
      const title = await page.title();
      if (!title) errors.push(`${route.name} @${vp.name}: no title`);
      if (FORBIDDEN.some((w) => title.includes(w)))
        errors.push(`${route.name} @${vp.name}: forbidden text in title: ${title}`);
      const bodyText = await page.evaluate(() => document.body.innerText || "");
      if (FORBIDDEN.some((w) => bodyText.includes(w)))
        errors.push(`${route.name} @${vp.name}: forbidden text in body`);
      const mainText = await page.evaluate(() => {
        const m = document.querySelector("main");
        return m ? m.textContent?.trim().length || 0 : 0;
      });
      if (mainText < 20)
        errors.push(`${route.name} @${vp.name}: main content too short (${mainText})`);
      const overflow = await page.evaluate(() => {
        const body = document.body;
        const maxScroll = body.scrollWidth;
        const viewW = window.innerWidth;
        // Allow <=2px overflow (subpixel rounding)
        return maxScroll > viewW + 2;
      });
      if (overflow)
        errors.push(
          `${route.name} @${vp.name}: horizontal overflow (${await page.evaluate(() => document.body.scrollWidth)} vs ${vp.width})`,
        );
      const images = await page.evaluate(() =>
        [...document.images].map((img) => ({
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          src: img.src,
        })),
      );
      for (const img of images) {
        if (!img.complete) errors.push(`${route.name} @${vp.name}: image not complete: ${img.src}`);
        if (img.naturalWidth === 0)
          errors.push(`${route.name} @${vp.name}: broken image: ${img.src}`);
      }
    }
  }

  // Screenshots (desktop 1440, mobile 390)
  const screenshotRoutes = ROUTES.filter((r) =>
    [
      "home",
      "about",
      "business",
      "education",
      "projects",
      "izo-asa",
      "journal",
      "project-learning",
      "contacts",
    ].includes(r.name),
  );
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  for (const route of screenshotRoutes) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${SITE}${route.path}`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${route.name}-desktop.png`),
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${SITE}${route.path}`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${route.name}-mobile.png`),
      fullPage: true,
    });
  }

  // No-JS context
  const noJsCtx = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  const noJsPage = await noJsCtx.newPage();
  await noJsPage.setViewportSize({ width: 1440, height: 900 });
  for (const route of ["home", "about", "izo-asa", "project-learning"]) {
    const r = ROUTES.find((x) => x.name === route);
    if (!r) continue;
    await noJsPage.goto(`${SITE}${r.path}`, { waitUntil: "networkidle", timeout: 15000 });
    const text = await noJsPage.evaluate(
      () => document.querySelector("main")?.textContent?.trim() || "",
    );
    if (text.length < 20) errors.push(`No-JS ${route}: no main content`);
    const title = await noJsPage.title();
    if (!title) errors.push(`No-JS ${route}: no title`);
  }
  await noJsCtx.close();

  // Keyboard + focus
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${SITE}${BASE}/`, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName || "NONE");
  if (focused === "BODY" || focused === "NONE") errors.push("Keyboard: Tab did not focus element");

  // 200% zoom
  await page.goto(`${SITE}${BASE}/about/`, { waitUntil: "networkidle" });
  let zoomOk = await page.evaluate(() => {
    document.body.style.zoom = "200%";
    return document.body.scrollWidth <= window.innerWidth + 10;
  });
  if (!zoomOk) errors.push("Zoom 200%: horizontal overflow detected");

  // 200% text size
  await page.goto(`${SITE}${BASE}/about/`, { waitUntil: "networkidle" });
  const textZoomOk = await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
    return document.body.scrollWidth <= window.innerWidth + 10;
  });
  if (!textZoomOk) errors.push("Text zoom 200%: horizontal overflow");

  // Axe scan
  try {
    await page.goto(`${SITE}${BASE}/`, { waitUntil: "networkidle" });
    const axeCore = await import("@axe-core/playwright");
    const results = await new axeCore.default({ page }).analyze();
    for (const v of results.violations) {
      if (v.impact === "serious" || v.impact === "critical") {
        errors.push(`Axe: ${v.impact} ${v.id} — ${v.help}`);
      }
    }
  } catch (e) {
    errors.push(`Axe scan failed: ${e.message}`);
  }
} finally {
  await browser.close();
}

console.log(`Routes tested: ${ROUTES.length} × ${VIEWPORTS.length} viewports`);
console.log(
  `Screenshots: ${fs.existsSync(SCREENSHOT_DIR) ? fs.readdirSync(SCREENSHOT_DIR).length : 0} files`,
);

if (errors.length) {
  console.error("BROWSER ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Browser check: PASS");
