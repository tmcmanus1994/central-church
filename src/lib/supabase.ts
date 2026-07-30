import { createClient } from "@supabase/supabase-js";

/**
 * Two clients, matching the schema's RLS split (public read / service-role
 * write — see supabase/schema.sql): `supabasePublic` for reads under RLS,
 * `supabaseAdmin` for the poller's writes, which need to bypass it.
 *
 * Both are `null` until all three Supabase env vars are set, so importing
 * this file never breaks a build that hasn't configured Supabase yet — every
 * caller checks for null and falls back, the same pattern as the calendar
 * feeds and the Resend-backed forms.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabasePublic =
  url && anonKey ? createClient(url, anonKey) : null;

export const supabaseAdmin =
  url && serviceKey ? createClient(url, serviceKey) : null;
