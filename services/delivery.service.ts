/**
 * Service de gestion des livraisons
 * Version simplifiée - stable et fonctionnelle
 */

import { createClient } from '@/lib/supabase/server';

export interface Delivery {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id?: string;
  vendor_id?: string;
  status: 'pending' | 'shipped' | 'delivered';
  created_at: string;
  carrier_name?: string | null;
  tracking_code?: string | null;
  tracking_url?: string | null;
  shipping_address?: string | null;
  cost?: number | null;
  currency?: string | null;
  estimated_delivery_date?: string | null;
  actual_delivery_date?: string | null;
  notes?: string | null;
  proof_photo_url?: string | null;
  proof_signature_url?: string | null;
  proof_qr_scan_at?: string | null;
}

/**
 * Récupère les livraisons d'un acheteur
 */
export async function getBuyerDeliveries(buyerId: string): Promise<Delivery[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('deliveries')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return (data || []) as Delivery[];
  } catch (error) {
    return [];
  }
}

/**
 * Récupère une livraison par ID
 */
export async function getDeliveryById(deliveryId: string): Promise<Delivery | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('deliveries')
      .select('*')
      .eq('id', deliveryId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Delivery;
  } catch (error) {
    return null;
  }
}

/**
 * Met à jour le statut d'une livraison
 */
export async function updateDeliveryStatus(
  deliveryId: string,
  status: 'pending' | 'shipped' | 'delivered',
  trackingCode?: string,
  notes?: string,
  carrierName?: string
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const updateData: Record<string, unknown> = { status };
    
    if (trackingCode) {
      updateData.tracking_code = trackingCode;
    }
    if (notes) {
      updateData.notes = notes;
    }
    if (carrierName) {
      updateData.carrier_name = carrierName;
    }
    if (status === 'delivered') {
      updateData.actual_delivery_date = new Date().toISOString().split('T')[0];
    }

    const { error } = await (supabase as any)
      .from('deliveries')
      .update(updateData)
      .eq('id', deliveryId);

    return !error;
  } catch (error) {
    return false;
  }
}

/**
 * Récupère une livraison par order_id
 */
export async function getDeliveryByOrderId(orderId: string): Promise<Delivery | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('deliveries')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Delivery;
  } catch (error) {
    return null;
  }
}

/**
 * Récupère les livraisons d'un vendeur
 */
export async function getVendorDeliveries(vendorId: string): Promise<Delivery[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('deliveries')
      .select('*')
      .or(`vendor_id.eq.${vendorId},seller_id.eq.${vendorId}`)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return (data || []) as Delivery[];
  } catch (error) {
    return [];
  }
}

/**
 * Crée une livraison
 */
export async function createDelivery(
  orderId: string,
  vendorId: string,
  buyerId: string,
  method: 'standard' | 'express' | 'pickup' = 'standard',
  shippingAddress?: string,
  currency: string = 'FCFA'
): Promise<Delivery | null> {
  const supabase = await createClient();

  try {
    const cost = method === 'express' ? 5000 : method === 'pickup' ? 0 : 2000;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + (method === 'express' ? 2 : 5));

    const { data, error } = await (supabase as any)
      .from('deliveries')
      .insert({
        order_id: orderId,
        vendor_id: vendorId,
        buyer_id: buyerId,
        method,
        cost,
        currency,
        status: 'pending',
        shipping_address: shippingAddress,
        estimated_delivery_date: estimatedDate.toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) {
      return null;
    }

    return data as Delivery;
  } catch (error) {
    return null;
  }
}

/**
 * Confirme la réception d'une livraison
 */
export async function confirmDeliveryReceipt(
  deliveryId: string,
  userId: string
): Promise<{ ok: boolean; error?: string }> {
  const delivery = await getDeliveryById(deliveryId);
  
  if (!delivery) {
    return { ok: false, error: 'Livraison introuvable' };
  }
  
  if (delivery.buyer_id !== userId) {
    return { ok: false, error: 'Accès refusé' };
  }
  
  if (delivery.status === 'delivered') {
    return { ok: true };
  }

  const okStatus = await updateDeliveryStatus(deliveryId, 'delivered');
  if (!okStatus) {
    return { ok: false, error: 'Erreur mise à jour livraison' };
  }

  return { ok: true };
}
