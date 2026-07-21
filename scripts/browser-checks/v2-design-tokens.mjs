export async function checkV2Design(page, name, vpWidth) {
  return await page.evaluate(
    ({ name, vpW }) => {
      const rootStyle = getComputedStyle(document.documentElement);
      const bodyStyle = getComputedStyle(document.body);
      const issues = [];
      const isV3 = Boolean(rootStyle.getPropertyValue("--v3-paper").trim());

      if (isV3) {
        for (const token of ["--v3-paper", "--v3-ink", "--v3-cobalt", "--v3-gutter"]) {
          if (!rootStyle.getPropertyValue(token).trim()) issues.push(`${token} not defined`);
        }

        const bodyBackground = bodyStyle.backgroundColor;
        if (!bodyBackground || bodyBackground === "transparent" || bodyBackground === "rgba(0, 0, 0, 0)") {
          issues.push(`V3 body bg=${bodyBackground}`);
        }
        if (bodyStyle.fontFamily.includes("Times New Roman") || bodyStyle.fontFamily === "serif") {
          issues.push(`V3 body font=${bodyStyle.fontFamily} (unstyled)`);
        }

        const heroTitle = document.querySelector(".v3-display");
        if (!heroTitle) {
          issues.push("V3 hero title missing");
        } else if (vpW >= 1024 && parseFloat(getComputedStyle(heroTitle).fontSize) < 64) {
          issues.push(`V3 hero title too small: ${getComputedStyle(heroTitle).fontSize}`);
        }

        const primary = document.querySelector(".v3-hero__primary");
        if (!primary) {
          issues.push("V3 primary CTA missing");
        } else {
          const style = getComputedStyle(primary);
          if (!style.backgroundColor || style.backgroundColor === "rgba(0, 0, 0, 0)") {
            issues.push("V3 primary CTA background missing");
          }
          if (parseFloat(style.minHeight) < 40) issues.push(`V3 primary CTA min-height=${style.minHeight}`);
        }

        const portrait = document.querySelector(".v3-hero__portrait img");
        if (!portrait || portrait.getBoundingClientRect().height < 280) {
          issues.push("V3 portrait composition missing or too small");
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
      const button = document.querySelector(".v2-btn-accent");
      if (button) {
        const buttonStyle = getComputedStyle(button);
        if (buttonStyle.display === "inline") issues.push(".v2-btn-accent display=inline");
        const buttonBackground = buttonStyle.backgroundColor;
        if (!buttonBackground || buttonBackground === "transparent" || buttonBackground === "rgba(0, 0, 0, 0)") {
          issues.push(`.v2-btn-accent bg=${buttonBackground}`);
        }
        if (parseFloat(buttonStyle.paddingLeft) <= 0) issues.push(".v2-btn-accent no padding-left");
        if (parseFloat(buttonStyle.minHeight) < 40) {
          issues.push(`.v2-btn-accent min-height=${buttonStyle.minHeight}`);
        }
      }
      if (vpW >= 1024 && name === "home") {
        const heroName = document.querySelector(".v2-hero-name");
        if (heroName) {
          const fontSize = parseFloat(getComputedStyle(heroName).fontSize);
          if (fontSize < 48) issues.push(`.v2-hero-name font-size=${fontSize}px (<48)`);
        }
      }
      const container = document.querySelector(".v2-container");
      if (container) {
        const maxWidth = getComputedStyle(container).maxWidth;
        if (!maxWidth || maxWidth === "none") issues.push(".v2-container max-width=none");
      }
      const header = document.querySelector("header");
      if (!header) {
        issues.push("no <header>");
      } else {
        if (parseFloat(getComputedStyle(header).height) <= 0) issues.push("header height=0");
        const headerBackground = getComputedStyle(header).backgroundColor;
        if (!headerBackground || headerBackground === "transparent" || headerBackground === "rgba(0, 0, 0, 0)") {
          issues.push(`header bg=${headerBackground} (expected dark)`);
        }
      }
      return issues;
    },
    { name, vpW: vpWidth },
  );
}
