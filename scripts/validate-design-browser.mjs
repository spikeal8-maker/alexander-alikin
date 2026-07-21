import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { checkV2Design } from "./browser-checks/v2-design-tokens.mjs";

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
  { name: "collaboration", path: `${BASE}/collaboration/` },
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
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
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
        const tolerance = 2;
        return maxScroll > viewW + tolerance
          ? { overflow: true, scrollWidth: maxScroll, viewport: viewW }
          : { overflow: false };
      });
      if (overflow.overflow) {
        const offenders = await page.evaluate(() => {
          const els = document.querySelectorAll("*");
          const vw = window.innerWidth;
          const bad = [];
          for (const el of els) {
            const r = el.getBoundingClientRect();
            if (r.right > vw + 2 && r.left < vw) {
              const tag = el.tagName.toLowerCase();
              const cls = el.className?.toString?.().slice(0, 60) || "";
              const id = el.id || "";
              bad.push({
                selector: id ? `#${id}` : cls ? `${tag}.${cls.replace(/ /g, ".")}` : tag,
                left: Math.round(r.left),
                right: Math.round(r.right),
                width: Math.round(r.width),
              });
            }
            if (bad.length >= 6) break;
          }
          return bad;
        });
        errors.push(
          `${route.name} @${vp.name}: horizontal overflow (${overflow.scrollWidth} vs ${overflow.viewport})`,
        );
        for (const o of offenders)
          errors.push(`  └─ ${o.selector}: left=${o.left} right=${o.right} width=${o.width}`);
      }

      if (
        ["home", "about", "business", "education", "projects", "izo-asa", "collaboration"].includes(
          route.name,
        )
      ) {
        const designIssues = await checkV2Design(page, route.name, vp.width);
        for (const i of designIssues) errors.push(`${route.name} @${vp.name}: ${i}`);
      }

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
      "collaboration",
      "contacts",
    ].includes(r.name),
  );

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

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${SITE}${BASE}/`, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName || "NONE");
  if (focused === "BODY" || focused === "NONE") errors.push("Keyboard: Tab did not focus element");

  await page.goto(`${SITE}${BASE}/about/`, { waitUntil: "networkidle" });
  const zoomResult = await page.evaluate(() => {
    document.body.style.zoom = "200%";
    return { scrollWidth: document.body.scrollWidth, viewport: window.innerWidth };
  });
  if (zoomResult.scrollWidth > zoomResult.viewport + 10)
    errors.push(
      `Zoom 200%: horizontal overflow (${zoomResult.scrollWidth} vs ${zoomResult.viewport})`,
    );

  await page.goto(`${SITE}${BASE}/about/`, { waitUntil: "networkidle" });
  const textZoomResult = await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
    return { scrollWidth: document.body.scrollWidth, viewport: window.innerWidth };
  });
  if (textZoomResult.scrollWidth > textZoomResult.viewport + 10)
    errors.push(
      `Text zoom 200%: horizontal overflow (${textZoomResult.scrollWidth} vs ${textZoomResult.viewport})`,
    );

  try {
    await page.goto(`${SITE}${BASE}/`, { waitUntil: "networkidle" });
    const axeCore = await import("@axe-core/playwright");
    const results = await new axeCore.default({ page }).analyze();
    for (const v of results.violations) {
      if (v.impact === "serious" || v.impact === "critical") {
        const nodes = v.nodes
          .slice(0, 3)
          .map((n) => n.html)
          .join(" | ");
        errors.push(`Axe: ${v.impact} ${v.id} — ${v.help} [${nodes}]`);
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
  const report = `${errors.join("\n")}\n`;
  fs.writeFileSync(path.join(SCREENSHOT_DIR, "browser-errors.txt"), report, "utf8");
  console.error("BROWSER ERRORS:");
  console.error(report);
  process.exit(1);
}

const errorReportPath = path.join(SCREENSHOT_DIR, "browser-errors.txt");
if (fs.existsSync(errorReportPath)) fs.rmSync(errorReportPath);
console.log("Browser check: PASS");
