import type { Metadata } from 'next';
import { getArtistNameFallback } from '@/lib/config';

export const DEFAULT_PAGE_TITLE = 'Shop';

export function getPathnameFromHeaders(pathname: string | null | undefined) {
  return pathname && pathname.length > 0 ? pathname : '/';
}

export function formatCanonicalPath(pathname: string) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function formatCanonicalUrl(pathname: string, websiteUrl: string) {
  const canonicalPath = formatCanonicalPath(pathname);
  if (canonicalPath === '/') {
    return new URL('/', websiteUrl).href.replace(/\/$/, '');
  }
  return new URL(canonicalPath, websiteUrl).href;
}

export function getThemeColor() {
  return '#0f0d0b';
}

export function getSiteName(artistName?: string) {
  return `${artistName ?? getArtistNameFallback()} Shop`;
}

export function formatDocumentTitle(pageTitle: string, isRoot = false) {
  return isRoot ? DEFAULT_PAGE_TITLE : pageTitle;
}

export function formatPageTitle(pageTitle: string, artistName?: string) {
  return `${pageTitle} | ${getSiteName(artistName)}`;
}

export function getTitleTemplate(artistName?: string) {
  return `%s | ${getSiteName(artistName)}`;
}

export function getPageDescription(artistName?: string) {
  const name = artistName ?? getArtistNameFallback();
  return `Official merchandise shop of ${name}.`;
}

export function getPageSeo(pathname: string, artistName?: string) {
  const path = formatCanonicalPath(pathname);
  const name = getSiteName(artistName);

  const titles: Record<string, string> = {
    '/': formatDocumentTitle(DEFAULT_PAGE_TITLE, true),
    '/merch': 'Shop',
    '/cart': 'Cart',
    '/checkout': 'Checkout',
    '/terms': 'Terms & Conditions',
    '/payment/merch/success': 'Order Confirmed',
    '/payment/merch/cancelled': 'Checkout Cancelled',
  };

  const descriptions: Record<string, string> = {
    '/': getPageDescription(artistName),
    '/merch': `Shop official merchandise from ${name}.`,
    '/cart': `Your merch cart for ${name}.`,
    '/checkout': `Complete your merch order from ${name}.`,
    '/terms': `Terms and conditions for merchandise purchases from ${name}.`,
    '/payment/merch/success': `Thank you for your merch order from ${name}.`,
    '/payment/merch/cancelled': `Your merch checkout was not completed.`,
  };

  const documentTitle = titles[path] ?? DEFAULT_PAGE_TITLE;

  return {
    documentTitle,
    description: descriptions[path] ?? getPageDescription(artistName),
    fullTitle: formatPageTitle(documentTitle, artistName),
  };
}

export function createPageMetadata(
  pageTitle: string,
  description?: string,
): Metadata {
  return {
    title: pageTitle,
    description: description ?? getPageDescription(),
  };
}
