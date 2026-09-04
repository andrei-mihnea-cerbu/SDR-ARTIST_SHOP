"use client";

import { createContext, useContext, useMemo } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AnnouncementModal from "@/components/AnnouncementModal";
import type { Artist } from "@/types";

type ArtistContextValue = {
  artist: Artist;
};

const ArtistContext = createContext<ArtistContextValue | null>(null);

export function useArtistContext() {
  const context = useContext(ArtistContext);
  if (!context) {
    throw new Error("useArtistContext must be used within ShopChrome");
  }
  return context;
}

export default function ShopChrome({
  artist,
  artistHomeUrl,
  children,
}: {
  artist: Artist;
  artistHomeUrl: string;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ artist }), [artist]);

  return (
    <ArtistContext.Provider value={value}>
      <div className="flex min-h-screen flex-col bg-artist-gray-950">
        <Navbar artist={artist} artistHomeUrl={artistHomeUrl} />
        <main className="site-main flex-1">{children}</main>
        <Footer artistName={artist.name} artistHomeUrl={artistHomeUrl} />
      </div>
      <AnnouncementModal />
    </ArtistContext.Provider>
  );
}
