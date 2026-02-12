/**
 * Service de gestion des litiges
 * PHASE 9 - Production Ready
 */

import { createClient } from '@/lib/supabase/server';
import { logSecurityEvent } from './security.service';
import { getVendorByUserId, updateVendorLevelAuto } from './vendor.service';
import { assignBadgesAuto } from './badge.service';

export type DisputeStatus = 'open' | 'resolved' | 'rejected';

export interface Dispute {
  id: string;
  order_id: string;
  raised_by: string;
  against_user: string;
  reason: string;
  description?: string;
  status: DisputeStatus;
  amount_requested?: number | null;
  resolution_note?: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Crée un litige (optionnellement met escrow en DISPUTED)
 */
export async function createDispute(
  orderId: string,
  raisedBy: string,
  againstUser: string,
  reason: string,
  description?: string,
  amountRequested?: number | null
): Promise<Dispute | null> {
  const supabase = await createClient();

  try {
    const insertData: Record<string, unknown> = {
      order_id: orderId,
      raised_by: raisedBy,
      against_user: againstUser,
      reason,
      description: description || null,
      status: 'open',
    };
    if (amountRequested != null) insertData.amount_requested = amountRequested;

    const { data: dispute, error } = await (supabase as any)
      .from('disputes')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating dispute:', error);
      return null;
    }

    // Mettre escrow en DISPUTED si existant
    await (supabase as any)
      .from('escrows')
      .update({ status: 'DISPUTED', updated_at: new Date().toISOString() })
      .eq('order_id', orderId)
      .in('status', ['CREATED', 'HOLD', 'SHIPPED', 'DELIVERED']);

    logSecurityEvent('DISPUTE_RAISED', 'medium', `Litige ouvert: ${reason} (order ${orderId})`, {
      userId: raisedBy,
      metadata: { orderId, againstUser, reason },
    }).catch(() => {});

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
  const supabase = await createClient();

  try {
    const { data: disputeRow } = await (supabase as any)
      .from('disputes')
      .select('order_id')
      .eq('id', disputeId)
      .single();

    const { error } = await (supabase as any)
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

    // Mise à jour niveau/badges vendeur (non bloquant)
    if (disputeRow?.order_id) {
      const { data: order } = await (supabase as any)
        .from('orders')
        .select('seller_id')
        .eq('id', disputeRow.order_id)
        .single();
      if (order?.seller_id) {
        const vendor = await getVendorByUserId(order.seller_id);
        if (vendor?.id) {
          updateVendorLevelAuto(vendor.id).catch(() => {});
          assignBadgesAuto(vendor.id).catch(() => {});
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error resolving dispute:', error);
    return false;
  }
}

/**
 * Récupère tous les litiges (admin)
 */
export async function getAdminDisputes(): Promise<Dispute[]> {
  const supabase = await createClient();

  try {
    const { data: disputes, error } = await (supabase as any)
      .from('disputes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting admin disputes:', error);
      return [];
    }

    return (disputes || []) as Dispute[];
  } catch (error) {
    console.error('Error getting admin disputes:', error);
    return [];
  }
}

/**
 * Récupère un litige par ID
 */
export async function getDisputeById(disputeId: string): Promise<Dispute | null> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('disputes')
    .select('*')
    .eq('id', disputeId)
    .single();
  if (error || !data) return null;
  return data as Dispute;
}

/** Message litige (schéma: content) */
export interface DisputeMessageRow {
  id: string;
  dispute_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

/**
 * Récupère les messages d'un litige
 */
export async function getDisputeMessages(disputeId: string): Promise<DisputeMessageRow[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('dispute_messages')
    .select('*')
    .eq('dispute_id', disputeId)
    .order('created_at', { ascending: true });
  if (error) return [];
  return (data || []) as DisputeMessageRow[];
}

/**
 * Ajoute un message au chat litige
 */
export async function addDisputeMessage(disputeId: string, senderId: string, content: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('dispute_messages')
    .insert({ dispute_id: disputeId, sender_id: senderId, content });
  return !error;
}

/** Preuve litige (schéma: file_url, file_name) */
export interface DisputeEvidenceRow {
  id: string;
  dispute_id: string;
  uploaded_by: string;
  file_url: string;
  file_name: string | null;
  created_at: string;
}

/**
 * Récupère les preuves d'un litige
 */
export async function getDisputeEvidence(disputeId: string): Promise<DisputeEvidenceRow[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('dispute_evidence')
    .select('*')
    .eq('dispute_id', disputeId)
    .order('created_at', { ascending: true });
  if (error) return [];
  return (data || []) as DisputeEvidenceRow[];
}

/**
 * Ajoute une preuve (file_url après upload côté client)
 */
export async function addDisputeEvidence(disputeId: string, uploadedBy: string, fileUrl: string, fileName?: string | null): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await (supabase as any)
    .from('dispute_evidence')
    .insert({ dispute_id: disputeId, uploaded_by: uploadedBy, file_url: fileUrl, file_name: fileName ?? null });
  return !error;
}

/**
 * Récupère les litiges où l'utilisateur est impliqué
 */
export async function getUserDisputes(userId: string): Promise<Dispute[]> {
  const supabase = await createClient();

  try {
    const { data: disputes, error } = await (supabase as any)
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
