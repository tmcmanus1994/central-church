import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Reveal } from "@/components/Reveal";
import { toyStore } from "@/content/toy-store";

export const metadata: Metadata = {
  title: toyStore.seoTitle,
  description: toyStore.seoDescription,
  alternates: { canonical: "/toy-store" },
  openGraph: {
    title: `${toyStore.seoTitle} | Central Church of Christ`,
    description: toyStore.seoDescription,
    images: [{ url: toyStore.image, width: 1440, height: 1080, alt: toyStore.imageAlt }],
  },
};

const cream = "bg-[#f5efe0] text-[#163a2a] hover:bg-white";
const outlineCream = "border-[1.5px] border-[#f5efe0]/55 text-[#f5efe0] hover:bg-white/10";

/** Christmas Toy Store — copy and links live in src/content/toy-store.ts. */
export default function ToyStorePage() {
  const { hero, links, numbers, ways, details, closing } = toyStore;
  return (
    <>
      {/* Hero */}
      <section className="bg-[#163a2a] text-[#f5efe0]">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:min-h-[560px] lg:grid-cols-[1.05fr_1fr]">
          <div className="order-2 flex flex-col justify-center gap-5 px-5 py-9 lg:order-1 lg:gap-6 lg:px-14 lg:py-16">
            <Reveal as="p" className="m-0 text-[11px] font-bold tracking-[.16em] uppercase text-[#e2ab37] lg:text-xs">
              {hero.eyebrow}
            </Reveal>
            <Reveal as="h1" delay={80} className="m-0 font-display text-[40px] leading-[.98] font-bold tracking-[-.035em] lg:text-[72px] lg:tracking-[-.04em]">
              {hero.headline}
            </Reveal>
            <Reveal as="p" delay={160} className="m-0 max-w-[600px] text-[17px] leading-[1.6] text-[#d9d3c4] text-pretty-wrap lg:text-[20px]">
              {hero.subhead}
            </Reveal>
            <Reveal delay={240} className="mt-1 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <Button href={links.give.href} className={cream}>
                {links.give.label}
              </Button>
              <Button href={links.gifts.href} className={outlineCream}>
                {links.gifts.label}
              </Button>
              <Button href={links.volunteer.href} className={outlineCream}>
                {links.volunteer.label}
              </Button>
            </Reveal>
          </div>
          <div className="order-1 relative lg:order-2">
            <div className="relative aspect-[4/3] w-full lg:absolute lg:inset-0 lg:aspect-auto">
              <Image
                src={toyStore.photo}
                alt={toyStore.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[center_15%]"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="grid h-2 grid-cols-7" aria-hidden>
        {["#cf3e41", "#e2ab37", "#d2d3c3", "#2e979b", "#a52e64", "#65927d", "#2f6486"].map((c) => (
          <i key={c} style={{ background: c }} />
        ))}
      </div>

      {/* By the numbers */}
      <Reveal as="section" className="mx-auto max-w-[1440px] px-5 py-10 lg:px-14 lg:py-16">
        <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">By the numbers</span>
        <dl className="m-0 mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {numbers.map((n) => (
            <div key={n.value} className="flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-5 lg:p-6">
              <dt className="m-0 font-display text-[24px] leading-[1.1] tracking-[-.025em] text-ink lg:text-[28px]">
                {n.value}
              </dt>
              <dd className="m-0 text-[15px] leading-[1.5] text-body">{n.detail}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Ways to help */}
      <Reveal as="section" className="border-y border-line bg-surface">
        <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-14 lg:py-16">
          <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">Ways to help</span>
          <h2 className="mt-2.5 mb-0 font-display text-[30px] leading-[1.08] tracking-[-.03em] lg:text-[44px]">
            Three ways to be part of it
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:mt-9 lg:grid-cols-3 lg:gap-6">
            {ways.map((w, i) => {
              const link = links[w.link];
              return (
                <div key={w.title} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-6 lg:p-7">
                  <span className="font-mono text-xs font-medium text-primary">0{i + 1}</span>
                  <h3 className="m-0 font-display text-[22px] tracking-[-.02em]">{w.title}</h3>
                  <p className="m-0 flex-1 text-[15.5px] leading-[1.6] text-body">{w.body}</p>
                  <Button href={link.href} variant={w.link === "give" ? "give" : "outline"} size="md">
                    {link.label}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* Event details */}
      <Reveal as="section" className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-14 lg:px-14 lg:py-16">
        <h2 className="m-0 font-display text-[26px] leading-[1.08] tracking-[-.025em] lg:text-4xl lg:tracking-[-.03em]">
          Event details
        </h2>
        <div className="flex flex-col gap-6">
          <dl className="m-0 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-[auto_1fr]">
            {details.map((d) => (
              <div key={d.label} className="contents">
                <dt className="m-0 text-[13px] font-bold tracking-[.1em] uppercase text-muted sm:pt-1">{d.label}</dt>
                <dd className="m-0 text-[17px] leading-[1.5] text-ink">{d.value}</dd>
              </div>
            ))}
          </dl>
          <p className="m-0 max-w-[640px] font-display text-[22px] leading-[1.3] tracking-[-.02em] text-ink lg:text-[26px]">
            {closing}
          </p>
        </div>
      </Reveal>
    </>
  );
}
