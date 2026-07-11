// Habitrii — Supabase client singleton
// Import this module anywhere auth or database access is needed:
//   import { supabase } from "./lib/supabase";
//
// Environment variables (set in Vercel, VITE_ prefix exposes them to the browser):
//   VITE_SUPABASE_URL      — Production: Habitrii project · Preview: AVEN LLC DEV project
//   VITE_SUPABASE_ANON_KEY — publishable key (public by design; RLS enforces security)

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail soft: the app still renders, auth features are simply unavailable.
  console.warn(
    "Supabase env vars missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) — auth disabled."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
