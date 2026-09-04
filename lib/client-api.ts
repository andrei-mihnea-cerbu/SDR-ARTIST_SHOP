import { withQuery } from "@/lib/api-query";
import { apiFetchJson } from "@/lib/fetcher";

export async function clientApiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  const url = withQuery(path, params);
  const { data } = await apiFetchJson<T>(url);
  return data;
}

export async function clientApiPost<T>(path: string, body?: unknown) {
  return apiFetchJson<T>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}
