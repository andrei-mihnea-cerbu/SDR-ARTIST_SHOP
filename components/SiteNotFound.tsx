export default function SiteNotFound() {
  return (
    <section className="mx-auto flex min-h-screen w-[90%] max-w-2xl flex-col items-center justify-center py-16 text-center md:py-24">
      <p className="text-xs font-bold tracking-[0.35em] text-artist-brown uppercase">
        Unavailable
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-wide text-artist-cream uppercase md:text-4xl">
        This site doesn&apos;t exist
      </h1>
      <p className="mt-4 max-w-md text-artist-cream-muted">
        The domain you visited is not linked to an artist on our platform.
      </p>
    </section>
  );
}
