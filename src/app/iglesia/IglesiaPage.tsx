"use client";

import { useState } from "react";
import { MinistryPage } from "@/components/MinistryPage";
import type { Ministry } from "@/content/ministries";

/**
 * The Spanish service page, with a toggle between Spanish and English.
 * Spanish is the default — near-zero local competition for Spanish-language
 * church searches is the reason this page exists.
 */
export function IglesiaPage({ es, en }: { es: Ministry; en: Ministry }) {
  const [english, setEnglish] = useState(false);
  const ministry = english ? en : es;

  return (
    <>
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3 lg:px-14">
          <span className="text-[13.5px] text-muted">
            {english ? "Viewing in English" : "Viendo en español"}
          </span>
          <button
            type="button"
            onClick={() => setEnglish((v) => !v)}
            lang={english ? "es" : "en"}
            className="rounded-full border border-primary px-4 py-2 text-[13.5px] font-bold text-primary transition-colors hover:bg-teal-50"
          >
            {english ? "Ver en español" : "Translate to English"}
          </button>
        </div>
      </div>
      <MinistryPage ministry={ministry} />
    </>
  );
}
