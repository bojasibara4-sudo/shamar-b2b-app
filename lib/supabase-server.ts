import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Crée un client Supabase côté serveur
 * Retourne null si les variables d'environnement ne sont pas configurées
 */
export function createSupabaseServerClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch {
    return null;
  }
}

