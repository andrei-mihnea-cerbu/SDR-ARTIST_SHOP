import { getArtistInitial, getFaviconColors } from "@/lib/favicon";

export function ArtistFaviconImage({ size }: { size: number }) {
  const initial = getArtistInitial();
  const { background, foreground } = getFaviconColors();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
        borderRadius: Math.round(size * 0.22),
        fontSize: Math.round(size * 0.56),
        fontWeight: 700,
        color: foreground,
        letterSpacing: "-0.04em",
      }}
    >
      {initial}
    </div>
  );
}
