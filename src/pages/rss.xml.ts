import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import { pagePath } from '../lib/url';

export async function GET(context) {
  const [stories, thoughts, news] = await Promise.all([
    getCollection('stories', ({ data }) => !data.draft),
    getCollection('thoughts', ({ data }) => !data.draft),
    getCollection('news', ({ data }) => !data.draft)
  ]);
  const items = [
    ...stories.map((entry) => ({ title: entry.data.title, description: entry.data.description, pubDate: entry.data.publishedAt, link: pagePath(`/stories/${entry.id}/`) })),
    ...thoughts.map((entry) => ({ title: entry.data.title, description: entry.data.description, pubDate: entry.data.publishedAt, link: pagePath(`/thoughts/${entry.id}/`) })),
    ...news.map((entry) => ({ title: entry.data.title, description: entry.data.description, pubDate: entry.data.publishedAt, link: pagePath(`/news/${entry.id}/`) }))
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({ title: `${site.name} — новые материалы`, description: site.description, site: context.site, items });
}
