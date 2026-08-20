import Image from 'next/image';
import Link from 'next/link';
import { formatMerchMoney } from '@/lib/merch-cart';
import { serverApiGet } from '@/lib/server-api';
import type { Artist, PrintifyProduct } from '@/types';

function lowestPrice(product: PrintifyProduct): number | null {
  const prices = (product.variants ?? [])
    .filter((v) => v.is_enabled !== false && v.is_available !== false)
    .map((v) => v.price)
    .filter((price): price is number => typeof price === 'number');
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

export default async function MerchCatalog({ artist }: { artist: Artist }) {
  const products =
    (await serverApiGet<PrintifyProduct[]>('/printify/products', {
      artistId: artist.id,
    })) ?? [];

  return (
    <section className="mx-auto w-[92%] max-w-7xl py-12 md:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-bold tracking-[0.35em] text-artist-brown uppercase">
          Official merch
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-wide text-artist-cream uppercase md:text-4xl">
          {artist.name} Shop
        </h1>
        <p className="mt-3 text-artist-cream-muted">
          Wear the sound — browse the full collection.
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          href="/cart"
          className="cursor-pointer rounded-full border border-artist-cream/15 px-4 py-2 text-xs font-semibold tracking-wide text-artist-cream/80 transition hover:border-artist-amber/40 hover:text-artist-amber-light"
        >
          View cart
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-20 text-center">
          <h2 className="font-display text-xl font-semibold tracking-wide text-artist-cream uppercase">
            No products available
          </h2>
          <p className="mt-2 text-artist-cream-muted">
            Please check back later for new drops.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const price = lowestPrice(product);
            return (
              <Link
                key={product.id}
                href={`/merch/${product.id}`}
                className="group flex cursor-pointer flex-col"
              >
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-artist-cream/8 bg-artist-gray-900/60 p-6 transition group-hover:border-artist-amber/30 group-hover:bg-artist-gray-900">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      width={400}
                      height={400}
                      unoptimized
                      className="h-[85%] w-[85%] object-contain transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-[85%] w-[85%] items-center justify-center rounded-xl bg-artist-gray-900 text-sm text-artist-cream-muted">
                      No image
                    </div>
                  )}
                </div>
                <p className="mt-4 font-display text-sm font-semibold tracking-wide text-artist-cream uppercase">
                  {product.title}
                </p>
                {price != null ? (
                  <p className="mt-1 text-sm text-artist-amber-light">
                    From {formatMerchMoney(price)}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
