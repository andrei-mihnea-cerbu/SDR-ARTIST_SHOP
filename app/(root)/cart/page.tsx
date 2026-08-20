'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  formatMerchMoney,
  getMerchCart,
  removeMerchCartItem,
  updateMerchCartQuantity,
  type MerchCartItem,
} from '@/lib/merch-cart';

export default function CartPage() {
  const [items, setItems] = useState<MerchCartItem[]>([]);

  const refresh = () => setItems(getMerchCart());

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener('sdr-merch-cart', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('sdr-merch-cart', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.unitAmount * item.quantity,
    0,
  );

  return (
    <div className="mx-auto w-[92%] max-w-4xl py-16">
      <h1 className="font-display text-3xl text-artist-cream">Cart</h1>

      {items.length === 0 ? (
        <p className="mt-8 text-artist-cream-muted">
          Your cart is empty.{' '}
          <Link href="/" className="text-artist-amber">
            Browse merch
          </Link>
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="flex gap-4 rounded-2xl border border-artist-cream/10 bg-artist-gray-900/50 p-4"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-artist-gray-900">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/merch/${item.productId}`}
                  className="font-semibold text-artist-cream hover:text-artist-amber"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-artist-cream-muted">
                  {item.variantTitle}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateMerchCartQuantity(
                        item.productId,
                        item.variantId,
                        Math.max(1, Number(e.target.value) || 1),
                      )
                    }
                    className="w-20 rounded-lg border border-artist-cream/15 bg-artist-gray-950 px-2 py-1.5 text-artist-cream"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      removeMerchCartItem(item.productId, item.variantId)
                    }
                    className="text-sm text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                  <p className="ml-auto text-artist-amber">
                    {formatMerchMoney(item.unitAmount * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-artist-cream/10 pt-6">
            <p className="text-lg text-artist-cream">
              Subtotal: {formatMerchMoney(total)}
            </p>
            <Link href="/checkout" className="btn-primary px-6 py-3">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
