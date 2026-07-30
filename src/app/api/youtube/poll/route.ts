import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { pollYouTubeLive } from "@/lib/youtube-live";

export const dynamic = "force-dynamic";

/**
 * Manual/scheduled trigger for a fresh YouTube poll.
 *
 * Page renders don't call this — they read the `unstable_cache`-wrapped
 * `getLivestreamState()` in youtube-live.ts, which polls on its own 180s
 * schedule (Part 5, Option B: no cron needed). This route exists for:
 *
 *   - Manual refreshes while testing (see the setup guide's Part 6) —
 *     `curl -H "Authorization: Bearer $CRON_SECRET" https://.../api/youtube/poll`
 *   - Vercel Cron (Option A), if ever needed: Vercel calls cron routes via
 *     GET and automatically attaches this exact header when CRON_SECRET is
 *     set, so this route works as a cron target with zero changes — just add
 *     the schedule to vercel.json.
 *
 * GET (not POST) specifically because that's what Vercel Cron sends.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not set." },
      { status: 503 },
    );
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const state = await pollYouTubeLive();
  revalidateTag("livestream-state");

  return NextResponse.json({ ok: true, state });
}
