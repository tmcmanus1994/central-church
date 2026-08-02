"use client";

import { BreezeFormModal } from "@/components/BreezeFormModal";

export function GuestSignInButton() {
  return (
    <BreezeFormModal address="eea89d" title="Guest Sign-In">
      {(open) => (
        <button
          type="button"
          onClick={open}
          className="mt-7 flex w-full items-center justify-between gap-4 rounded-2xl bg-primary-deep px-5 py-5 text-left lg:px-6 lg:py-6"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-[.14em] uppercase text-teal-light">
              First time here?
            </span>
            <span className="font-display text-[21px] tracking-[-.015em] text-white">
              Guest Sign-In
            </span>
            <span className="text-[14.5px] text-teal-pale">
              Let us know you&rsquo;re here — takes 30 seconds
            </span>
          </div>
          <span aria-hidden className="shrink-0 font-display text-2xl text-white">
            →
          </span>
        </button>
      )}
    </BreezeFormModal>
  );
}
