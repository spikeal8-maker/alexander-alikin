export const site = {
  name: "Александр Аликин",
  title: "Александр Аликин — проекты, системы и мысли",
  description:
    "Инженер. Педагог. Предприниматель. Исследую сложные системы, создаю работающие проекты и рассказываю, чему они меня научили.",
  url: (import.meta.env.SITE_URL ?? "https://spikeal8-maker.github.io") as string,
  basePath: "/alexander-alikin",
  lang: "ru",
  prelaunch: (import.meta.env.SITE_MODE ?? "prelaunch") !== "production",
  owner: "Александр Аликин",
} as const;

export const navigation = {
  primary: [
    { label: "Обо мне", href: "/about/", id: "about" },
    { label: "Проекты", href: "/projects/", id: "projects" },
    { label: "Бизнесу", href: "/business/", id: "business" },
    { label: "Образованию", href: "/education/", id: "education" },
    { label: "Журнал", href: "/journal/", id: "journal" },
    { label: "Обсудить задачу", href: "/collaboration/", id: "collaboration", cta: true },
  ],
  utility: [
    { label: "Сейчас", href: "/now/", id: "now" },
    { label: "Как я мыслю", href: "/second-brain/", id: "second-brain" },
    { label: "Факты и источники", href: "/facts/", id: "facts" },
    { label: "Для СМИ", href: "/press/", id: "press" },
    { label: "Контакты", href: "/contacts/", id: "contacts" },
    { label: "Поиск", href: "/search/", id: "search" },
    { label: "RSS", href: "/rss.xml", id: "rss" },
    { label: "Конфиденциальность", href: "/privacy/", id: "privacy" },
  ],
} as const;

export const evidenceLevels = ["author_statement", "public_source", "document_verified"] as const;
export type EvidenceLevel = (typeof evidenceLevels)[number];

export const publicationStatuses = [
  "draft",
  "review",
  "ready",
  "published",
  "blocked",
  "archived",
] as const;
export type PublicationStatus = (typeof publicationStatuses)[number];

export const publicStatuses: PublicationStatus[] = ["published"];

export const topicList = [
  "инженерия",
  "педагогика",
  "предпринимательство",
  "ИИ",
  "автоматизация",
  "образование",
  "робототехника",
  "продуктовая разработка",
  "управление знаниями",
  "методология",
] as const;

export function buildUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${site.basePath}${normalized}`;
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${normalized}`;
}

export function siteUrl(path: string): string {
  return `${site.url}${site.basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
