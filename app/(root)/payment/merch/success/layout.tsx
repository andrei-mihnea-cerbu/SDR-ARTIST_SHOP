import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata("Order Confirmed", undefined, {
  robots: { index: false, follow: false },
});

export default function MerchSuccessLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
