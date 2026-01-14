/**
 * Service de gestion des litiges
 * PHASE 9 - Production Ready
 */

import { createSupabaseServerClient } from '@/lib/supabase-server';

export type DisputeStatus = 'open' | 'resolved' | 'rejected';

export interface Dispute {
  id: string;
  order_id: string;
  raised_by: string;
  against_user: string;
  reason: string;
  description?: string;
  status: DisputeStatus;
  resolution_note?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Crée un litige
 */
export async function createDispute(
  orderId: string,
  raisedBy: string,
  againstUser: string,
  reason: string,
  description?: string
): Promise<Dispute | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  try {
    const { data: dispute, error } = await supabase
      .from('disputes')
      .insert({
        order_id: orderId,
        raised_by: raisedBy,
        against_user: againstUser,
        reason,
        description: description || null,
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating dispute:', error);
      return null;
    }

    return dispute as Dispute;
  } catch (error) {
    console.error('Error creating dispute:', error);
    return null;
  }
}

/**
 * Résout un litige (admin uniquement)
 */
export async function resolveDispute(
  disputeId: string,
  adminId: string,
  status: 'resolved' | 'rejected',
  resolutionNote: string
): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('disputes')
      .update({
        status,
        resolution_note: resolutionNote,
        resolved_by: adminId,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', disputeId);

    if (error) {
      console.error('Error resolving dispute:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error resolving dispute:', error);
    return false;
  }
}

/**
 * Récupère les litiges d'un utilisateur
 */
export async function getUserDisputes(userId: string): Promise<Dispute[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  try {
    const { data: disputes, error } = await supabase
      .from('disputes')
      .select('*')
      .or(`raised_by.eq.${userId},against_user.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting user disputes:', error);
      return [];
    }

    return (disputes || []) as Dispute[];
  } catch (error) {
    console.error('Error getting user disputes:', error);
    return [];
  }
}
