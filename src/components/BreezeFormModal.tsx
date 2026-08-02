"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Wraps a Breeze form embed in a native `<dialog>` so it opens in place —
 * no new tab, no page whose styling Breeze controls. The embed div and
 * script are only created and injected the first time the dialog opens,
 * not via JSX: Breeze's script builds an iframe from whatever
 * `.breeze_form_embed` div it finds the moment it runs, and a
 * `dangerouslySetInnerHTML` script tag would be inert — the browser only
 * executes script elements it sees inserted as real DOM nodes.
 *
 * `children` is a render prop so each call site can style its own trigger
 * (a big card, a plain button, whatever fits) while sharing the dialog and
 * injection logic.
 */
export function BreezeFormModal({
  address,
  title,
  children,
}: {
  /** The `data-address` Breeze gave this form. */
  address: string;
  title: string;
  children: (open: () => void) => ReactNode;
}) {
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
        embed.dataset.address = address;
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
  }, [open, address]);

  // The dialog also closes on Esc or a backdrop click, neither of which
  // goes through setOpen(false) above — this keeps `open` in sync.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      {children(() => setOpen(true))}

      <dialog
        ref={dialogRef}
        aria-label={title}
        className="m-auto w-[92vw] max-w-[480px] rounded-2xl border-0 bg-white p-0 shadow-[0_24px_64px_-16px_rgba(22,19,15,.35)] backdrop:bg-coal/60 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <span className="font-display text-[19px] tracking-[-.015em] text-ink">
            {title}
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
