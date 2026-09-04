import { getArtistNameFallback } from "@/lib/config";

export function getArtistInitial(name?: string) {
  const source = (name ?? getArtistNameFallback()).trim();
  if (!source) return "A";
  return source.charAt(0).toUpperCase();
}

export function getFaviconColors() {
  return {
    background: "#e85d04",
    foreground: "#f5f0e8",
  };
}
