import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata('Checkout', undefined, {
  robots: { index: false, follow: false },
});

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
