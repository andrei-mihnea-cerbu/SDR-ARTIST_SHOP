import { ImageResponse } from 'next/og';
import { ArtistFaviconImage } from '@/lib/favicon-image';
import { getArtistByWebsite, getArtistIconFetchUrl } from '@/lib/artist';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default async function AppleIcon() {
  const artist = await getArtistByWebsite();
  const iconUrl = artist ? getArtistIconFetchUrl(artist) : null;

  if (iconUrl) {
    const response = await fetch(iconUrl, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      return new Response(buffer, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') ?? 'image/webp',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
  }

  return new ImageResponse(<ArtistFaviconImage size={size.width} />, {
    ...size,
  });
}
