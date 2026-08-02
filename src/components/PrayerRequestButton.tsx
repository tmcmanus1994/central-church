"use client";

import { BreezeFormModal } from "@/components/BreezeFormModal";

export function PrayerRequestButton() {
  return (
    <BreezeFormModal address="b4b9a9" title="Prayer Request">
      {(open) => (
        <button
          type="button"
          onClick={open}
          className="mt-3 inline-flex h-[46px] w-full items-center justify-center rounded-full bg-primary px-[22px] text-[15px] font-bold text-white transition-colors hover:bg-primary-deep"
        >
          Submit a Prayer Request
        </button>
      )}
    </BreezeFormModal>
  );
}
