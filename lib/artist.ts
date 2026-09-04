import { notFound } from "next/navigation";
import {
  API_BASE_URL,
  PUBLIC_API_URL,
  getArtistNameFallback,
  getRequestHostname,
  isLocalHostname,
  normalizeHostname,
} from "@/lib/config";
import { toCdnDisplayUrl, type CdnPreset } from "@/lib/cdn";
import { serverApiGet } from "@/lib/server-api";
import type { Artist } from "@/types";

export type ArtistPhotoType = "avatar" | "banner" | "favicon";

const DISPLAY_PRESET: Record<ArtistPhotoType, CdnPreset> = {
  avatar: "card",
  banner: "poster",
  favicon: "thumb",
};

function normalizeArtist(data: Artist | Artist[] | null): Artist | null {
  if (!data) return null;
  return Array.isArray(data) ? (data[0] ?? null) : data;
}

export async function getArtistByWebsite(website?: string) {
  const domain = normalizeHostname(website ?? (await getRequestHostname()));
  if (!domain || isLocalHostname(domain)) return null;

  const data = await serverApiGet<Artist | Artist[]>("/artists", {
    website: domain,
  });
  return normalizeArtist(data);
}

export async function requireArtist() {
  const artist = await getArtistByWebsite();
  if (!artist) notFound();
  return artist;
}

export function getArtistDisplayName(artist?: Artist | null) {
  return artist?.name ?? getArtistNameFallback();
}

export function isGroupArtist(artist: Artist) {
  return artist.type === "group";
}

export function getArtistPhotoUrl(
  artistId: string,
  type: ArtistPhotoType = "banner",
) {
  return `${PUBLIC_API_URL}/artists/${artistId}/photo?type=${type}`;
}

export function getArtistPhotoFetchUrl(
  artistId: string,
  type: ArtistPhotoType = "banner",
) {
  return `${API_BASE_URL}/artists/${artistId}/photo?type=${type}`;
}

function cdnField(artist: Artist, type: ArtistPhotoType): string | undefined {
  if (type === "avatar") return artist.avatarUrl;
  if (type === "banner") return artist.bannerUrl;
  return artist.faviconUrl;
}

function hasPhoto(artist: Artist, type: ArtistPhotoType): boolean {
  if (type === "avatar") return Boolean(artist.hasAvatar);
  if (type === "banner") return Boolean(artist.hasBanner);
  return Boolean(artist.hasFavicon);
}

export function getArtistDisplayPhotoUrl(
  artist: Artist,
  type: ArtistPhotoType = "banner",
  preset: CdnPreset = DISPLAY_PRESET[type],
): string | null {
  const cdn = cdnField(artist, type)?.trim();
  if (cdn) return toCdnDisplayUrl(cdn, preset);
  if (!hasPhoto(artist, type) || !artist.id) return null;
  return getArtistPhotoUrl(artist.id, type);
}

export function getArtistIconFetchUrl(artist: Artist): string | null {
  const cdn = artist.faviconUrl?.trim();
  if (cdn) return toCdnDisplayUrl(cdn, "thumb");
  if (!artist.hasFavicon || !artist.id) return null;
  return getArtistPhotoFetchUrl(artist.id, "favicon");
}
