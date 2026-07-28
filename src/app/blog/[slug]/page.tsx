import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageSlot } from "@/components/ImageSlot";
import { blogPosts, getBlogPost } from "@/content/media";

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
  return { title: post.title, description: post.excerpt };
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
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
        {fmtDate(post.date)} · {post.author}
      </span>
      <h1 className="mt-3 mb-6 font-display text-[32px] leading-[1.06] tracking-[-.03em] text-pretty-wrap lg:text-[44px] lg:tracking-[-.035em]">
        {post.title}
      </h1>
      <ImageSlot alt="" label="post hero photo" className="mb-8 h-[220px] rounded-2xl lg:h-[380px]" />
      <div className="flex flex-col gap-5">
        {post.body.map((p) => (
          <p
            key={p.slice(0, 32)}
            className="m-0 text-[17px] leading-[1.75] text-body text-pretty-wrap lg:text-[18px]"
          >
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}
