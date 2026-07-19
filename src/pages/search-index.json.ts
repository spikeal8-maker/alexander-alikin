import { getCollection } from "astro:content";
import { siteUrl } from "@config/site";

export async function GET() {
  const collections = ["stories", "thoughts", "articles", "news"] as const;
  const entries: { title: string; description: string; href: string; type: string }[] = [];

  for (const col of collections) {
    const items = await getCollection(
      col as "stories" | "thoughts" | "articles" | "news",
      (e) => e.data.status === "published",
    );
    for (const item of items) {
      entries.push({
        title: item.data.title,
        description: item.data.description,
        href: siteUrl(`/journal/${col}/${item.data.slug}/`),
        type: item.data.type ?? col,
      });
    }
  }

  const projects = await getCollection("projects", (p) => p.data.status === "published");
  for (const p of projects) {
    entries.push({
      title: p.data.title,
      description: p.data.description,
      href: siteUrl(`/projects/${p.data.slug}/`),
      type: "project",
    });
  }

  return new Response(JSON.stringify(entries), {
    headers: { "Content-Type": "application/json" },
  });
}
