'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useArtistContext } from '@/components/ArtistChrome';
import { clientApiPost } from '@/lib/client-api';
import {
  detectBrowserCountryCode,
  getCountryOptions,
} from '@/lib/countries';
import {
  formatMerchMoney,
  getMerchCart,
  type MerchCartItem,
} from '@/lib/merch-cart';

type AddressForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
};

const emptyAddress: AddressForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  country: '',
  region: '',
  address1: '',
  address2: '',
  city: '',
  zip: '',
};

export default function CheckoutPage() {
  const { artist } = useArtistContext();
  const [items, setItems] = useState<MerchCartItem[]>([]);
  const [address, setAddress] = useState<AddressForm>(emptyAddress);
  const [couponCode, setCouponCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const countries = useMemo(() => getCountryOptions('en'), []);

  useEffect(() => {
    setItems(getMerchCart());
    setAddress((prev) =>
      prev.country
        ? prev
        : { ...prev, country: detectBrowserCountryCode('US') },
    );
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.unitAmount * item.quantity,
    0,
  );

  const setField = (key: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const handlePay = async () => {
    if (!items.length) {
      toast.error('Cart is empty');
      return;
    }

    const required: (keyof AddressForm)[] = [
      'first_name',
      'last_name',
      'email',
      'country',
      'address1',
      'city',
      'zip',
    ];
    for (const key of required) {
      if (!address[key].trim()) {
        toast.error('Please fill in all required address fields');
        return;
      }
    }

    if (!acceptedTerms) {
      toast.error('Please accept the Terms & Conditions to continue');
      return;
    }

    setSubmitting(true);
    try {
      const origin = window.location.origin;
      const { data, status } = await clientApiPost<{ url: string }>(
        '/printify/checkout',
        {
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          address: {
            ...address,
            country: address.country.trim().toUpperCase(),
            phone: address.phone.trim() || undefined,
            region: address.region.trim() || undefined,
            address2: address.address2.trim() || undefined,
          },
          couponCode: couponCode.trim() || undefined,
          artistId: couponCode.trim() ? artist.id : undefined,
          successUrl: `${origin}/payment/merch/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/payment/merch/cancelled`,
        },
      );

      if (status >= 400 || !data?.url) {
        toast.error(
          status === 400
            ? 'Invalid coupon or checkout details'
            : 'Could not start checkout',
        );
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error('Could not start checkout');
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="mx-auto w-[92%] max-w-3xl py-16 text-center">
        <p className="text-artist-cream-muted">Your cart is empty.</p>
        <Link href="/" className="mt-4 inline-block text-artist-amber">
          Browse merch
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-[92%] max-w-5xl gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <h1 className="font-display text-3xl text-artist-cream">Checkout</h1>
        <p className="mt-2 text-sm text-artist-cream-muted">
          Shipping is calculated with Printify. Payment is processed by Stripe
          as merch acquisition.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {(
            [
              ['first_name', 'First name'],
              ['last_name', 'Last name'],
              ['email', 'Email'],
              ['phone', 'Phone (optional)'],
              ['region', 'Region / State (optional)'],
              ['address1', 'Address'],
              ['address2', 'Address line 2 (optional)'],
              ['city', 'City'],
              ['zip', 'ZIP / Postal code'],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className={`text-sm text-artist-cream-muted ${
                key === 'address1' || key === 'address2' ? 'sm:col-span-2' : ''
              }`}
            >
              {label}
              <input
                value={address[key]}
                onChange={(e) => setField(key, e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-artist-cream/15 bg-artist-gray-900 px-4 py-3 text-artist-cream"
              />
            </label>
          ))}

          <label className="text-sm text-artist-cream-muted sm:col-span-2">
            Country
            <select
              value={address.country}
              onChange={(e) => setField('country', e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-artist-cream/15 bg-artist-gray-900 px-4 py-3 text-artist-cream outline-none transition focus:border-artist-amber/50"
            >
              <option value="" disabled>
                Select your country
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
            <span className="mt-1.5 block text-xs text-artist-cream-muted">
              Pre-selected from your browser locale when possible.
            </span>
          </label>
        </div>

        <label className="mt-6 block text-sm text-artist-cream-muted">
          Discount coupon (optional)
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Artist reward code"
            className="mt-1.5 w-full rounded-xl border border-artist-cream/15 bg-artist-gray-900 px-4 py-3 text-artist-cream"
          />
          <span className="mt-1.5 block text-xs text-artist-cream-muted">
            Valid codes take 5% off that artist&apos;s products.
          </span>
        </label>
      </div>

      <aside className="h-fit rounded-2xl border border-artist-cream/10 bg-artist-gray-900/60 p-6">
        <h2 className="font-semibold text-artist-cream">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.variantId}`}
              className="flex justify-between gap-3 text-artist-cream-muted"
            >
              <span>
                {item.title} × {item.quantity}
              </span>
              <span className="text-artist-cream">
                {formatMerchMoney(item.unitAmount * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex justify-between border-t border-artist-cream/10 pt-4 text-artist-cream">
          <span>Subtotal</span>
          <span>{formatMerchMoney(total)}</span>
        </p>
        <p className="mt-1 text-xs text-artist-cream-muted">
          Shipping added at payment based on your address.
        </p>

        <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-artist-cream-muted">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-artist-cream/30 accent-artist-amber"
          />
          <span>
            I have read and agree to the{' '}
            <Link
              href="/terms"
              target="_blank"
              className="text-artist-amber underline underline-offset-2 hover:text-artist-amber-light"
            >
              Terms & Conditions
            </Link>
            , including the no-refund policy and Printify fulfillment.
          </span>
        </label>

        <button
          type="button"
          disabled={submitting || !acceptedTerms}
          onClick={() => void handlePay()}
          className="btn-primary mt-6 w-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Redirecting…' : 'Pay with Stripe'}
        </button>
        <Link
          href="/cart"
          className="mt-3 block text-center text-sm text-artist-cream-muted hover:text-artist-amber"
        >
          Back to cart
        </Link>
      </aside>
    </div>
  );
}
