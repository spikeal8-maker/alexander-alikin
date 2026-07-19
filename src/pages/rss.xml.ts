import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "@config/site";

export async function GET() {
  const stories = await getCollection("stories", (s) => s.data.status === "published");
  const thoughts = await getCollection("thoughts", (s) => s.data.status === "published");
  const articles = await getCollection("articles", (s) => s.data.status === "published");
  const all = [...stories, ...thoughts, ...articles].sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );

  return rss({
    title: site.title,
    description: site.description,
    site: `${site.url}${site.basePath}`,
    items: all.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.publishedAt,
      link: `/journal/${entry.collection}/${entry.data.slug}/`,
    })),
    customData: `<language>${site.lang}</language>`,
  });
}
