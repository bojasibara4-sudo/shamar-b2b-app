/**
 * Service utilisateurs — lecture/admin uniquement.
 * Pas de modification des services existants : ajout des fonctions admin uniquement.
 */

import { createClient } from '@/lib/supabase/server';

export interface UserRow {
  id: string;
  email: string;
  role: string;
  full_name?: string | null;
  company_name?: string | null;
  created_at?: string;
}

/**
 * Liste tous les utilisateurs (admin)
 */
export async function getUsersForAdmin(): Promise<UserRow[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('users')
    .select('id, email, role, full_name, company_name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('user.service getUsersForAdmin:', error);
    return [];
  }
  return (data || []) as UserRow[];
}

/**
 * Supprime un utilisateur de la table public.users (admin).
 * Ne touche pas à auth.users.
 */
export async function deleteUserById(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await (supabase as any).from('users').delete().eq('id', userId);
  if (error) {
    console.error('user.service deleteUserById:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
