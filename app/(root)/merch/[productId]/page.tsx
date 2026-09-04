import type { Metadata } from "next";
import MerchProductPage from "@/components/MerchProductPage";
import { requireArtist } from "@/lib/artist";
import { serverApiGet } from "@/lib/server-api";
import {
  createPageMetadata,
  getPageDescription,
  getSiteName,
  stripHtml,
  truncateMeta,
} from "@/lib/site-metadata";
import type { PrintifyProduct } from "@/types";

type ProductPageProps = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const artist = await requireArtist();
  const fallback = createPageMetadata(
    "Product",
    getPageDescription(artist.name),
  );

  try {
    const product = await serverApiGet<PrintifyProduct>(
      `/printify/products/${productId}`,
    );
    if (!product?.title) return fallback;

    const description = truncateMeta(
      stripHtml(product.description) ||
        `Official merchandise from ${artist.name}.`,
    );
    const image =
      product.imageUrl ??
      product.images?.find((img) => img.is_default)?.src ??
      product.images?.[0]?.src;

    return {
      title: product.title,
      description,
      alternates: { canonical: `/merch/${productId}` },
      openGraph: {
        type: "website",
        title: product.title,
        description,
        siteName: getSiteName(artist.name),
        ...(image
          ? {
              images: [{ url: image, alt: product.title }],
            }
          : {}),
      },
    };
  } catch {
    return fallback;
  }
}

export default function ProductPage() {
  return <MerchProductPage />;
}
