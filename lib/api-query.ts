export function withQuery(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!params) return normalized;

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `${normalized}?${query}` : normalized;
}
