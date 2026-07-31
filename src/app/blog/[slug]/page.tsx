import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageSlot } from "@/components/ImageSlot";
import { Reveal } from "@/components/Reveal";
import { blogPosts, getBlogPost } from "@/content/blog";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || `${post.title} — from the Central Church blog.`,
  };
}

function fmtDate(iso: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();

  const idx = blogPosts.findIndex((p) => p.slug === post.slug);
  const next = blogPosts[idx + 1];

  return (
    <article className="mx-auto max-w-[760px] px-5 py-8 lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-6 text-[14.5px] text-muted">
        <Link href="/blog" className="font-semibold text-primary no-underline">
          Blog
        </Link>
        <span className="px-2">/</span>
        <span>{post.title}</span>
      </nav>

      <span className="text-xs font-bold tracking-[.1em] uppercase text-primary">
        {[fmtDate(post.date), post.author].filter(Boolean).join(" · ")}
      </span>
      <h1 className="mt-3 mb-6 font-display text-[32px] leading-[1.06] tracking-[-.03em] text-pretty-wrap lg:text-[44px] lg:tracking-[-.035em]">
        {post.title}
      </h1>

      <ImageSlot
        src={post.image}
        sizes="(min-width: 760px) 760px, 92vw"
        alt={post.imageAlt}
        label="post hero photo"
        className="mb-8 aspect-[3/2] w-full rounded-2xl"
      />

      {/* Trusted CMS HTML from the church's own export. */}
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {next ? (
        <Reveal className="mt-12">
          <Link
            href={`/blog/${next.slug}`}
            className="flex flex-col gap-1 rounded-2xl border border-line bg-surface p-5 no-underline transition-colors hover:border-teal-border lg:p-6"
          >
            <span className="text-[11px] font-bold tracking-[.1em] uppercase text-muted">
              Next post
            </span>
            <span className="font-display text-[20px] tracking-[-.015em] text-ink">
              {next.title}
            </span>
          </Link>
        </Reveal>
      ) : null}
    </article>
  );
}
