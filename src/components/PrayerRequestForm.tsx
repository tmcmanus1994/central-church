"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Central's Breeze prayer-request form, hidden behind a button instead of
 * embedded inline — Breeze's own form styling doesn't match the site, so it
 * only appears once someone actually asks for it. The embed script builds
 * an iframe itself the moment its target div and script tag land in the
 * DOM, so both are created here (not via JSX) and injected exactly once,
 * the first time the dialog opens — a `dangerouslySetInnerHTML` script tag
 * would be inert; the browser only runs script elements it sees inserted
 * as real nodes.
 */
export function PrayerRequestForm() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const embedHostRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      if (!injected.current && embedHostRef.current) {
        injected.current = true;
        const embed = document.createElement("div");
        embed.className = "breeze_form_embed";
        embed.dataset.subdomain = "lrcentralchurch";
        embed.dataset.address = "b4b9a9";
        embed.dataset.width = "100%";
        embed.dataset.border_width = "0";
        embed.dataset.border_color = "000000";
        embed.dataset.background_color = "ffffff";
        embed.dataset.button_color = "92b765";
        embedHostRef.current.appendChild(embed);

        const script = document.createElement("script");
        script.src = "https://app.breezechms.com/js/form_embed.js";
        embedHostRef.current.appendChild(script);
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  // The dialog also closes on Esc or a backdrop click, neither of which
  // goes through setOpen(true/false) above — this keeps `open` in sync.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-[46px] w-full items-center justify-center rounded-full bg-primary px-[22px] text-[15px] font-bold text-white transition-colors hover:bg-primary-deep"
      >
        Submit a Prayer Request
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Prayer request form"
        className="m-auto w-[92vw] max-w-[480px] rounded-2xl border-0 bg-white p-0 shadow-[0_24px_64px_-16px_rgba(22,19,15,.35)] backdrop:bg-coal/60 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <span className="font-display text-[19px] tracking-[-.015em] text-ink">
            Prayer Request
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-ink"
          >
            <span className="font-display text-base leading-none">✕</span>
          </button>
        </div>
        <div className="max-h-[70vh] min-h-[360px] overflow-y-auto px-5 py-5">
          <div ref={embedHostRef} />
        </div>
      </dialog>
    </>
  );
}
