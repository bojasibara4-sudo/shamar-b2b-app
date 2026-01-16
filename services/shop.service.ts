/**
 * Service de gestion des boutiques (shops)
 * PHASE 6 - Onboarding Vendeur
 */

import { createClient } from '@/lib/supabase/server';
import { getVendorByUserId } from './vendor.service';

export type ShopStatus = 'draft' | 'pending' | 'verified' | 'suspended';

export interface Shop {
  id: string;
  vendor_id: string;
  seller_id?: string;
  name: string;
  description?: string;
  category?: string;
  country?: string;
  status: ShopStatus;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Crée une boutique pour un vendeur
 * Règle: Un seller ne peut avoir qu'UNE boutique active (non-draft)
 */
export async function createShop(
  userId: string,
  data: {
    name: string;
    description?: string;
    category?: string;
    country?: string;
  }
): Promise<Shop | null> {
  const supabase = await createClient();

  try {
    // Récupérer le vendor
    const vendor = await getVendorByUserId(userId);
    if (!vendor) {
      console.error('Vendor not found for user:', userId);
      return null;
    }

    // Vérifier qu'il n'existe pas déjà une boutique active
    const { data: existingShops } = await (supabase as any)
      .from('shops')
      .select('id, status')
      .eq('vendor_id', vendor.id)
      .in('status', ['pending', 'verified', 'suspended']);

    if (existingShops && existingShops.length > 0) {
      console.error('Shop already exists for this vendor');
      return null;
    }

    // Créer la boutique
    const { data: shop, error } = await (supabase as any)
      .from('shops')
      .insert({
        vendor_id: vendor.id,
        seller_id: userId,
        name: data.name,
        description: data.description || null,
        category: data.category || null,
        country: data.country || null,
        status: 'draft',
        is_verified: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating shop:', error);
      return null;
    }

    return shop as Shop;
  } catch (error) {
    console.error('Error creating shop:', error);
    return null;
  }
}

/**
 * Met à jour une boutique
 */
export async function updateShop(
  userId: string,
  shopId: string,
  data: {
    name?: string;
    description?: string;
    category?: string;
    country?: string;
    status?: ShopStatus;
  }
): Promise<Shop | null> {
  const supabase = await createClient();

  try {
    // Vérifier que la boutique appartient au vendor
    const vendor = await getVendorByUserId(userId);
    if (!vendor) return null;

    const { data: shop, error } = await (supabase as any)
      .from('shops')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', shopId)
      .eq('vendor_id', vendor.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating shop:', error);
      return null;
    }

    return shop as Shop;
  } catch (error) {
    console.error('Error updating shop:', error);
    return null;
  }
}

/**
 * Récupère la boutique d'un vendeur
 */
export async function getShopByVendorId(vendorId: string): Promise<Shop | null> {
  const supabase = await createClient();

  try {
    const { data: shop, error } = await (supabase as any)
      .from('shops')
      .select('*')
      .eq('vendor_id', vendorId)
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Pas de boutique trouvée
        return null;
      }
      console.error('Error getting shop:', error);
      return null;
    }

    return shop as Shop;
  } catch (error) {
    console.error('Error getting shop:', error);
    return null;
  }
}

/**
 * Récupère la boutique d'un utilisateur (par user_id)
 */
export async function getShopByUserId(userId: string): Promise<Shop | null> {
  const vendor = await getVendorByUserId(userId);
  if (!vendor) return null;
  return getShopByVendorId(vendor.id);
}

/**
 * Soumet une boutique pour validation (draft -> pending)
 */
export async function submitShopForVerification(userId: string, shopId: string): Promise<Shop | null> {
  const supabase = await createClient();

  try {
    const vendor = await getVendorByUserId(userId);
    if (!vendor) return null;

    const { data: shop, error } = await (supabase as any)
      .from('shops')
      .update({
        status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', shopId)
      .eq('vendor_id', vendor.id)
      .select()
      .single();

    if (error) {
      console.error('Error submitting shop for verification:', error);
      return null;
    }

    return shop as Shop;
  } catch (error) {
    console.error('Error submitting shop for verification:', error);
    return null;
  }
}
