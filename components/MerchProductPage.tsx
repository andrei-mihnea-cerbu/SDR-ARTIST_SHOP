'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useArtistContext } from '@/components/ArtistChrome';
import MerchImageGallery from '@/components/MerchImageGallery';
import { clientApiGet } from '@/lib/client-api';
import { addMerchCartItem, formatMerchMoney } from '@/lib/merch-cart';
import {
  groupMerchVariants,
  imagesForColor,
  sizesForColor,
  variantIdForSelection,
} from '@/lib/merch-variants';
import type { PrintifyProduct } from '@/types';

function ColorSwatch({
  colors,
  title,
  selected,
}: {
  colors: string[];
  title: string;
  selected: boolean;
}) {
  return (
    <span
      className={`flex h-8 w-8 overflow-hidden rounded-full border ${
        selected
          ? 'border-artist-amber ring-2 ring-artist-amber/40'
          : 'border-artist-cream/25'
      }`}
      title={title}
    >
      {colors.length >= 2 ? (
        <>
          <span
            className="h-full w-1/2"
            style={{ backgroundColor: colors[0] }}
          />
          <span
            className="h-full w-1/2"
            style={{ backgroundColor: colors[1] }}
          />
        </>
      ) : (
        <span
          className="h-full w-full"
          style={{ backgroundColor: colors[0] || '#9a8b7a' }}
        />
      )}
    </span>
  );
}

