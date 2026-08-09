"use client";

import { useEffect, useState } from "react";
import { youtubeLiveUrl } from "@/lib/site";

/** Sunday, 10:15–11:30 AM Central — the one weekly window worth flagging. */
export function isLiveWindow(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  if (get("weekday") !== "Sun") return false;
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  return minutes >= 10 * 60 + 15 && minutes <= 11 * 60 + 30;
}

/** The visual chip itself — a red recording dot plus "Live Now", linking
 *  straight to the YouTube stream (not the /media/live page — someone
 *  clicking this while it's actually live shouldn't have to click again).
 *  Exported on its own so a preview page can render it unconditionally
 *  without waiting for Sunday morning. */
export function LiveNowChip({ className = "" }: { className?: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <a
      href={youtubeLiveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-[12px] font-bold tracking-[.1em] text-white uppercase no-underline transition-[opacity,transform,background-color] duration-500 ease-out hover:bg-red-700 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      } ${className}`}
    >
      <span className="relative flex size-2.5 shrink-0">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/70" />
        <span className="relative inline-flex size-2.5 rounded-full bg-white" />
      </span>
      Live Now
    </a>
  );
}

/** Renders `LiveNowChip` only during the live window, checked client-side
 *  (and re-checked every 30s) so it never depends on page cache/revalidate
 *  timing to show up or disappear on schedule. */
export function LiveNowBadge({ className = "" }: { className?: string }) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    const check = () => setLive(isLiveWindow(new Date()));
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!live) return null;
  return <LiveNowChip className={className} />;
}
