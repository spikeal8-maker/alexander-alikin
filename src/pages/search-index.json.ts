import { getCollection } from 'astro:content';
import { pagePath } from '../lib/url';

export async function GET() {
  const [projects, stories, thoughts, news] = await Promise.all([
    getCollection('projects', ({ data }) => !data.draft),
    getCollection('stories', ({ data }) => !data.draft),
    getCollection('thoughts', ({ data }) => !data.draft),
    getCollection('news', ({ data }) => !data.draft)
  ]);
  const index = [
    ...projects.map((entry) => ({ type: 'Проект', title: entry.data.title, description: entry.data.description, topics: entry.data.topics, url: pagePath(`/projects/${entry.id}/`) })),
    ...stories.map((entry) => ({ type: 'История', title: entry.data.title, description: entry.data.description, topics: entry.data.topics, url: pagePath(`/stories/${entry.id}/`) })),
    ...thoughts.map((entry) => ({ type: 'Мысль', title: entry.data.title, description: entry.data.description, topics: entry.data.topics, url: pagePath(`/thoughts/${entry.id}/`) })),
    ...news.map((entry) => ({ type: 'Новость', title: entry.data.title, description: entry.data.description, topics: entry.data.topics, url: pagePath(`/news/${entry.id}/`) }))
  ];
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
