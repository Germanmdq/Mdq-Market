export function normalizeSearchQuery(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function buildSearchHref(rawQuery: string, fallbackPath = "/productos") {
  const cleanQuery = normalizeSearchQuery(rawQuery);

  if (!cleanQuery) return fallbackPath;

  return `${fallbackPath}?q=${encodeURIComponent(cleanQuery)}`;
}

export function sanitizePostgrestSearchTerm(rawQuery: string) {
  return normalizeSearchQuery(rawQuery)
    .replace(/[%_]/g, "\\$&")
    .replace(/[,\(\)\{\}\[\]\"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
