"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type MerchGalleryImage = {
  src: string;
  variantIds: number[];
};

type MerchImageGalleryProps = {
  title: string;
  images: MerchGalleryImage[];
  variantId: number | null;
  onActiveSrcChange?: (src: string | undefined) => void;
};

function uniqueImages(images: MerchGalleryImage[]): MerchGalleryImage[] {
  const seen = new Set<string>();
  const out: MerchGalleryImage[] = [];
  for (const image of images) {
    if (!image.src || seen.has(image.src)) continue;
    seen.add(image.src);
    out.push(image);
  }
  return out;
}

export default function MerchImageGallery({
  title,
  images,
  variantId,
  onActiveSrcChange,
}: MerchImageGalleryProps) {
  const gallery = useMemo(() => uniqueImages(images), [images]);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const skipScrollSync = useRef(false);

  useEffect(() => {
    setActiveIndex(0);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: 0, behavior: "auto" });
  }, [gallery]);

  const scrollToIndex = (
    index: number,
    behavior: ScrollBehavior = "smooth",
  ) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;
    skipScrollSync.current = true;
    slide.scrollIntoView({ behavior, inline: "center", block: "nearest" });
    setActiveIndex(index);
    window.setTimeout(
      () => {
        skipScrollSync.current = false;
      },
      behavior === "smooth" ? 450 : 50,
    );
  };

  useEffect(() => {
    onActiveSrcChange?.(gallery[activeIndex]?.src ?? gallery[0]?.src);
  }, [activeIndex, gallery, onActiveSrcChange]);

  useEffect(() => {
    if (variantId == null || gallery.length === 0) return;
    const matchIndex = gallery.findIndex((image) =>
      image.variantIds.includes(variantId),
    );
    if (matchIndex >= 0) {
      scrollToIndex(matchIndex, "smooth");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to variant changes
  }, [variantId]);

  useEffect(() => {
    const thumb = thumbsRef.current?.children[activeIndex] as
      HTMLElement | undefined;
    thumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  const onTrackScroll = () => {
    if (skipScrollSync.current) return;
    const track = trackRef.current;
    if (!track || gallery.length === 0) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDist = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const mid = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(mid - center);
      if (dist < closestDist) {
        closestDist = dist;
        closest = index;
      }
    });
    setActiveIndex(closest);
  };

  if (gallery.length === 0) {
    return (
      <div className="flex min-h-[min(72vh,760px)] items-center justify-center rounded-[1.75rem] border border-artist-cream/10 bg-artist-gray-900 text-artist-cream-muted lg:min-h-[min(78vh,820px)]">
        No image
      </div>
    );
  }

  const canNavigate = gallery.length > 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-artist-cream/10 bg-artist-gray-900 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        >
          {gallery.map((image, index) => (
            <div
              key={image.src}
              className="relative min-h-[min(72vh,760px)] w-full shrink-0 snap-center lg:min-h-[min(78vh,820px)]"
            >
              <Image
                src={image.src}
                alt={`${title} — image ${index + 1}`}
                fill
                priority={index === 0}
                unoptimized
                className="object-contain p-4 sm:p-8 lg:p-10"
                sizes="(max-width: 1024px) 96vw, 58vw"
              />
            </div>
          ))}
        </div>

        {canNavigate ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() =>
                scrollToIndex(
                  (activeIndex - 1 + gallery.length) % gallery.length,
                )
              }
              className="carousel-nav-btn absolute top-1/2 left-3 z-10 hidden -translate-y-1/2 md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => scrollToIndex((activeIndex + 1) % gallery.length)}
              className="carousel-nav-btn absolute top-1/2 right-3 z-10 hidden -translate-y-1/2 md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5">
              {gallery.map((image, index) => (
                <span
                  key={`dot-${image.src}`}
                  className={`h-1.5 rounded-full transition ${
                    index === activeIndex
                      ? "w-5 bg-artist-amber"
                      : "w-1.5 bg-artist-cream/35"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {canNavigate ? (
        <div
          ref={thumbsRef}
          className="no-scrollbar flex gap-2.5 overflow-x-auto px-0.5 pb-1"
        >
          {gallery.map((image, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={`thumb-${image.src}`}
                type="button"
                aria-label={`View image ${index + 1}`}
                onClick={() => scrollToIndex(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition sm:h-24 sm:w-24 ${
                  active
                    ? "border-artist-amber/70 ring-1 ring-artist-amber/40"
                    : "border-artist-cream/10 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  unoptimized
                  className="object-contain bg-artist-gray-900 p-1.5"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      {canNavigate ? (
        <p className="text-center text-xs tracking-wide text-artist-cream-muted md:hidden">
          Swipe to browse images · {activeIndex + 1}/{gallery.length}
        </p>
      ) : null}
    </div>
  );
}
