/**
 * Service de gestion des commandes (admin / seller)
 * Utilisé par les routes API uniquement — pas d'accès Supabase direct dans les routes.
 */

import { createClient } from '@/lib/supabase/server';
import { isAdminLike } from '@/lib/owner-roles';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

const ALLOWED_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

/**
 * Liste toutes les commandes (admin uniquement)
 */
export async function getOrdersForAdmin() {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('orders')
    .select(
      `
      *,
      order_items:order_items(*, product:products(id, name, price, currency)),
      buyer:users!orders_buyer_id_fkey(id, email, full_name, company_name),
      seller:users!orders_seller_id_fkey(id, email, full_name, company_name)
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('order.service getOrdersForAdmin:', error);
    return [];
  }
  return data || [];
}

/**
 * Met à jour le statut d'une commande.
 * Admin : peut mettre n'importe quel statut.
 * Seller : uniquement ses commandes, statuts vendeur (CONFIRMED, PROCESSING, SHIPPED).
 */
export async function updateOrderStatus(
  orderId: string,
  status: string,
  userId: string,
  role: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const normalized = status.toUpperCase() as OrderStatus;
  if (!ALLOWED_STATUSES.includes(normalized)) {
    return { success: false, error: 'Statut invalide' };
  }

  const { data: order, error: fetchError } = await (supabase as any)
    .from('orders')
    .select('id, seller_id, buyer_id')
    .eq('id', orderId)
    .single();

  if (fetchError || !order) {
    return { success: false, error: 'Commande non trouvée' };
  }

  if (role === 'seller' && order.seller_id !== userId) {
    return { success: false, error: 'Accès refusé' };
  }
  if (!isAdminLike(role) && role !== 'seller') {
    return { success: false, error: 'Accès refusé' };
  }

  const { error: updateError } = await (supabase as any)
    .from('orders')
    .update({ status: normalized, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (updateError) {
    console.error('order.service updateOrderStatus:', updateError);
    return { success: false, error: 'Erreur lors de la mise à jour' };
  }
  return { success: true };
}
