import MerchCatalog from '@/components/MerchCatalog';
import { requireArtist } from '@/lib/artist';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata(
  'Shop',
  'Browse the official merchandise collection.',
);

export default async function ShopHomePage() {
  const artist = await requireArtist();
  return <MerchCatalog artist={artist} />;
}
