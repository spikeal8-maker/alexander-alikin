export async function checkV2Design(page, name, vpWidth) {
  return await page.evaluate(
    ({ name, vpW }) => {
      const cs = getComputedStyle(document.documentElement);
      const bodyCs = getComputedStyle(document.body);
      const iss = [];
      if (!cs.getPropertyValue("--color-bg").trim()) iss.push("--color-bg not defined");
      if (!cs.getPropertyValue("--space-4").trim()) iss.push("--space-4 not defined");
      const bg = bodyCs.backgroundColor;
      if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)" || bg === "rgb(255, 255, 255)")
        iss.push(`body bg=${bg} (expected graphite)`);
      const ff = bodyCs.fontFamily;
      if (ff.includes("Times New Roman") || ff === "serif") iss.push(`body font=${ff} (unstyled)`);
      const btn = document.querySelector(".v2-btn-accent");
      if (btn) {
        const bcs = getComputedStyle(btn);
        if (bcs.display === "inline") iss.push(".v2-btn-accent display=inline");
        const bbg = bcs.backgroundColor;
        if (!bbg || bbg === "transparent" || bbg === "rgba(0, 0, 0, 0)")
          iss.push(`.v2-btn-accent bg=${bbg}`);
        if (parseFloat(bcs.paddingLeft) <= 0) iss.push(".v2-btn-accent no padding-left");
        if (parseFloat(bcs.minHeight) < 40) iss.push(`.v2-btn-accent min-height=${bcs.minHeight}`);
      }
      if (vpW >= 1024 && name === "home") {
        const heroName = document.querySelector(".v2-hero-name");
        if (heroName) {
          const hfs = parseFloat(getComputedStyle(heroName).fontSize);
          if (hfs < 48) iss.push(`.v2-hero-name font-size=${hfs}px (<48)`);
        }
      }
      const container = document.querySelector(".v2-container");
      if (container) {
        const cmw = getComputedStyle(container).maxWidth;
        if (!cmw || cmw === "none") iss.push(".v2-container max-width=none");
      }
      const header = document.querySelector("header");
      if (!header) {
        iss.push("no <header>");
      } else {
        if (parseFloat(getComputedStyle(header).height) <= 0) iss.push("header height=0");
        const hbg = getComputedStyle(header).backgroundColor;
        if (!hbg || hbg === "transparent" || hbg === "rgba(0, 0, 0, 0)")
          iss.push(`header bg=${hbg} (expected dark)`);
      }
      return iss;
    },
    { name, vpW: vpWidth },
  );
}
