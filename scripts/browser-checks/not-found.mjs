import path from "node:path";

export async function checkNotFound({
  page,
  site,
  notFoundPath,
  viewports,
  screenshotDir,
  checkDesign,
  errors,
}) {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const response = await page.goto(`${site}${notFoundPath}`, { waitUntil: "networkidle" });
    if (response?.status() !== 404) {
      errors.push(`not-found @${viewport.name}: expected HTTP 404, got ${response?.status()}`);
    }
    const bodyText = await page.evaluate(() => document.body.innerText || "");
    if (!bodyText.includes("Такой страницы нет")) {
      errors.push(`not-found @${viewport.name}: V2 404 content missing`);
    }
    const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth + 2);
    if (overflow) errors.push(`not-found @${viewport.name}: horizontal overflow`);
    for (const issue of await checkDesign(page, "not-found", viewport.width)) {
      errors.push(`not-found @${viewport.name}: ${issue}`);
    }
  }

  for (const viewport of [
    { suffix: "desktop", width: 1440, height: 900 },
    { suffix: "mobile", width: 390, height: 844 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${site}${notFoundPath}`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(screenshotDir, `not-found-${viewport.suffix}.png`),
      fullPage: true,
    });
  }
}
