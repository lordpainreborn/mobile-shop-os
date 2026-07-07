import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getClient(url: string | undefined, key: string | undefined) {
  if (!url || !key) {
    throw new Error("Supabase environment variables not configured");
  }
  return createClient(url, key);
}

export function getSupabase() {
  return getClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseAdmin() {
  return getClient(supabaseUrl, supabaseServiceKey);
}
