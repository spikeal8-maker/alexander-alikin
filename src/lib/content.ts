export function isPublished<T extends { data: { draft: boolean } }>(entry: T) {
  return !entry.data.draft;
}

export function byNewest<
  T extends { data: { publishedAt: Date; updatedAt?: Date } }
>(a: T, b: T) {
  const aDate = a.data.updatedAt ?? a.data.publishedAt;
  const bDate = b.data.updatedAt ?? b.data.publishedAt;
  return bDate.getTime() - aDate.getTime();
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
