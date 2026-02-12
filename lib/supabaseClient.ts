import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/** Client navigateur unique — lit/écrit les cookies de session (SSR). À utiliser partout côté client. */
const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

export { supabase };
export const supabaseClient = supabase;
