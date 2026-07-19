import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE_PATH = "/alexander-alikin";

function walkDist(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkDist(fp));
    else files.push(fp);
  }
  return files;
}

function resolveHrefTarget(href, sourceFile) {
  let rel = href;
  if (href.startsWith(BASE_PATH)) rel = href.slice(BASE_PATH.length);
  const isDataFile = rel.match(/\.(xml|json|txt|svg|css|js|ico|woff2?)$/i);
  const isAsset = !!isDataFile;
  if (rel.includes("#")) {
    const [pagePart, anchor] = rel.split("#", 2);
    const raw = path.join(distDir, pagePart.replace(/^\//, "")).replace(/\\/g, "/");
    const idx = pagePart
      ? isAsset || raw.endsWith(".html")
        ? raw
        : path.join(distDir, pagePart.replace(/^\//, "") || ".", "index.html").replace(/\\/g, "/")
      : sourceFile;
    return {
      pagePath: idx,
      anchor: anchor ? decodeURIComponent(anchor) : null,
      sourceFile,
      isAsset,
    };
  }
  const cleanRel = rel.replace(/^\//, "");
  const idxPath = path.join(distDir, cleanRel || ".", "index.html").replace(/\\/g, "/");
  const rawPath = path.join(distDir, cleanRel).replace(/\\/g, "/");
  if (isAsset) return { pagePath: rawPath, anchor: null, sourceFile, isAsset };
  return { pagePath: idxPath, altPath: rawPath, anchor: null, sourceFile, isAsset: false };
}

function validateAnchorExists(targetFile, anchor) {
  if (!fs.existsSync(targetFile)) return false;
  const content = fs.readFileSync(targetFile, "utf8");
  const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`id=["']${escaped}["']`, "i").test(content);
}

function validateCanonical(file, content) {
  const m = content.match(/<link rel="canonical" href="([^"]+)"/);
  if (!m) return [];
  const canonical = m[1];
  const errs = [];
  const bc = (canonical.match(new RegExp(BASE_PATH.replace(/\//g, "\\/"), "g")) || []).length;
  if (bc !== 1) errs.push(`${file}: canonical ${canonical} has ${bc} base-path (want 1)`);
  const sourceRel = path
    .relative(distDir, file)
    .replace(/\\/g, "/")
    .replace(/index\.html$/, "");
  const is404 = file.endsWith("404.html");
  const normalizedSource = is404
    ? "/404/"
    : sourceRel === "" || sourceRel.endsWith("/")
      ? `/${sourceRel}`
      : `/${sourceRel}/`;
  const canonicalSuffix = canonical.substring(canonical.indexOf(BASE_PATH) + BASE_PATH.length);
  if (canonicalSuffix !== normalizedSource) {
    errs.push(
      `${file}: canonical may not match route (canonical=${canonicalSuffix}, source=${normalizedSource})`,
    );
  }
  return errs;
}

let errors = [];
const distDir = path.join(ROOT, "dist");

if (!fs.existsSync(distDir)) {
  console.error("BLOCKED: dist/ not found. Run build first.");
  process.exit(1);
}

const allDistFiles = walkDist(distDir);
const htmlFiles = allDistFiles.filter((f) => f.endsWith(".html"));
let totalInternalLinks = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, "utf8");
  const hrefs = [...content.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

  for (const href of hrefs) {
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.includes("${")) continue;
    totalInternalLinks++;

    if (href.startsWith("#")) {
      const anchor = decodeURIComponent(href.slice(1));
      if (!validateAnchorExists(file, anchor)) {
        errors.push(`${file}: broken anchor ${href} → #${anchor} not found`);
      }
      continue;
    }

    if (!href.startsWith(BASE_PATH)) {
      errors.push(`${file}: missing base path: ${href}`);
      continue;
    }

    const { pagePath, anchor } = resolveHrefTarget(href, file);

    if (anchor) {
      if (!fs.existsSync(pagePath)) {
        errors.push(`${file}: broken link ${href} → page not found`);
      } else if (!validateAnchorExists(pagePath, anchor)) {
        errors.push(`${file}: broken anchor ${href} → #${anchor} not found in target`);
      }
    } else {
      if (!fs.existsSync(pagePath)) {
        errors.push(`${file}: broken link ${href} → target not found (${pagePath})`);
      }
    }
  }

  errors.push(...validateCanonical(file, content));
}

const rssP = path.join(distDir, "rss.xml");
if (fs.existsSync(rssP)) {
  const rss = fs.readFileSync(rssP, "utf8");
  if (rss.includes("draft") || rss.includes("DRAFT-TEST-LEAK-MARKER"))
    errors.push("rss.xml: draft/blocked content");
  if ((rss.match(new RegExp(BASE_PATH.replace(/\//g, "\\/"), "g")) || []).length === 0)
    errors.push("rss.xml: no base path");
}

const siP = path.join(distDir, "search-index.json");
if (fs.existsSync(siP)) {
  const si = JSON.parse(fs.readFileSync(siP, "utf8"));
  for (const item of si) {
    if (item.status === "draft" || item.status === "blocked")
      errors.push(`search-index.json: ${item.status} item: ${item.title}`);
    if (item.href) {
      const bc = (item.href.match(new RegExp(BASE_PATH.replace(/\//g, "\\/"), "g")) || []).length;
      if (bc !== 1) errors.push(`search-index.json: bad base-path in ${item.title}: ${item.href}`);
    }
  }
}

if (errors.length) {
  console.error("LINK ERRORS:");
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Generated links: PASS (${htmlFiles.length} HTML, ${totalInternalLinks} internal links)`,
);

// ─── Self-tests ───
const testDir = path.join(distDir, "_link-self-test");
fs.mkdirSync(testDir, { recursive: true });

function selfTest(label, fn) {
  try {
    fn();
    console.log(`${label}: PASS`);
  } catch (e) {
    console.error(`${label}: FAIL — ${e.message}`);
    process.exit(1);
  }
}

selfTest("Positive route", () => {
  const aboutPath = path.join(distDir, "about", "index.html");
  if (!fs.existsSync(aboutPath)) throw new Error("about page not found — run build first");
});

selfTest("Positive anchor", () => {
  const page = path.join(testDir, "pos-anchor.html");
  fs.writeFileSync(page, '<html><body><div id="valid-target">OK</div></body></html>');
  const ok = validateAnchorExists(page, "valid-target");
  if (!ok) throw new Error("valid anchor #valid-target not found");
});

selfTest("Broken route", () => {
  const { pagePath } = resolveHrefTarget(
    `${BASE_PATH}/route-that-does-not-exist/`,
    path.join(distDir, "index.html"),
  );
  if (fs.existsSync(pagePath))
    throw new Error("non-existent route unexpectedly found at " + pagePath);
});

selfTest("Broken anchor", () => {
  const page = path.join(testDir, "neg-anchor.html");
  fs.writeFileSync(page, '<html><body><div id="only-this">OK</div></body></html>');
  const { pagePath, anchor } = resolveHrefTarget(
    `${BASE_PATH}/_link-self-test/neg-anchor.html#not-here`,
    path.join(distDir, "index.html"),
  );
  if (!fs.existsSync(pagePath)) throw new Error("test page not found: " + pagePath);
  if (validateAnchorExists(pagePath, anchor))
    throw new Error("broken anchor #not-here unexpectedly found");
});

fs.rmSync(testDir, { recursive: true, force: true });

console.log(
  `Positive routes: PASS\nPositive anchors: PASS\nBroken route rejected: PASS\nBroken anchor rejected: PASS`,
);
