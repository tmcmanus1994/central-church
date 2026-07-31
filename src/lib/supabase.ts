import { createClient } from "@supabase/supabase-js";

/**
 * Two clients: `supabasePublic` for reads under RLS (anon key), `supabaseAdmin`
 * for server-side writes that need to bypass it (service role key) — see
 * supabase/schema.sql for the current schema.
 *
 * Both are `null` until their env vars are set, so importing this file never
 * breaks a build that hasn't configured Supabase yet — every caller checks
 * for null and falls back, the same pattern as the calendar feeds and the
 * Resend-backed forms.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabasePublic =
  url && anonKey ? createClient(url, anonKey) : null;

export const supabaseAdmin =
  url && serviceKey ? createClient(url, serviceKey) : null;
