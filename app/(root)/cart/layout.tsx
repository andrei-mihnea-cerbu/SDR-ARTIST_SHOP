import type { ReactNode } from 'react';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata('Cart', undefined, {
  robots: { index: false, follow: false },
});

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}
