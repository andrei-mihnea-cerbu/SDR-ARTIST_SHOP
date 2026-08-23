import MerchCatalog from '@/components/MerchCatalog';
import { requireArtist } from '@/lib/artist';
import { createPageMetadata } from '@/lib/site-metadata';

export async function generateMetadata() {
  const artist = await requireArtist();
  return createPageMetadata(
    'Shop',
    `Browse the official merchandise collection from ${artist.name}.`,
  );
}

export default async function ShopHomePage() {
  const artist = await requireArtist();
  return <MerchCatalog artist={artist} />;
}
