"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-artist-gray-900 px-6 py-12 text-artist-cream">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,115,85,0.14)_0%,rgba(139,115,85,0.05)_35%,transparent_70%)]" />
      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <p className="text-5xl font-bold text-artist-brown sm:text-6xl">
          Something went wrong
        </p>
        <p className="mt-4 mb-10 max-w-md text-sm leading-relaxed text-artist-cream-muted sm:text-base">
          We hit an unexpected issue. Please try again, or return to the
          homepage.
        </p>
        <div className="flex w-full max-w-xs flex-col gap-3">
          <button type="button" onClick={() => reset()} className="btn-primary">
            <RotateCcw className="h-5 w-5" />
            Try Again
          </button>
          <Link href="/" className="btn-outline">
            <Home className="h-5 w-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
