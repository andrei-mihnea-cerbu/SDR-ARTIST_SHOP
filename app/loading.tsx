export default function Loading() {
  return (
    <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-artist-gray-900 px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,115,85,0.12),transparent_65%)]" />
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        <div className="h-12 w-12 rounded-full border-2 border-artist-cream/20" />
        <div className="mt-8 w-full">
          <div className="loading-bar-track">
            <div className="loading-bar-indeterminate" />
          </div>
        </div>
        <p className="loading-pulse mt-4 text-xs font-bold tracking-[0.2em] text-artist-cream-muted uppercase">
          Loading...
        </p>
      </div>
    </div>
  );
}
