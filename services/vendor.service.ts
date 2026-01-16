/**
 * Service de gestion des vendeurs (vendors)
 * Gère les profils vendeurs, niveaux, statuts
 */

import { createClient } from '@/lib/supabase/server';

export type VendorStatus = 'pending' | 'verified' | 'suspended';
export type VendorLevel = 'bronze' | 'silver' | 'gold' | 'premium';

export interface Vendor {
  id: string;
  user_id: string;
  status: VendorStatus;
  level: VendorLevel;
  created_at: string;
  updated_at: string;
}

export interface VendorWithUser extends Vendor {
  user?: {
    id: string;
    email: string;
    full_name?: string;
    company_name?: string;
  };
}

/**
 * Crée un vendor pour un utilisateur seller
 */
export async function createVendor(userId: string): Promise<Vendor | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('vendors')
      .insert({
        user_id: userId,
        status: 'pending',
        level: 'bronze',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating vendor:', error);
      return null;
    }

    return data as Vendor;
  } catch (error) {
    console.error('Error creating vendor:', error);
    return null;
  }
}

/**
 * Récupère un vendor par user_id
 */
export async function getVendorByUserId(userId: string): Promise<Vendor | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error getting vendor:', error);
      return null;
    }

    return data as Vendor;
  } catch (error) {
    console.error('Error getting vendor:', error);
    return null;
  }
}

/**
 * Récupère un vendor avec ses informations utilisateur
 */
export async function getVendorWithUser(userId: string): Promise<VendorWithUser | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('vendors')
      .select(`
        *,
        user:users!vendors_user_id_fkey(id, email, full_name, company_name)
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error getting vendor with user:', error);
      return null;
    }

    return data as VendorWithUser;
  } catch (error) {
    console.error('Error getting vendor with user:', error);
    return null;
  }
}

/**
 * Met à jour le niveau d'un vendor
 */
export async function updateVendorLevel(
  vendorId: string,
  level: VendorLevel
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { error } = await (supabase as any)
      .from('vendors')
      .update({ level })
      .eq('id', vendorId);

    if (error) {
      console.error('Error updating vendor level:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating vendor level:', error);
    return false;
  }
}

/**
 * Met à jour le statut d'un vendor
 */
export async function updateVendorStatus(
  vendorId: string,
  status: VendorStatus
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { error } = await (supabase as any)
      .from('vendors')
      .update({ status })
      .eq('id', vendorId);

    if (error) {
      console.error('Error updating vendor status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating vendor status:', error);
    return false;
  }
}

/**
 * Calcule le niveau d'un vendor basé sur ses performances
 * Règles :
 * - Bronze : par défaut
 * - Silver : 10+ commandes validées
 * - Gold : 50+ commandes validées, revenus > 1M FCFA
 * - Premium : 200+ commandes validées, revenus > 10M FCFA, tous documents validés
 */
export async function calculateVendorLevel(vendorId: string): Promise<VendorLevel> {
  const supabase = await createClient();

  try {
    // Compter les commandes validées/complétées
    const { data: orders, error: ordersError } = await (supabase as any)
      .from('orders')
      .select('total_amount, currency')
      .eq('seller_id', vendorId)
      .in('status', ['CONFIRMED', 'SHIPPED', 'DELIVERED']);

    if (ordersError) {
      console.error('Error counting orders:', ordersError);
      return 'bronze';
    }

    const orderCount = orders?.length || 0;

    // Calculer le revenu total (convertir en FCFA pour comparaison)
    let totalRevenue = 0;
    orders?.forEach((order: any) => {
      let amount = Number(order.total_amount);
      // Conversion simple (approximative)
      if (order.currency === 'USD') amount *= 600; // 1 USD ≈ 600 FCFA
      if (order.currency === 'EUR') amount *= 650; // 1 EUR ≈ 650 FCFA
      totalRevenue += amount;
    });

    // Vérifier les documents validés (pour Premium)
    const { data: documents } = await (supabase as any)
      .from('documents')
      .select('status')
      .eq('vendor_id', vendorId);

    const allDocumentsApproved =
      documents &&
      documents.length > 0 &&
      documents.every((doc: any) => doc.status === 'approved');

    // Calcul du niveau
    if (orderCount >= 200 && totalRevenue >= 10_000_000 && allDocumentsApproved) {
      return 'premium';
    } else if (orderCount >= 50 && totalRevenue >= 1_000_000) {
      return 'gold';
    } else if (orderCount >= 10) {
      return 'silver';
    }

    return 'bronze';
  } catch (error) {
    console.error('Error calculating vendor level:', error);
    return 'bronze';
  }
}

/**
 * Met à jour automatiquement le niveau d'un vendor
 */
export async function updateVendorLevelAuto(vendorId: string): Promise<boolean> {
  const newLevel = await calculateVendorLevel(vendorId);
  return updateVendorLevel(vendorId, newLevel);
}
