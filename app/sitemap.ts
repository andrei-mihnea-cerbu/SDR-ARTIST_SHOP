import { getArtistByWebsite } from '@/lib/artist';
import { getWebsiteUrl } from '@/lib/config';
import { serverApiGet } from '@/lib/server-api';
import { formatCanonicalUrl } from '@/lib/site-metadata';
import type { PrintifyProduct } from '@/types';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const websiteUrl = await getWebsiteUrl();
  const entries: MetadataRoute.Sitemap = [
    {
      url: formatCanonicalUrl('/', websiteUrl),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: formatCanonicalUrl('/terms', websiteUrl),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const artist = await getArtistByWebsite();
  if (!artist) return entries;

  const products =
    (await serverApiGet<PrintifyProduct[]>('/printify/products', {
      artistId: artist.id,
    })) ?? [];

  for (const product of products) {
    entries.push({
      url: formatCanonicalUrl(`/merch/${product.id}`, websiteUrl),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  return entries;
}
