/**
 * Service Escrow SHAMAR
 * Workflow : CREATED → HOLD → SHIPPED → DELIVERED → RELEASED
 * Les fonds restent bloqués jusqu'à confirmation livraison par l'acheteur
 */

import { createClient } from '@/lib/supabase/server';

export type EscrowStatus = 'CREATED' | 'HOLD' | 'SHIPPED' | 'DELIVERED' | 'RELEASED' | 'DISPUTED' | 'CANCELLED';

export interface Escrow {
  id: string;
  order_id: string;
  payment_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  held_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  released_at?: string;
  dispute_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

const VALID_TRANSITIONS: Record<EscrowStatus, EscrowStatus[]> = {
  CREATED: ['HOLD', 'CANCELLED'],
  HOLD: ['SHIPPED', 'DISPUTED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'DISPUTED'],
  DELIVERED: ['RELEASED'],
  RELEASED: [],
  DISPUTED: ['HOLD', 'RELEASED', 'CANCELLED'],
  CANCELLED: [],
};

function canTransition(from: EscrowStatus, to: EscrowStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Crée un escrow (statut CREATED)
 */
export async function createEscrow(
  orderId: string,
  paymentId: string | null,
  buyerId: string,
  sellerId: string,
  amount: number,
  currency: string = 'FCFA'
): Promise<Escrow | null> {
  const supabase = await createClient();

  try {
    const insertData: Record<string, unknown> = {
      order_id: orderId,
      buyer_id: buyerId,
      seller_id: sellerId,
      amount,
      currency,
      status: 'CREATED',
    };
    if (paymentId) insertData.payment_id = paymentId;

    const { data: escrow, error } = await (supabase as any)
      .from('escrows')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating escrow:', error);
      return null;
    }

    return escrow as Escrow;
  } catch (error) {
    console.error('Error creating escrow:', error);
    return null;
  }
}

/**
 * Passe l'escrow en HOLD (fonds bloqués) - appelé quand paiement confirmé
 */
export async function holdEscrow(escrowId: string): Promise<boolean> {
  return updateEscrowStatus(escrowId, 'HOLD', { held_at: new Date().toISOString() });
}

/**
 * Passe l'escrow en SHIPPED (vendeur a expédié)
 * @param isAdmin - si true, bypass la vérification seller
 */
export async function markShipped(escrowId: string, userId: string, isAdmin?: boolean): Promise<boolean> {
  const escrow = await getEscrowById(escrowId);
  if (!escrow) return false;
  if (!isAdmin && escrow.seller_id !== userId) return false;
  if (!canTransition(escrow.status as EscrowStatus, 'SHIPPED')) return false;

  return updateEscrowStatus(escrowId, 'SHIPPED', { shipped_at: new Date().toISOString() });
}

/**
 * Passe l'escrow en DELIVERED (acheteur confirme réception)
 */
export async function markDelivered(escrowId: string, userId: string): Promise<boolean> {
  const escrow = await getEscrowById(escrowId);
  if (!escrow || escrow.buyer_id !== userId) return false;
  if (!canTransition(escrow.status as EscrowStatus, 'DELIVERED')) return false;

  return updateEscrowStatus(escrowId, 'DELIVERED', { delivered_at: new Date().toISOString() });
}

/**
 * Passe l'escrow en RELEASED (fonds débloqués au vendeur)
 */
export async function releaseEscrow(escrowId: string): Promise<boolean> {
  const escrow = await getEscrowById(escrowId);
  if (!escrow) return false;
  if (!canTransition(escrow.status as EscrowStatus, 'RELEASED')) return false;

  const ok = await updateEscrowStatus(escrowId, 'RELEASED', { released_at: new Date().toISOString() });
  if (ok) {
    // TODO: Déclencher le transfert vers le vendeur (Stripe Connect, payout, etc.)
    // Pour l'instant, on marque uniquement le statut
  }
  return ok;
}

/**
 * Met à jour le statut d'un escrow
 */
async function updateEscrowStatus(
  escrowId: string,
  status: EscrowStatus,
  extraFields?: Record<string, unknown>
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
      ...extraFields,
    };

    const { error } = await (supabase as any)
      .from('escrows')
      .update(updateData)
      .eq('id', escrowId);

    if (error) {
      console.error('Error updating escrow status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating escrow status:', error);
    return false;
  }
}

/**
 * Récupère un escrow par ID
 */
export async function getEscrowById(escrowId: string): Promise<Escrow | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('escrows')
      .select('*')
      .eq('id', escrowId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error getting escrow:', error);
      return null;
    }

    return data as Escrow;
  } catch (error) {
    console.error('Error getting escrow:', error);
    return null;
  }
}

/**
 * Récupère l'escrow par order_id
 */
export async function getEscrowByOrderId(orderId: string): Promise<Escrow | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('escrows')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error getting escrow by order:', error);
      return null;
    }

    return data as Escrow;
  } catch (error) {
    console.error('Error getting escrow by order:', error);
    return null;
  }
}
