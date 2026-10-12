import type { Metadata } from "next";
import { RivePlayground } from "@/components/RivePlayground";

/**
 * Travelle's private scratch page for learning Rive. Not linked from
 * anywhere, kept out of the sitemap, and told to stay out of search — it
 * exists only so a `.riv` export can be tried on the real site.
 */
export const metadata: Metadata = {
  title: "Rive test",
  robots: { index: false, follow: false },
};

const RIVE_FILE = "/rive/school_of_motion_test.riv";

export default function RivePage() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pt-8 pb-16 lg:px-14 lg:pt-[72px] lg:pb-24">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Test page
      </span>
      <h1 className="mt-2.5 mb-0 font-display text-[34px] leading-[1.02] tracking-[-.035em] lg:mt-3.5 lg:text-6xl lg:leading-none lg:tracking-[-.04em]">
        Rive playground
      </h1>
      <p className="m-0 mt-4 max-w-[640px] text-[17px] leading-[1.6] text-body lg:mt-5">
        Playing <code className="rounded bg-line/60 px-1.5 py-0.5 text-[15px]">{RIVE_FILE}</code>.
        Every artboard, animation, state machine, and input in the file shows up on the right —
        click around to see how it responds. To try a different export, replace the file in{" "}
        <code className="rounded bg-line/60 px-1.5 py-0.5 text-[15px]">public/rive/</code>.
      </p>
      <div className="mt-8 lg:mt-12">
        <RivePlayground src={RIVE_FILE} />
      </div>
    </section>
  );
}
