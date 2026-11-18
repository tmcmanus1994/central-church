"use client";

import { useEffect, useState } from "react";

/**
 * One button that does the right thing per device: on a phone it opens the
 * native share sheet (the iPhone "share" tray) through the Web Share API; on
 * a desktop browser without it, it copies the link and says so. The URL
 * shared is the page on this site, so whoever receives it lands here with
 * the video ready to play rather than on a bare Vimeo page.
 */
export function ShareButton({
  url,
  title,
  text,
  className = "",
}: {
  url: string;
  title: string;
  text?: string;
  className?: string;
}) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  async function share() {
    if (canShare) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User closed the sheet, or the browser refused — fall through to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label={`Share ${title}`}
      className={`inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:text-primary-deep ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
