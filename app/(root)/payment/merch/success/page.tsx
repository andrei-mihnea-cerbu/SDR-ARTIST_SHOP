"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { clientApiPost } from "@/lib/client-api";
import { clearMerchCart } from "@/lib/merch-cart";

function MerchSuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let mounted = true;
    (async () => {
      const { status: httpStatus } = await clientApiPost(
        "/printify/checkout/complete",
        { sessionId },
      );
      if (!mounted) return;
      if (httpStatus < 400) {
        clearMerchCart();
        setStatus("ok");
      } else {
        setStatus("error");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [sessionId]);

  return (
    <div className="mx-auto w-[92%] max-w-xl py-24 text-center">
      {status === "loading" ? (
        <p className="text-artist-cream-muted">Confirming your order…</p>
      ) : status === "ok" ? (
        <>
          <h1 className="font-display text-3xl text-artist-cream">
            Order confirmed
          </h1>
          <p className="mt-3 text-artist-cream-muted">
            Payment received as merch acquisition. Your Printify order is being
            prepared for shipping.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-3xl text-artist-cream">
            Could not confirm order
          </h1>
          <p className="mt-3 text-artist-cream-muted">
            If you were charged, contact support with your Stripe receipt.
          </p>
        </>
      )}
      <Link href="/" className="btn-outline mt-8 inline-flex px-6 py-3">
        Back to shop
      </Link>
    </div>
  );
}

export default function MerchSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-artist-cream-muted">
          Loading…
        </div>
      }
    >
      <MerchSuccessInner />
    </Suspense>
  );
}
