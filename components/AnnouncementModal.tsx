"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { clientApiGet } from "@/lib/client-api";
import type { Announcement } from "@/types";

const STORAGE_KEY = "sdr-viewed-announcements";
const REFRESH_INTERVAL = 3 * 24 * 60 * 60 * 1000;

function getStoredViews() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Array<{
      id: string;
      date: number;
    }>;
  } catch {
    return [];
  }
}

function saveView(id: string) {
  const views = getStoredViews();
  const now = Date.now();
  const idx = views.findIndex((v) => v.id === id);
  if (idx > -1) views[idx].date = now;
  else views.push({ id, date: now });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
}

export default function AnnouncementModal() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleClose = () => setVisible(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data =
          (await clientApiGet<Announcement[]>("/announcements", {
            active: true,
          })) ?? [];
        const stored = getStoredViews();
        const now = Date.now();
        const active = data.filter((ann) => {
          if (!ann.isActive) return false;
          const view = stored.find((v) => v.id === ann.id);
          return !view || now - view.date > REFRESH_INTERVAL;
        });
        if (!cancelled && active.length > 0) {
          setAnnouncements(active);
          saveView(active[0].id);
          setTimeout(() => {
            if (!cancelled) setVisible(true);
          }, 2500);
        }
      } catch (e) {
        console.error("Announcement load error:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (announcements.length) saveView(announcements[pageIndex].id);
  }, [announcements, pageIndex]);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible]);

  if (!visible || !announcements.length) return null;

  const current = announcements[pageIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={handleClose}
        aria-label="Close announcement overlay"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="artist-announcement-title"
        className="relative z-10 flex max-h-[min(92dvh,100%)] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl border border-artist-cream/10 bg-artist-gray-950 text-artist-cream sm:rounded-3xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-4 sm:px-8 sm:pt-8">
          <span className="rounded-lg bg-artist-brown/20 px-3 py-1 text-[10px] font-extrabold tracking-[0.15em] text-artist-brown-light uppercase">
            Informative Note
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-artist-cream-muted transition-colors hover:bg-artist-cream/10 hover:text-artist-brown"
            aria-label="Close announcement"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-8 sm:py-5">
          <h3
            id="artist-announcement-title"
            className="break-words text-center text-xl font-black sm:text-3xl"
          >
            {current.title}
          </h3>
          <div
            className="announcement-body mt-4 break-words text-sm leading-relaxed text-artist-cream/80 sm:mt-5 sm:text-base [&_a]:break-all [&_img]:mx-auto [&_img]:h-auto [&_img]:max-w-full"
            dangerouslySetInnerHTML={{ __html: current.body }}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 border-t border-artist-cream/10 px-4 py-3 sm:gap-3 sm:px-8 sm:py-5">
          <button
            type="button"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((i) => i - 1)}
            className="min-h-11 flex-1 rounded-xl border border-artist-cream/10 px-3 py-2.5 text-sm disabled:opacity-30 sm:flex-none sm:px-4"
          >
            Back
          </button>
          <span className="shrink-0 px-1 text-xs text-artist-cream-muted sm:text-sm">
            {pageIndex + 1} / {announcements.length}
          </span>
          {pageIndex === announcements.length - 1 ? (
            <button
              type="button"
              onClick={handleClose}
              className="min-h-11 flex-1 rounded-xl bg-artist-brown px-3 py-2.5 text-sm font-bold sm:flex-none sm:px-4"
            >
              Close
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPageIndex((i) => i + 1)}
              className="min-h-11 flex-1 rounded-xl bg-artist-brown px-3 py-2.5 text-sm font-bold sm:flex-none sm:px-4"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
