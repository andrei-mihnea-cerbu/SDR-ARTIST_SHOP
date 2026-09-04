import { API_BASE_URL } from "@/lib/config";

export type ApiResponse<T> = { data: T | null; status: number };

function prepareHeaders(options: RequestInit): Headers {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  return headers;
}

function resolveUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const normalized = url.startsWith("/") ? url : `/${url}`;
  return `${API_BASE_URL}${normalized}`;
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  return fetch(resolveUrl(url), {
    ...options,
    headers: prepareHeaders(options),
    cache: "no-store",
  });
}

export async function apiFetchJson<T>(url: string, options: RequestInit = {}) {
  const response = await apiFetch(url, options);

  if (response.status === 204 || response.status === 205) {
    return { data: null, status: response.status };
  }
  if (response.status === 404 || response.status === 400 || !response.ok) {
    return { data: null, status: response.status };
  }

  const text = await response.text();
  if (!text.trim()) return { data: null, status: response.status };

  try {
    return { data: JSON.parse(text) as T, status: response.status };
  } catch {
    return { data: null, status: response.status };
  }
}
