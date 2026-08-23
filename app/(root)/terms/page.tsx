import type { Metadata } from 'next';
import Link from 'next/link';
import { requireArtist } from '@/lib/artist';
import { createPageMetadata } from '@/lib/site-metadata';
import { getOrgInfo, PRINTIFY_HELP_URL } from '@/lib/org-info';

export async function generateMetadata(): Promise<Metadata> {
  const artist = await requireArtist();
  return createPageMetadata(
    'Terms & Conditions',
    `Terms and conditions for merchandise purchases from ${artist.name}.`,
  );
}

export default function TermsPage() {
  const org = getOrgInfo();
  const websiteHost = org.website.replace(/^https?:\/\//, '');

  return (
    <section className="mx-auto w-[92%] max-w-3xl py-12 md:py-16">
      <p className="text-[11px] font-semibold tracking-[0.28em] text-artist-amber uppercase">
        Legal
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-wide text-artist-cream uppercase md:text-4xl">
        Terms & Conditions
      </h1>
      <p className="mt-3 text-sm text-artist-cream-muted">
        Please read these terms before placing a merchandise order on this shop.
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-artist-cream-muted">
        <section className="rounded-2xl border border-artist-cream/10 bg-artist-gray-900/40 p-5 sm:p-6">
          <h2 className="font-display text-lg tracking-wide text-artist-cream uppercase">
            1. Seller information
          </h2>
          <p className="mt-3">
            Merchandise sold through this artist shop is offered by{' '}
            <strong className="text-artist-cream">{org.name}</strong>
            {' '}
            (&quot;we&quot;, &quot;us&quot;, the &quot;Studio&quot;).
          </p>
          <ul className="mt-4 space-y-1.5">
            <li>
              <span className="text-artist-cream/80">Tax ID (CUI):</span> {org.cui}
            </li>
            <li>
              <span className="text-artist-cream/80">Trade Register:</span>{' '}
              {org.reg}
            </li>
            <li>
              <span className="text-artist-cream/80">Address:</span> {org.address}
            </li>
            <li>
              <span className="text-artist-cream/80">Email:</span>{' '}
              <a
                href={`mailto:${org.email}`}
                className="text-artist-amber hover:underline"
              >
                {org.email}
              </a>
            </li>
            <li>
              <span className="text-artist-cream/80">Phone:</span> {org.phone}
            </li>
            <li>
              <span className="text-artist-cream/80">Label website:</span>{' '}
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-artist-amber hover:underline"
              >
                {websiteHost}
              </a>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-artist-cream/10 bg-artist-gray-900/40 p-5 sm:p-6">
          <h2 className="font-display text-lg tracking-wide text-artist-cream uppercase">
            2. Production & fulfillment (Printify)
          </h2>
          <p className="mt-3">
            All merchandise products are produced, packed, and shipped by{' '}
            <strong className="text-artist-cream">Printify</strong> and its print
            providers. Printify handles manufacturing, quality of print
            production, shipping, tracking, and delivery-related operations.
          </p>
          <p className="mt-3">
            By placing an order you acknowledge that Printify is responsible for
            production and transport of the goods.
          </p>
        </section>

        <section className="rounded-2xl border border-artist-amber/25 bg-artist-amber/5 p-5 sm:p-6">
          <h2 className="font-display text-lg tracking-wide text-artist-cream uppercase">
            3. No refunds
          </h2>
          <p className="mt-3 text-artist-cream/90">
            <strong>Refunds are not offered.</strong> All merchandise sales are
            final. Once payment is completed, the order is submitted for
            production and cannot be cancelled for a refund.
          </p>
        </section>

        <section className="rounded-2xl border border-artist-cream/10 bg-artist-gray-900/40 p-5 sm:p-6">
          <h2 className="font-display text-lg tracking-wide text-artist-cream uppercase">
            4. Issues with your order
          </h2>
          <p className="mt-3">
            For any problem related to production, shipping, damaged items,
            missing packages, tracking, or Printify fulfillment, please contact
            Printify support:
          </p>
          <p className="mt-4">
            <a
              href={PRINTIFY_HELP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-artist-amber underline underline-offset-2 hover:text-artist-amber-light"
            >
              {PRINTIFY_HELP_URL}
            </a>
          </p>
        </section>

        <section className="rounded-2xl border border-artist-cream/10 bg-artist-gray-900/40 p-5 sm:p-6">
          <h2 className="font-display text-lg tracking-wide text-artist-cream uppercase">
            5. Payment
          </h2>
          <p className="mt-3">
            Payments are processed securely by Stripe. Charges appear as a merch
            acquisition. Prices are shown before payment; shipping is calculated
            based on the delivery address you provide at checkout.
          </p>
        </section>

        <section className="rounded-2xl border border-artist-cream/10 bg-artist-gray-900/40 p-5 sm:p-6">
          <h2 className="font-display text-lg tracking-wide text-artist-cream uppercase">
            6. Acceptance
          </h2>
          <p className="mt-3">
            By checking the acceptance box at checkout and completing a purchase,
            you confirm that you have read and agree to these Terms & Conditions,
            including the no-refund policy and Printify&apos;s role in production
            and shipping.
          </p>
        </section>

        <section className="rounded-2xl border border-artist-cream/10 bg-artist-gray-900/40 p-5 sm:p-6">
          <h2 className="font-display text-lg tracking-wide text-artist-cream uppercase">
            7. Governing law
          </h2>
          <p className="mt-3">
            These terms are governed by Romanian law. Where mandatory consumer
            protections apply, those rights remain unaffected to the extent
            required by applicable law.
          </p>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/" className="btn-outline px-5 py-2.5 text-sm">
          Back to shop
        </Link>
        <Link href="/checkout" className="btn-primary px-5 py-2.5 text-sm">
          Go to checkout
        </Link>
      </div>
    </section>
  );
}
