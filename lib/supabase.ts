import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export function getSupabase() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey);
}
