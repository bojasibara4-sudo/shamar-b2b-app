/**
 * Service de gestion des agents (admin)
 * Utilisé par les routes API admin/agents — pas d'accès Supabase direct dans les routes.
 */

import { createClient } from '@/lib/supabase/server';

export interface AgentUpdate {
  department?: string;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  photo_url?: string | null;
}

/**
 * Récupère un agent par id
 */
export async function getAgentById(id: string) {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('agents')
    .select(
      `
      *,
      user:users!agents_user_id_fkey(id, email, full_name)
    `
    )
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Met à jour un agent (admin)
 */
export async function updateAgent(
  id: string,
  updates: AgentUpdate
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await (supabase as any)
    .from('agents')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('agent.service updateAgent:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Supprime un agent (admin)
 */
export async function deleteAgent(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await (supabase as any).from('agents').delete().eq('id', id);

  if (error) {
    console.error('agent.service deleteAgent:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