export default function MerchProductPage() {
  const params = useParams<{ productId: string }>();
  const productId = String(params?.productId ?? '');
  const { artist } = useArtistContext();

  const [product, setProduct] = useState<PrintifyProduct | null>(null);
  const [related, setRelated] = useState<PrintifyProduct[]>([]);
  const [colorKey, setColorKey] = useState('');
  const [sizeKey, setSizeKey] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeImageUrl, setActiveImageUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [data, catalog] = await Promise.all([
          clientApiGet<PrintifyProduct>(`/printify/products/${productId}`),
          clientApiGet<PrintifyProduct[]>('/printify/products', {
            artistId: artist.id,
          }),
        ]);
        if (!mounted) return;

        setProduct(data);
        if (data) {
          const grouped = groupMerchVariants(data);
          const firstColor = grouped.colors[0];
          const firstSize = sizesForColor(grouped.sizes, firstColor)[0];
          setColorKey(firstColor?.key ?? '');
          setSizeKey(firstSize?.key ?? '');
        } else {
          setColorKey('');
          setSizeKey('');
        }

        setRelated(
          (catalog ?? [])
            .filter((item) => item.id !== productId)
            .slice(0, 4),
        );
      } catch {
        toast.error('Could not load product');
        setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [productId, artist.id]);

  const { colors, sizes } = useMemo(
    () =>
      product
        ? groupMerchVariants(product)
        : { colors: [], sizes: [] },
    [product],
  );

  const selectedColor =
    colors.find((color) => color.key === colorKey) ?? colors[0];
  const availableSizes = sizesForColor(sizes, selectedColor);
  const selectedSize =
    availableSizes.find((size) => size.key === sizeKey) ?? availableSizes[0];
  const variantId = variantIdForSelection(selectedColor, selectedSize);

  const selectedVariant = useMemo(
    () => product?.variants?.find((v) => v.id === variantId) ?? null,
    [product, variantId],
  );

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const fromPrintify = (product.images ?? []).map((img) => ({
      src: img.src,
      variantIds: img.variant_ids ?? [],
    }));
    return imagesForColor(fromPrintify, selectedColor);
  }, [product, selectedColor]);

  const onActiveSrcChange = useCallback((src: string | undefined) => {
    setActiveImageUrl(src);
  }, []);

  const selectColor = (key: string) => {
    setColorKey(key);
    const nextColor = colors.find((color) => color.key === key);
    const nextSizes = sizesForColor(sizes, nextColor);
    if (!nextSizes.some((size) => size.key === sizeKey)) {
      setSizeKey(nextSizes[0]?.key ?? '');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-artist-amber border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto w-[92%] max-w-3xl py-24 text-center">
        <p className="text-artist-cream-muted">Product not found.</p>
        <Link href="/" className="mt-4 inline-block text-artist-amber">
          Back to shop
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!selectedVariant || typeof selectedVariant.price !== 'number') {
      toast.error('Select an available variant');
      return;
    }
    addMerchCartItem({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
      title: product.title,
      variantTitle: [selectedColor?.title, selectedSize?.title]
        .filter(Boolean)
        .join(' / ') || selectedVariant.title || String(selectedVariant.id),
      imageUrl: activeImageUrl ?? galleryImages[0]?.src,
      unitAmount: selectedVariant.price,
      artistId: product.artistId ?? artist.id,
      artistName: product.artistName ?? artist.name,
    });
    toast.success('Added to cart');
  };

  return (
    <div className="mx-auto w-[min(96%,1400px)] px-3 py-8 md:py-12 lg:px-6">
      <div className="mb-6 flex items-center justify-between gap-4 md:mb-8">
        <Link
          href="/"
          className="text-sm text-artist-cream-muted transition hover:text-artist-amber"
        >
          ← Back to shop
        </Link>
        <p className="text-[11px] font-semibold tracking-[0.28em] text-artist-amber uppercase">
          Merch
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-12 xl:gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-artist-cream/10 pb-5">
            <h1 className="max-w-[18ch] font-display text-3xl leading-[1.05] font-bold tracking-wide text-artist-cream uppercase sm:text-4xl xl:text-5xl">
              {product.title}
            </h1>
            {selectedVariant?.price != null ? (
              <p className="font-display text-2xl tracking-wide text-artist-amber xl:text-3xl">
                {formatMerchMoney(selectedVariant.price)}
              </p>
            ) : null}
          </div>

          <MerchImageGallery
            title={product.title}
            images={galleryImages}
            variantId={variantId}
            onActiveSrcChange={onActiveSrcChange}
          />

          <div className="rounded-2xl border border-artist-cream/10 bg-artist-gray-900/55 p-4 sm:p-5">
            <div className="grid gap-5 sm:grid-cols-[1.4fr_0.6fr]">
              <div className="space-y-4">
                {colors.length > 0 ? (
                  <fieldset>
                    <legend className="text-xs font-semibold tracking-[0.18em] text-artist-cream-muted uppercase">
                      Color
                      {selectedColor ? (
                        <span className="ml-2 tracking-normal text-artist-cream">
                          {selectedColor.title}
                        </span>
                      ) : null}
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {colors.map((color) => {
                        const selected = color.key === selectedColor?.key;
                        return (
                          <button
                            key={color.key}
                            type="button"
                            onClick={() => selectColor(color.key)}
                            className={`flex items-center gap-2 rounded-full border px-2 py-1.5 text-left text-xs font-semibold tracking-wide uppercase transition ${
                              selected
                                ? 'border-artist-amber/70 bg-artist-amber/10 text-artist-cream'
                                : 'border-artist-cream/15 text-artist-cream-muted hover:border-artist-cream/35 hover:text-artist-cream'
                            }`}
                          >
                            <ColorSwatch
                              colors={color.colors}
                              title={color.title}
                              selected={selected}
                            />
                            <span className="pr-1">{color.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : null}

                {availableSizes.length > 0 ? (
                  <fieldset>
                    <legend className="text-xs font-semibold tracking-[0.18em] text-artist-cream-muted uppercase">
                      Size
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {availableSizes.map((size) => {
                        const selected = size.key === selectedSize?.key;
                        return (
                          <button
                            key={size.key}
                            type="button"
                            onClick={() => setSizeKey(size.key)}
                            className={`min-w-12 rounded-xl border px-3 py-2.5 text-sm font-semibold uppercase transition ${
                              selected
                                ? 'border-artist-amber bg-artist-amber/15 text-artist-amber-light'
                                : 'border-artist-cream/15 text-artist-cream hover:border-artist-cream/35'
                            }`}
                          >
                            {size.title}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : null}
              </div>

              <label className="block text-xs font-semibold tracking-[0.18em] text-artist-cream-muted uppercase">
                Quantity
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="mt-2 w-full rounded-xl border border-artist-cream/15 bg-artist-gray-950 px-4 py-3.5 text-sm text-artist-cream outline-none transition focus:border-artist-amber/50"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAdd}
                className="btn-primary flex-1 px-6 py-3.5 text-sm"
              >
                Add to cart
              </button>
              <Link
                href="/cart"
                className="btn-outline flex-1 px-6 py-3.5 text-center text-sm"
              >
                View cart
              </Link>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--site-header-height,4.5rem)+1.25rem)] lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
          {product.description ? (
            <section className="rounded-2xl border border-artist-cream/10 bg-artist-gray-900/40 p-5 sm:p-7">
              <p className="text-[11px] font-semibold tracking-[0.28em] text-artist-amber uppercase">
                Product info
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-wide text-artist-cream uppercase">
                Details
              </h2>
              <div
                className="merch-description mt-6 text-sm leading-relaxed text-artist-cream-muted [&_a]:text-artist-amber [&_li]:my-1.5 [&_p]:mb-4 [&_table]:my-5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_td]:border-b [&_td]:border-artist-cream/10 [&_td]:px-2 [&_td]:py-2 [&_th]:border-b [&_th]:border-artist-cream/20 [&_th]:px-2 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-artist-cream [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </section>
          ) : (
            <section className="rounded-2xl border border-artist-cream/10 bg-artist-gray-900/40 p-7">
              <h2 className="font-display text-2xl tracking-wide text-artist-cream uppercase">
                Details
              </h2>
              <p className="mt-4 text-sm text-artist-cream-muted">
                No additional product details available.
              </p>
            </section>
          )}
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-artist-cream/10 pt-12 md:mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-artist-amber uppercase">
                More from {artist.name}
              </p>
              <h2 className="mt-2 font-display text-2xl tracking-wide text-artist-cream uppercase md:text-3xl">
                Relevant products
              </h2>
            </div>
            <Link
              href="/"
              className="hidden text-sm text-artist-cream-muted transition hover:text-artist-amber sm:inline"
            >
              View all
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => {
              const thumb =
                item.imageUrl ??
                item.images?.find((img) => img.is_default)?.src ??
                item.images?.[0]?.src;
              const price = item.variants?.find(
                (v) =>
                  v.is_enabled !== false &&
                  v.is_available !== false &&
                  typeof v.price === 'number',
              )?.price;

              return (
                <Link
                  key={item.id}
                  href={`/merch/${item.id}`}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-artist-cream/10 bg-artist-gray-900/50 transition hover:border-artist-amber/35"
                >
                  <div className="relative aspect-square bg-artist-gray-900">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-contain p-5 transition duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-1 p-4">
                    <p className="line-clamp-2 font-display text-sm font-semibold tracking-wide text-artist-cream uppercase">
                      {item.title}
                    </p>
                    {price != null ? (
                      <p className="text-sm text-artist-amber">
                        {formatMerchMoney(price)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
