export async function checkV2Design(page, name, vpWidth) {
  return await page.evaluate(
    ({ name, vpW }) => {
      const rootStyle = getComputedStyle(document.documentElement);
      const bodyStyle = getComputedStyle(document.body);
      const issues = [];
      const isEditorial = Boolean(rootStyle.getPropertyValue("--gn-bg").trim());
      const isV3 = Boolean(rootStyle.getPropertyValue("--v3-paper").trim());

      if (isEditorial) {
        for (const token of ["--gn-bg", "--gn-ink", "--gn-blue", "--gn-gutter"]) {
          if (!rootStyle.getPropertyValue(token).trim()) issues.push(`${token} not defined`);
        }

        const bodyBackground = bodyStyle.backgroundColor;
        if (
          !bodyBackground ||
          bodyBackground === "transparent" ||
          bodyBackground === "rgba(0, 0, 0, 0)"
        ) {
          issues.push(`Editorial body bg=${bodyBackground}`);
        }
        if (bodyStyle.fontFamily.includes("Times New Roman") || bodyStyle.fontFamily === "serif") {
          issues.push(`Editorial body font=${bodyStyle.fontFamily} (unstyled)`);
        }

        const header = document.querySelector(".gn-header");
        if (!header || parseFloat(getComputedStyle(header).height) <= 0) {
          issues.push("Editorial header missing");
        }

        if (name === "home") {
          const heroTitle = document.querySelector(".gn-hero h1");
          if (!heroTitle) {
            issues.push("Editorial hero title missing");
          } else if (vpW >= 1024 && parseFloat(getComputedStyle(heroTitle).fontSize) < 56) {
            issues.push(`Editorial hero title too small: ${getComputedStyle(heroTitle).fontSize}`);
          }

          const primary = document.querySelector(".gn-hero .gn-button");
          if (!primary) {
            issues.push("Editorial primary CTA missing");
          } else {
            const style = getComputedStyle(primary);
            if (!style.backgroundColor || style.backgroundColor === "rgba(0, 0, 0, 0)") {
              issues.push("Editorial primary CTA background missing");
            }
            if (parseFloat(style.minHeight) < 40) {
              issues.push(`Editorial primary CTA min-height=${style.minHeight}`);
            }
          }
          return issues;
        }

        const internalTitle = document.querySelector(".gp-hero h1, .gr-header h1, .gu-404 h1");
        if (
          internalTitle &&
          vpW >= 1024 &&
          parseFloat(getComputedStyle(internalTitle).fontSize) < 44
        ) {
          issues.push(
            `Editorial internal title too small: ${getComputedStyle(internalTitle).fontSize}`,
          );
        }
        return issues;
      }

      if (isV3) {
        for (const token of ["--v3-paper", "--v3-ink", "--v3-cobalt", "--v3-gutter"]) {
          if (!rootStyle.getPropertyValue(token).trim()) issues.push(`${token} not defined`);
        }

        const bodyBackground = bodyStyle.backgroundColor;
        if (
          !bodyBackground ||
          bodyBackground === "transparent" ||
          bodyBackground === "rgba(0, 0, 0, 0)"
        ) {
          issues.push(`V3 body bg=${bodyBackground}`);
        }
        if (bodyStyle.fontFamily.includes("Times New Roman") || bodyStyle.fontFamily === "serif") {
          issues.push(`V3 body font=${bodyStyle.fontFamily} (unstyled)`);
        }

        const header = document.querySelector(".v3-header");
        if (!header || parseFloat(getComputedStyle(header).height) <= 0) {
          issues.push("V3 header missing");
        }
        return issues;
      }

      if (!rootStyle.getPropertyValue("--color-bg").trim()) issues.push("--color-bg not defined");
      if (!rootStyle.getPropertyValue("--space-4").trim()) issues.push("--space-4 not defined");
      const background = bodyStyle.backgroundColor;
      if (
        !background ||
        background === "transparent" ||
        background === "rgba(0, 0, 0, 0)" ||
        background === "rgb(255, 255, 255)"
      ) {
        issues.push(`body bg=${background} (expected graphite)`);
      }
      const fontFamily = bodyStyle.fontFamily;
      if (fontFamily.includes("Times New Roman") || fontFamily === "serif") {
        issues.push(`body font=${fontFamily} (unstyled)`);
      }
      const header = document.querySelector("header");
      if (!header) {
        issues.push("no <header>");
      } else if (parseFloat(getComputedStyle(header).height) <= 0) {
        issues.push("header height=0");
      }
      return issues;
    },
    { name, vpW: vpWidth },
  );
}
