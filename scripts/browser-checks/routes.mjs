const BASE = "/alexander-alikin";

export const ROUTES = [
  { name: "home", path: `${BASE}/` },
  { name: "about", path: `${BASE}/about/` },
  { name: "business", path: `${BASE}/business/` },
  { name: "education", path: `${BASE}/education/` },
  { name: "projects", path: `${BASE}/projects/` },
  { name: "izo-asa", path: `${BASE}/projects/izo-asa/` },
  { name: "engineering-education", path: `${BASE}/projects/engineering-education/` },
  { name: "journal", path: `${BASE}/journal/` },
  { name: "articles", path: `${BASE}/journal/articles/` },
  { name: "project-learning", path: `${BASE}/journal/articles/project-learning/` },
  { name: "stories", path: `${BASE}/journal/stories/` },
  { name: "children-and-robots", path: `${BASE}/journal/stories/children-and-robots/` },
  { name: "one-method", path: `${BASE}/journal/stories/one-method/` },
  { name: "thoughts", path: `${BASE}/journal/thoughts/` },
  { name: "projects-over-theory", path: `${BASE}/journal/thoughts/projects-over-theory/` },
  { name: "news", path: `${BASE}/journal/news/` },
  { name: "video", path: `${BASE}/journal/video/` },
  { name: "contacts", path: `${BASE}/contacts/` },
  { name: "collaboration", path: `${BASE}/collaboration/` },
  { name: "now", path: `${BASE}/now/` },
  { name: "facts", path: `${BASE}/facts/` },
  { name: "second-brain", path: `${BASE}/second-brain/` },
  { name: "press", path: `${BASE}/press/` },
  { name: "search", path: `${BASE}/search/` },
  { name: "privacy", path: `${BASE}/privacy/` },
];

export const VIEWPORTS = [
  { name: "320", width: 320, height: 568 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
];

export const SCREENSHOT_NAMES = new Set([
  "home",
  "about",
  "business",
  "education",
  "projects",
  "izo-asa",
  "engineering-education",
  "journal",
  "project-learning",
  "children-and-robots",
  "projects-over-theory",
  "collaboration",
  "contacts",
  "now",
  "facts",
  "second-brain",
  "press",
  "search",
  "privacy",
  "video",
]);

export const NOT_FOUND_PATH = `${BASE}/missing-owner-review-route/`;
export { BASE };
