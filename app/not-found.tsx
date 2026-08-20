import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] w-[90%] max-w-2xl flex-col items-center justify-center py-16 text-center md:py-24">
      <p className="text-xs font-bold tracking-[0.35em] text-artist-brown uppercase">404</p>
      <h1 className="mt-4 text-3xl font-bold text-artist-cream md:text-4xl">Page not found</h1>
      <p className="mt-4 text-artist-cream-muted">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className="btn-primary mt-8">Back to home</Link>
    </section>
  );
}
