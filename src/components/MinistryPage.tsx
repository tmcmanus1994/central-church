import Link from "next/link";
import type { Ministry } from "@/content/ministries";
import type { ChurchEvent } from "@/content/events";
import { annualPhotos, galleries, photos, type PhotoKey } from "@/content/photos";
import { recurringWhen } from "@/lib/format";
import { ArrowLink, Button } from "./Button";
import { ContactButton } from "./ContactButton";
import { IglesiaForm } from "./IglesiaForm";
import { KidsClosetForm } from "./KidsClosetForm";
import { MinistryBanner } from "./MinistryBanner";
import { RemindSignup } from "./RemindSignup";
import { ImageSlot } from "./ImageSlot";
import { Reveal } from "@/components/Reveal";

/** Narrows a built-up string to a PhotoKey only when the registry has it. */
function key(candidate: string): PhotoKey | undefined {
  return candidate in photos ? (candidate as PhotoKey) : undefined;
}

/**
 * The single flexible template behind every ministry page. Sections render
 * only when the ministry's content object supplies them; Iglesia renders the
 * whole page in Spanish via lang="es".
 */
export function MinistryPage({
  ministry,
  recurring = [],
}: {
  ministry: Ministry;
  recurring?: ChurchEvent[];
}) {
  const labels =
    ministry.lang === "es"
      ? {
          contact: "Tu contacto",
          recurring: "Eventos semanales",
          allEvents: "Ver todos los eventos",
          related: "Relacionado",
          gallery: `Fotos`,
        }
      : {
          contact: "Your contact",
          recurring: "Recurring events",
          allEvents: `All ${ministry.shortName} events`,
          related: "Related",
          gallery: `Photos from ${ministry.shortName}`,
        };

  return (
    <article lang={ministry.lang}>
      <MinistryBanner
        slug={ministry.slug}
        eyebrow={ministry.eyebrow}
        name={ministry.name}
      />

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-5">
          <p className="m-0 text-[17px] leading-[1.6] text-ink text-pretty-wrap lg:text-[21px]">
            {ministry.intro}
          </p>
          {ministry.intro2 ? (
            <p className="m-0 text-base leading-[1.7] text-body text-pretty-wrap lg:text-[17px]">
              {ministry.intro2}
            </p>
          ) : null}

          {ministry.weekly ? (
            <>
              <h2 className="mt-4 mb-0 font-display text-[24px] tracking-[-.025em] lg:mt-6 lg:text-[32px]">
                {ministry.weeklyHeading}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {ministry.weekly.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-1.5 rounded-[14px] border border-line bg-surface p-5"
                  >
                    <span className="text-[11px] font-bold tracking-[.12em] uppercase text-primary">
                      {item.eyebrow}
                    </span>
                    <span className="font-display text-[19px] tracking-[-.015em]">
                      {item.title}
                    </span>
                    <span className="text-[15px] leading-[1.5] text-body">
                      {item.blurb}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {ministry.annual ? (
            <>
              <h2 className="mt-4 mb-0 font-display text-[24px] tracking-[-.025em] lg:mt-6 lg:text-[32px]">
                {ministry.annualHeading}
              </h2>
              <div className="flex flex-col gap-4">
                {ministry.annual.map((item, i) => (
                  <div
                    key={item.title}
                    className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5 ${
                      i < ministry.annual!.length - 1
                        ? "border-b border-line pb-4"
                        : ""
                    }`}
                  >
                    <ImageSlot
                      src={annualPhotos[ministry.slug]?.[item.title]}
                      sizes="(min-width: 640px) 170px, 100vw"
                      alt=""
                      className="aspect-[16/10] w-full shrink-0 rounded-xl sm:w-[170px]"
                    />
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold tracking-[.1em] uppercase text-primary">
                        {item.eyebrow}
                      </span>
                      <h3 className="m-0 font-display text-[19px] tracking-[-.015em] lg:text-[22px]">
                        {item.title}
                      </h3>
                      <p className="m-0 text-[15.5px] leading-[1.6] text-body lg:text-base">
                        {item.blurb}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {ministry.list ? (
            <>
              <h2 className="mt-4 mb-0 font-display text-[24px] tracking-[-.025em] lg:mt-6 lg:text-[32px]">
                {ministry.listHeading}
              </h2>
              <ul className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2">
                {ministry.list.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-line bg-surface px-4 py-3 text-[15.5px] leading-[1.5] text-body"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {ministry.groups ? (
            <>
              <h2 className="mt-4 mb-0 font-display text-[24px] tracking-[-.025em] lg:mt-6 lg:text-[32px]">
                {ministry.groupsHeading}
              </h2>
              <div className="flex flex-col gap-3.5">
                {ministry.groups.map((group) => (
                  <div
                    key={group.name}
                    className="flex flex-col gap-1.5 rounded-2xl border border-line p-5"
                  >
                    <span className="font-display text-[22px] tracking-[-.02em]">
                      {group.name}
                    </span>
                    {group.where ? (
                      <span className="text-[15px] text-muted">{group.where}</span>
                    ) : null}
                    <span className="text-[15.5px] text-body">
                      Contact {group.contact}
                      {group.email ? (
                        <>
                          {" · "}
                          <a
                            href={`mailto:${group.email}`}
                            className="font-semibold text-primary no-underline"
                          >
                            {group.email}
                          </a>
                        </>
                      ) : null}
                      {group.phone ? <> · {group.phone}</> : null}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {/* A `remindCode` notice with no code yet (not set up in remind.ts)
              stays hidden rather than rendering a broken join link. */}
          {ministry.notice &&
          (ministry.notice.remindCode === undefined || ministry.notice.remindCode) ? (
            <div className="mt-5 flex flex-col gap-2.5 rounded-[18px] border border-teal-border bg-teal-50 p-5 lg:p-6 text-teal-ink">
              <span className="text-[11px] font-bold tracking-[.16em] uppercase text-teal-muted">
                {ministry.notice.eyebrow}
              </span>
              <p className="m-0 text-[15.5px] leading-[1.6] text-teal-ink">
                {ministry.notice.body}
              </p>
              {ministry.notice.remindCode ? (
                <RemindSignup code={ministry.notice.remindCode} className="mt-1" />
              ) : (
                <div className="mt-1">
                  <Button href={ministry.notice.href} size="md">
                    {ministry.notice.label}
                  </Button>
                </div>
              )}
            </div>
          ) : null}

          {ministry.utilities ? (
            <div className="mt-2 flex flex-wrap gap-3">
              {ministry.utilities.map((u) => (
                <Button key={u.label} href={u.href} variant="outline" size="md">
                  {u.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="flex flex-col gap-5">
          {ministry.contact ? (
            <div className="flex flex-col gap-3.5 rounded-[18px] border border-line p-6 lg:p-7">
              <ImageSlot
                photoKey={key(`ministry.${ministry.slug}.contact`)}
                sizes="(min-width: 1024px) 200px, 40vw"
                focus="top"
                alt={`Portrait of ${ministry.contact.name}`}
                className="aspect-[4/5] w-full max-w-[180px] rounded-xl"
              />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
                  {labels.contact}
                </span>
                <span className="font-display text-[24px] tracking-[-.02em]">
                  {ministry.contact.name}
                </span>
                <span className="text-base text-body">{ministry.contact.role}</span>
              </div>
              <ContactButton
                name={ministry.contact.name}
                label={ministry.contact.ctaLabel}
                subject={`${ministry.shortName} — question from the website`}
                full
              />
            </div>
          ) : null}

          {recurring.length > 0 ? (
            <div className="flex flex-col gap-3 rounded-[18px] border border-teal-border bg-teal-50 p-6">
              <span className="text-[11px] font-bold tracking-[.16em] uppercase text-teal-muted">
                {labels.recurring}
              </span>
              {recurring.map((e) => (
                <div key={e.slug} className="flex justify-between gap-3 text-[15.5px]">
                  <span className="font-semibold">{e.title}</span>
                  <span className="text-teal-muted">{recurringWhen(e)}</span>
                </div>
              ))}
              <ArrowLink href="/events" className="text-[15px]">
                {labels.allEvents}
              </ArrowLink>
            </div>
          ) : null}

          {ministry.related ? (
            <div className="flex flex-col gap-2.5 rounded-[18px] border border-line p-6">
              <span className="text-[11px] font-bold tracking-[.16em] uppercase text-muted">
                {labels.related}
              </span>
              {ministry.related.map((r) => (
                <Link
                  key={r.label}
                  href={r.href}
                  className="text-base font-semibold text-ink no-underline hover:text-primary"
                >
                  {r.label} →
                </Link>
              ))}
            </div>
          ) : null}
        </aside>
      </div>

      {/* Video and gallery are independent — Kids Closet has both. */}
      {ministry.video ? (
        <Reveal as="section" className="mx-auto max-w-[1100px] px-5 pb-10 lg:px-14 lg:pb-16">
          <h2 className="m-0 mb-5 font-display text-[24px] tracking-[-.025em] lg:text-[32px]">
            {ministry.video.caption}
          </h2>
          <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-coal">
            <iframe
              title={ministry.video.caption}
              src={ministry.video.embedUrl}
              loading="lazy"
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              className="size-full border-0"
            />
          </div>
          <a
            href={ministry.video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-[15px] font-bold text-primary no-underline"
          >
            Watch on Vimeo →
          </a>
        </Reveal>
      ) : null}

      {galleries[ministry.slug]?.length || !ministry.video ? (
      <Reveal as="section" className="mx-auto max-w-[1440px] px-5 pb-10 lg:px-14 lg:pb-16">
        <h2 className="mb-5 font-display text-[24px] tracking-[-.025em] lg:text-[32px]">
          {labels.gallery}
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-3.5">
          {/* Real gallery images once supplied; four placeholders until then. */}
          {(galleries[ministry.slug]?.length
            ? galleries[ministry.slug]
            : Array.from({ length: 4 }, () => undefined)
          ).map((src, i) => (
            <ImageSlot
              key={src ?? i}
              src={src}
              sizes="(min-width: 1024px) 25vw, 50vw"
              alt=""
              className="aspect-[4/3] w-full rounded-[14px]"
            />
          ))}
        </div>
      </Reveal>
      ) : null}

      {/* Kids Closet books its own appointments — see KidsClosetForm. */}
      {ministry.slug === "kids-closet" ? (
        <Reveal as="section" className="mx-auto max-w-[1100px] px-5 pb-10 lg:px-14 lg:pb-16">
          <KidsClosetForm />
        </Reveal>
      ) : null}

      {/* CTA band — Iglesia gets its own form (routed to Matt Thomas) instead
          of a link out to the English Plan a Visit page. */}
      <Reveal as="section"
        id={ministry.slug === "iglesia" ? "contact" : undefined}
        className={`bg-primary-deep px-5 py-10 text-white lg:px-14 lg:py-16 ${
          ministry.slug === "iglesia" ? "scroll-mt-24" : ""
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1440px] flex-col gap-6 lg:gap-12 ${
            ministry.slug === "iglesia"
              ? "lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-start"
              : "lg:flex-row lg:items-center lg:justify-between"
          }`}
        >
          <div className="flex flex-col gap-3">
            <h2 className="m-0 font-display text-[24px] leading-[1.08] tracking-[-.025em] text-pretty-wrap lg:text-[40px] lg:tracking-[-.03em]">
              {ministry.cta.title}
            </h2>
            <p className="m-0 max-w-[560px] text-[15.5px] leading-[1.6] text-teal-pale lg:text-[18.5px]">
              {ministry.cta.body}
            </p>
          </div>
          {ministry.slug === "iglesia" ? (
            <IglesiaForm lang={ministry.lang} />
          ) : (
            <div className="shrink-0">
              <Button href={ministry.cta.href} variant="white">
                {ministry.cta.label}
              </Button>
            </div>
          )}
        </div>
      </Reveal>
    </article>
  );
}
