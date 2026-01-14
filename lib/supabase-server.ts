import { createClient as createServerClient } from '@/lib/supabase/server';

/**
 * Crée un client Supabase côté serveur avec gestion des cookies
 * Utilise @supabase/ssr pour la gestion correcte des sessions
 */
export async function createSupabaseServerClient() {
  try {
    return await createServerClient();
  } catch (error) {
    console.error('Error creating Supabase server client:', error);
    return null;
  }
}

