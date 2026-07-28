import type { Metadata } from "next";
import Link from "next/link";
import { ImageSlot } from "@/components/ImageSlot";
import { blogPosts } from "@/content/media";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, updates, and reflections from Central Church of Christ in downtown Little Rock.",
};

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-14 lg:py-16">
      <span className="text-xs font-bold tracking-[.14em] uppercase text-primary">
        Media · Blog
      </span>
      <h1 className="mt-2.5 mb-3 font-display text-[36px] leading-[1] tracking-[-.035em] lg:mb-4 lg:text-[56px] lg:tracking-[-.04em]">
        From the Central Blog
      </h1>
      <p className="m-0 max-w-[680px] text-base leading-[1.65] text-body lg:text-[19px]">
        Stories, updates, and reflections from around the congregation.
      </p>

      <div className="mt-8 flex flex-col gap-4 lg:mt-12 lg:gap-5">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex flex-col gap-4 rounded-2xl border border-line p-5 text-ink no-underline transition-colors hover:border-teal-border hover:bg-teal-50/40 sm:flex-row sm:items-center sm:gap-6 lg:p-6"
          >
            <ImageSlot
              alt=""
              label="post photo"
              className="h-[140px] w-full shrink-0 rounded-xl sm:h-[120px] sm:w-[180px]"
            />
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold tracking-[.1em] uppercase text-primary">
                {fmtDate(post.date)} · {post.author}
              </span>
              <h2 className="m-0 font-display text-[21px] leading-[1.2] tracking-[-.015em] text-pretty-wrap lg:text-2xl">
                {post.title}
              </h2>
              <p className="m-0 text-[15px] leading-[1.6] text-body">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-[14.5px] text-muted">
        The ~30 posts from the current site migrate here with their existing
        URLs preserved.
      </p>
    </div>
  );
}
