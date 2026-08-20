import Link from 'next/link';

export default function MerchCancelledPage() {
  return (
    <div className="mx-auto w-[92%] max-w-xl py-24 text-center">
      <h1 className="font-display text-3xl text-artist-cream">
        Checkout cancelled
      </h1>
      <p className="mt-3 text-artist-cream-muted">
        No charge was made. You can return to your cart anytime.
      </p>
      <Link href="/cart" className="btn-outline mt-8 inline-flex px-6 py-3">
        Back to cart
      </Link>
    </div>
  );
}
