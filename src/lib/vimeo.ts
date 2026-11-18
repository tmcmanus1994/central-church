/**
 * Vimeo poster images without uploading anything: Vimeo's oEmbed endpoint
 * returns a thumbnail URL for any public video. Fetched at build/revalidate
 * time on the server, cached for a day, and a failure (private video,
 * network hiccup, a sandbox with no outbound access) just yields `undefined`
 * so the caller falls back to a flat placeholder — never a broken page.
 */
export async function getVimeoThumbnail(vimeoUrl: string): Promise<string | undefined> {
  const clean = vimeoUrl.split("?")[0];
  const endpoint = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(clean)}&width=960`;
  try {
    const res = await fetch(endpoint, { next: { revalidate: 86_400 } });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { thumbnail_url?: string };
    return data.thumbnail_url || undefined;
  } catch {
    return undefined;
  }
}

/** Thumbnails for a list of videos, keyed by slug. Missing ones are simply absent. */
export async function getVimeoThumbnails<T extends { slug: string; vimeoUrl: string }>(
  videos: T[],
): Promise<Record<string, string>> {
  const pairs = await Promise.all(
    videos.map(async (v) => [v.slug, await getVimeoThumbnail(v.vimeoUrl)] as const),
  );
  return Object.fromEntries(pairs.filter(([, url]) => url)) as Record<string, string>;
}
