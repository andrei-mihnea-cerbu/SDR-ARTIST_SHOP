"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { getMerchCartCount } from "@/lib/merch-cart";
import type { Artist } from "@/types";

function useSiteHeaderHeight() {
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const update = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.offsetHeight}px`,
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);
}

export default function Navbar({
  artist,
  artistHomeUrl,
}: {
  artist: Artist;
  artistHomeUrl: string;
}) {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useSiteHeaderHeight();

  useEffect(() => {
    const refresh = () => setCartCount(getMerchCartCount());
    refresh();
    window.addEventListener("sdr-merch-cart", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("sdr-merch-cart", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-artist-cream/8 bg-artist-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-[92%] max-w-7xl items-center justify-between gap-4 py-3.5">
        <Link
          href="/"
          className="truncate font-display text-sm font-semibold tracking-[0.15em] text-artist-cream uppercase md:text-base"
        >
          {artist.name} Shop
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={`hidden rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition md:inline-flex ${
              pathname === "/" || pathname.startsWith("/merch")
                ? "bg-artist-amber/15 text-artist-amber-light"
                : "text-artist-cream/75 hover:bg-artist-cream/5 hover:text-artist-cream"
            }`}
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className={`relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold tracking-wide transition ${
              pathname === "/cart" || pathname === "/checkout"
                ? "bg-artist-amber/15 text-artist-amber-light"
                : "text-artist-cream/75 hover:bg-artist-cream/5 hover:text-artist-cream"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-artist-amber px-1 text-[10px] font-bold text-artist-gray-950">
                {cartCount}
              </span>
            ) : null}
          </Link>
          <a
            href={artistHomeUrl}
            className="inline-flex items-center gap-2 rounded-full border border-artist-cream/15 px-3 py-2 text-xs font-semibold tracking-wide text-artist-cream/75 transition hover:border-artist-amber/40 hover:text-artist-amber-light"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Artist site</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
