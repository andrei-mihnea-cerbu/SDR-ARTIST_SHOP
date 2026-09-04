import ShopChrome from "@/components/ArtistChrome";
import SiteNotFound from "@/components/SiteNotFound";
import { getArtistByWebsite } from "@/lib/artist";
import { artistSiteUrl, getRequestHostname } from "@/lib/config";

export default async function ShopGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const artist = await getArtistByWebsite();
  if (!artist) {
    return <SiteNotFound />;
  }

  const artistHomeUrl = artistSiteUrl(await getRequestHostname());

  return (
    <ShopChrome artist={artist} artistHomeUrl={artistHomeUrl}>
      {children}
    </ShopChrome>
  );
}
