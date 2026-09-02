import Link from 'next/link';
import { getOrgInfo } from '@/lib/org-info';

export default function Footer({
  artistName,
  artistHomeUrl,
}: {
  artistName: string;
  artistHomeUrl: string;
}) {
  const org = getOrgInfo();

  return (
    <footer className="border-t border-artist-cream/8 bg-artist-gray-950/90">
      <div className="mx-auto flex w-[92%] max-w-7xl flex-col items-center gap-4 px-2 py-10 text-center">
        <p className="font-display text-sm font-semibold tracking-[0.2em] text-artist-cream/90 uppercase">
          {artistName} Shop
        </p>
        <p className="max-w-xl text-xs leading-relaxed text-artist-cream-muted">
          Merch sold by {org.name} · Tax ID {org.cui} · {org.reg}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-artist-cream-muted">
          <Link href="/terms" className="transition hover:text-artist-amber">
            Terms & Conditions
          </Link>
          <span className="text-artist-cream/20">·</span>
          <a href={artistHomeUrl} className="transition hover:text-artist-amber">
            Artist site
          </a>
          <span className="text-artist-cream/20">·</span>
          <a
            href={org.website}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-artist-amber"
          >
            Label site
          </a>
        </div>
        <p className="text-xs tracking-wide text-artist-cream-muted">
          © {new Date().getFullYear()} {artistName}. All rights reserved.
        </p>
        <a
          href="https://estionline.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-wide text-artist-cream-muted transition hover:text-artist-amber"
        >
          Powered by Esti Online
        </a>
      </div>
    </footer>
  );
}
