import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const sitemapUrl = `${import.meta.env.SITE_URL ?? "https://spikeal8-maker.github.io"}${"/alexander-alikin"}/sitemap-index.xml`;
  return new Response(`User-agent: *\nDisallow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: { "Content-Type": "text/plain" },
  });
};
