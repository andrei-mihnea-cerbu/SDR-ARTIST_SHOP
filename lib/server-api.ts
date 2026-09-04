import { withQuery } from "@/lib/api-query";
import { apiFetchJson } from "@/lib/fetcher";

export async function serverApiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  const url = withQuery(path, params);
  const { data } = await apiFetchJson<T>(url);
  return data;
}
