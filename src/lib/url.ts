export function trimTrailingSlash(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function joinPath(...segments: string[]): string {
  return "/" + segments.filter(Boolean).join("/").replace(/\/+/g, "/");
}
