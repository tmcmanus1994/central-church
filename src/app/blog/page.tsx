import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { mediaPlaceholder } from "@/content/photos";
import { blogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, reflections, and prayer writing from Central Church of Christ in downtown Little Rock.",
};

function fmtDate(iso: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function BlogIndexPage() {
  const [lead, ...rest] = blogPosts;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Media · Blog
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-[56px] lg:tracking-[-.04em]">
        From the Central Blog
      </h1>
      <p className="m-0 max-w-[680px] text-base leading-[1.65] text-body lg:text-[19px]">
        Reflections on prayer, scripture, and life together — written by our
        ministers and members.
      </p>

      {/* Lead post */}
      <Link
        href={`/blog/${lead.slug}`}
        className="mt-8 flex flex-col gap-5 rounded-2xl border border-line p-4 text-ink no-underline transition-colors hover:border-teal-border hover:bg-teal-50/40 lg:mt-12 lg:flex-row lg:items-center lg:gap-8 lg:p-6"
      >
        <ImageSlot
          src={lead.image ?? mediaPlaceholder}
          sizes="(min-width: 1024px) 45vw, 92vw"
          alt={lead.imageAlt}
          label="post photo"
          className="aspect-[3/2] w-full shrink-0 rounded-xl lg:w-[420px]"
        />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-[.1em] uppercase text-primary">
            Latest{lead.date ? ` · ${fmtDate(lead.date)}` : ""}
          </span>
          <h2 className="m-0 font-display text-[24px] leading-[1.2] tracking-[-.02em] text-pretty-wrap lg:text-[30px]">
            {lead.title}
          </h2>
          {lead.excerpt ? (
            <p className="m-0 text-[15.5px] leading-[1.6] text-body">
              {lead.excerpt}
            </p>
          ) : null}
          <span className="text-[14.5px] text-muted">{lead.author}</span>
        </div>
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-5">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex flex-col gap-2.5 rounded-2xl border border-line p-4 text-ink no-underline transition-colors hover:border-teal-border hover:bg-teal-50/40"
          >
            <ImageSlot
              src={post.image ?? mediaPlaceholder}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              alt={post.imageAlt}
              label="post photo"
              className="aspect-[3/2] w-full rounded-xl"
            />
            <span className="text-[11px] font-bold tracking-[.1em] uppercase text-primary">
              {post.date ? fmtDate(post.date) : post.author}
            </span>
            <h2 className="m-0 font-display text-[18px] leading-[1.25] tracking-[-.015em] text-pretty-wrap">
              {post.title}
            </h2>
            {post.excerpt ? (
              <p className="m-0 line-clamp-3 text-[14.5px] leading-[1.55] text-muted">
                {post.excerpt}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
