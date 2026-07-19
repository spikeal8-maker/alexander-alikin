export function pagePath(path = '/') {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const clean = path.replace(/^\/+/, '');
  return clean ? `${base}${clean}` : base;
}

export function absolutePageUrl(path = '/') {
  return new URL(pagePath(path), import.meta.env.SITE).toString();
}
