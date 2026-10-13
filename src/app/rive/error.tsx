"use client";

/**
 * Shows the real error on the page instead of Next's generic "client-side
 * exception" screen — this page exists to poke at unfamiliar files, so when
 * one blows up the message and stack are the whole point.
 */
export default function RiveError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-12 lg:px-14 lg:py-20">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">Rive playground</span>
      <h1 className="mt-2.5 mb-0 font-display text-[30px] leading-[1.05] tracking-[-.03em] lg:text-5xl">
        The viewer crashed
      </h1>
      <p className="m-0 mt-4 text-[17px] leading-[1.6] text-body">
        <strong className="text-ink">{error.name}:</strong> {error.message}
      </p>
      <pre className="mt-5 max-w-full overflow-x-auto rounded-xl border border-line bg-line/30 p-4 text-[12.5px] leading-[1.5] text-ink">
        {error.stack}
      </pre>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium text-white"
      >
        Reload the viewer
      </button>
    </section>
  );
}
