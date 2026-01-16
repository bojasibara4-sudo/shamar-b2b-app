/**
 * Utilitaires pour vérifier les vendors et boutiques
 * Utilisé dans les API routes pour les blocages métier
 */

import { createClient } from './supabase/server';

/**
 * Vérifie si un vendeur est vérifié (peut vendre)
 */
export async function isVendorVerified(userId: string): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { data: vendor } = await (supabase as any)
      .from('vendors')
      .select('status')
      .eq('user_id', userId)
      .single();

    return vendor?.status === 'verified';
  } catch {
    return false;
  }
}

/**
 * Vérifie si une boutique est vérifiée (visible publiquement)
 */
export async function isShopVerified(shopId: string): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { data: shop } = await (supabase as any)
      .from('shops')
      .select('is_verified')
      .eq('id', shopId)
      .single();

    return shop?.is_verified === true;
  } catch {
    return false;
  }
}

/**
 * Récupère le vendor_id d'un user_id
 */
export async function getVendorIdByUserId(userId: string): Promise<string | null> {
  const supabase = await createClient();

  try {
    const { data: vendor } = await (supabase as any)
      .from('vendors')
      .select('id')
      .eq('user_id', userId)
      .single();

    return vendor?.id || null;
  } catch {
    return null;
  }
}
