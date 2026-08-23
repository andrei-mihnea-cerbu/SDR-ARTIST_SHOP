import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { Toaster } from 'sonner';
import './globals.css';
import {
  formatCanonicalUrl,
  getPageSeo,
  getPathnameFromHeaders,
  getSiteName,
  getThemeColor,
  getTitleTemplate,
} from '@/lib/site-metadata';
import { getWebsiteUrl } from '@/lib/config';
import { getArtistByWebsite, getArtistPhotoUrl } from '@/lib/artist';

export async function generateViewport(): Promise<Viewport> {
  return { themeColor: getThemeColor(), width: 'device-width', initialScale: 1 };
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = getPathnameFromHeaders(headersList.get('x-pathname'));
  const websiteUrl = await getWebsiteUrl();
  const artist = await getArtistByWebsite();
  const artistName = artist?.name;
  const pageSeo = getPageSeo(pathname, artistName);
  const siteName = getSiteName(artistName);
  const ogImage = artist?.id
    ? getArtistPhotoUrl(artist.id, 'banner')
    : undefined;
  const canonicalUrl = formatCanonicalUrl(pathname, websiteUrl);

  return {
    metadataBase: new URL(websiteUrl),
    title: {
      default: pageSeo.fullTitle,
      template: getTitleTemplate(artistName),
    },
    description: pageSeo.description,
    applicationName: siteName,
    alternates: { canonical: canonicalUrl },
    appleWebApp: {
      title: siteName,
      statusBarStyle: 'black-translucent',
      capable: true,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: pageSeo.documentTitle,
      description: pageSeo.description,
      siteName,
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage,
                width: 1920,
                height: 1080,
                alt: siteName,
              },
            ],
          }
        : {}),
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="artist-page-bg antialiased">
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
