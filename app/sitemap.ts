import { getWebsiteUrl } from '@/lib/config';
import { formatCanonicalUrl } from '@/lib/site-metadata';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const websiteUrl = await getWebsiteUrl();

  return [
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
}
