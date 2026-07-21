export async function findOverflowOffenders(page) {
  return await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    return [...document.querySelectorAll("*")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const rightExcess = Math.max(0, rect.right - viewportWidth);
        const leftExcess = Math.max(0, -rect.left);
        const internalExcess = Math.max(0, element.scrollWidth - element.clientWidth);
        return {
          selector: element.id
            ? `#${element.id}`
            : element.className?.toString?.().trim()
              ? `${element.tagName.toLowerCase()}.${element.className.toString().trim().replace(/\s+/g, ".")}`
              : element.tagName.toLowerCase(),
          text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80) || "",
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          minWidth: style.minWidth,
          position: style.position,
          display: style.display,
          grid: style.gridTemplateColumns,
          excess: Math.max(rightExcess, leftExcess, internalExcess),
        };
      })
      .filter((candidate) => candidate.excess > 2)
      .sort((a, b) => b.excess - a.excess)
      .slice(0, 12);
  });
}
