/**
 * Service de gestion des livraisons
 * PHASE 8 - Production Ready
 */

import { createClient } from '@/lib/supabase/server';

export type DeliveryMethod = 'standard' | 'express' | 'pickup';
export type DeliveryStatus = 'pending' | 'shipped' | 'delivered' | 'disputed';

export interface Delivery {
  id: string;
  order_id: string;
  vendor_id: string;
  buyer_id: string;
  method: DeliveryMethod;
  cost: number;
  currency: string;
  status: DeliveryStatus;
  tracking_code?: string;
  shipping_address?: string;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Calcule les frais de livraison
 */
export function calculateDeliveryCost(
  method: DeliveryMethod,
  distance?: number
): number {
  const baseCosts = {
    standard: 2000, // 2000 FCFA
    express: 5000, // 5000 FCFA
    pickup: 0,
  };

  return baseCosts[method] || 2000;
}

/**
 * Crée une livraison
 */
export async function createDelivery(
  orderId: string,
  vendorId: string,
  buyerId: string,
  method: DeliveryMethod,
  shippingAddress?: string,
  currency: string = 'FCFA'
): Promise<Delivery | null> {
  const supabase = await createClient();

  try {
    const cost = calculateDeliveryCost(method);
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + (method === 'express' ? 2 : 5));

    const { data: delivery, error } = await (supabase as any)
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
      console.error('Error creating delivery:', error);
      return null;
    }

    return delivery as Delivery;
  } catch (error) {
    console.error('Error creating delivery:', error);
    return null;
  }
}

/**
 * Met à jour le statut d'une livraison
 */
export async function updateDeliveryStatus(
  deliveryId: string,
  status: DeliveryStatus,
  trackingCode?: string,
  notes?: string
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (trackingCode) {
      updateData.tracking_code = trackingCode;
    }

    if (notes) {
      updateData.notes = notes;
    }

    if (status === 'delivered') {
      updateData.actual_delivery_date = new Date().toISOString().split('T')[0];
    }

    const { error } = await (supabase as any)
      .from('deliveries')
      .update(updateData)
      .eq('id', deliveryId);

    if (error) {
      console.error('Error updating delivery status:', error);
      return false;
    }

    // Mettre à jour le statut de la commande si livrée
    if (status === 'delivered') {
      const { data: delivery } = await (supabase as any)
        .from('deliveries')
        .select('order_id')
        .eq('id', deliveryId)
        .single();

      if (delivery) {
        await (supabase as any)
          .from('orders')
          .update({ status: 'DELIVERED' })
          .eq('id', delivery.order_id);
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return false;
  }
}

/**
 * Récupère une livraison par order_id
 */
export async function getDeliveryByOrderId(orderId: string): Promise<Delivery | null> {
  const supabase = await createClient();

  try {
    const { data: delivery, error } = await (supabase as any)
      .from('deliveries')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error getting delivery:', error);
      return null;
    }

    return delivery as Delivery;
  } catch (error) {
    console.error('Error getting delivery:', error);
    return null;
  }
}

/**
 * Récupère les livraisons d'un vendeur
 */
export async function getVendorDeliveries(vendorId: string): Promise<Delivery[]> {
  const supabase = await createClient();

  try {
    const { data: deliveries, error } = await (supabase as any)
      .from('deliveries')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting vendor deliveries:', error);
      return [];
    }

    return (deliveries || []) as Delivery[];
  } catch (error) {
    console.error('Error getting vendor deliveries:', error);
    return [];
  }
}
