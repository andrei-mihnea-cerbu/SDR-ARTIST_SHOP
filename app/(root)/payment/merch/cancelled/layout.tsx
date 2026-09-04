import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata("Checkout Cancelled", undefined, {
  robots: { index: false, follow: false },
});

export default function MerchCancelledLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
