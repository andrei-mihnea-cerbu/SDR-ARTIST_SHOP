export type CdnPreset = "thumb" | "card" | "poster";

const CDN_ORIGIN = "https://cdn.amc-dev.com";

function pathnameOf(url: string): string | null {
  try {
    if (url.includes("://")) return new URL(url).pathname;
    return url.startsWith("/") ? url : `/${url}`;
  } catch {
    return null;
  }
}

function versionQuery(url: string): string {
  try {
    const parsed = url.includes("://")
      ? new URL(url)
      : new URL(url, "https://cdn.amc-dev.com");
    const value = parsed.searchParams.get("v");
    if (!value) return "";
    return `?v=${encodeURIComponent(value)}`;
  } catch {
    return "";
  }
}

export function toCdnDisplayUrl(
  url: string,
  preset: CdnPreset = "thumb",
): string {
  const trimmed = (url || "").trim();
  if (!trimmed) return trimmed;
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/t/")
  ) {
    return trimmed;
  }

  const pathname = pathnameOf(trimmed);
  if (!pathname) return trimmed;
  if (
    /\.(mp3|wav|flac|aac|ogg|m4a|mp4|mov|webm|m4v|mkv|pdf)(\?|$)/i.test(
      pathname,
    )
  ) {
    return trimmed;
  }

  const cdnMatch = pathname.match(
    /^\/t\/(?:thumb|card|poster)\/([0-9a-f-]{36})\/([0-9a-f]{32})\/(.+)$/i,
  );
  if (!cdnMatch) return trimmed;

  return `${CDN_ORIGIN}/t/${preset}/${cdnMatch[1]}/${cdnMatch[2]}/${cdnMatch[3]}${versionQuery(trimmed)}`;
}
