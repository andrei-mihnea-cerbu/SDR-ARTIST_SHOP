export const API_BASE_URL =
  process.env.API_BASE_URL ?? 'https://api.smokindudesrecords.com';

export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://api.smokindudesrecords.com';

export const MAIN_SITE_URL = 'https://smokindudesrecords.com';

export type ParsedHostname = {
  /** Apex host used for artist lookup (no www / shop). */
  hostname: string;
  /** True when the request came from shop.{artist-domain}. */
  isShopHost: boolean;
};

/**
 * Normalize a host for artist resolution.
 * Strips protocol, port, path, leading www., and leading shop. (shop.artist.com → artist.com).
 */
export function parseHostname(value: string): ParsedHostname {
  let host = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split(':')[0];

  const isShopHost = host.startsWith('shop.') && host.split('.').length > 2;

  if (isShopHost) {
    host = host.slice('shop.'.length);
  }

  return { hostname: host, isShopHost };
}

export function isLocalHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname.endsWith('.localhost');
}

export function getLocalArtistOrigin() {
  return process.env.NEXT_PUBLIC_ARTIST_ORIGIN ?? 'http://localhost:3000';
}

export function artistSiteUrl(hostname: string, path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const suffix = normalized === '/' ? '' : normalized;
  if (isLocalHostname(hostname)) {
    return `${getLocalArtistOrigin()}${suffix}`;
  }
  return `https://${hostname}${suffix}`;
}

export function normalizeHostname(value: string): string {
  return parseHostname(value).hostname;
}

export async function getRequestHostname(): Promise<string> {
  const { headers } = await import('next/headers');
  const headersList = await headers();

  const forwarded = headersList.get('x-website-host');
  if (forwarded) return normalizeHostname(forwarded);

  const xForwardedHost = headersList.get('x-forwarded-host');
  if (xForwardedHost) {
    return normalizeHostname(xForwardedHost.split(',')[0] ?? '');
  }

  const host = headersList.get('host');
  if (host) return normalizeHostname(host);

  const envDomain = process.env.NEXT_PUBLIC_WEBSITE_DOMAIN?.trim();
  if (envDomain) return normalizeHostname(envDomain);

  return 'localhost';
}

export async function getWebsiteUrl(): Promise<string> {
  const domain = await getRequestHostname();
  if (isLocalHostname(domain)) {
    return 'http://localhost:3001';
  }
  return `https://shop.${domain}`;
}

export async function getContactEmail(): Promise<string> {
  const domain = await getRequestHostname();
  return `contact@${domain}`;
}

export function getArtistNameFallback() {
  return process.env.NEXT_PUBLIC_ARTIST_NAME ?? 'Artist';
}
