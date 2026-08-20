import { notFound } from 'next/navigation';
import {
  API_BASE_URL,
  PUBLIC_API_URL,
  getArtistNameFallback,
  getRequestHostname,
  normalizeHostname,
} from '@/lib/config';
import { serverApiGet } from '@/lib/server-api';
import type { Artist } from '@/types';

export type ArtistPhotoType = 'avatar' | 'banner' | 'favicon';

function normalizeArtist(data: Artist | Artist[] | null): Artist | null {
  if (!data) return null;
  return Array.isArray(data) ? (data[0] ?? null) : data;
}

export async function getArtistByWebsite(website?: string) {
  const domain = normalizeHostname(website ?? (await getRequestHostname()));
  if (!domain || domain === 'localhost') return null;

  const data = await serverApiGet<Artist | Artist[]>('/artists', {
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
  return artist.type === 'group';
}

export function getArtistPhotoUrl(
  artistId: string,
  type: ArtistPhotoType = 'banner',
) {
  return `${PUBLIC_API_URL}/artists/${artistId}/photo?type=${type}`;
}

export function getArtistPhotoFetchUrl(
  artistId: string,
  type: ArtistPhotoType = 'banner',
) {
  return `${API_BASE_URL}/artists/${artistId}/photo?type=${type}`;
}
