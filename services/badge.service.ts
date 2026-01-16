/**
 * Service de gestion des badges
 * Gère l'attribution automatique et manuelle des badges
 */

import { createClient } from '@/lib/supabase/server';

export interface Badge {
  id: string;
  code: string;
  label: string;
  description?: string;
  category?: string;
  level_required?: 'bronze' | 'silver' | 'gold' | 'premium';
  created_at: string;
}

export interface VendorBadge {
  vendor_id: string;
  badge_id: string;
  assigned_at: string;
  badge?: Badge;
}

/**
 * Récupère tous les badges disponibles
 */
export async function getAllBadges(): Promise<Badge[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('badges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting badges:', error);
      return [];
    }

    return (data || []) as Badge[];
  } catch (error) {
    console.error('Error getting badges:', error);
    return [];
  }
}

/**
 * Récupère un badge par code
 */
export async function getBadgeByCode(code: string): Promise<Badge | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('badges')
      .select('*')
      .eq('code', code)
      .single();

    if (error) {
      console.error('Error getting badge:', error);
      return null;
    }

    return data as Badge;
  } catch (error) {
    console.error('Error getting badge:', error);
    return null;
  }
}

/**
 * Récupère les badges d'un vendor
 */
export async function getVendorBadges(vendorId: string): Promise<VendorBadge[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('vendor_badges')
      .select(`
        *,
        badge:badges(*)
      `)
      .eq('vendor_id', vendorId)
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('Error getting vendor badges:', error);
      return [];
    }

    return (data || []) as VendorBadge[];
  } catch (error) {
    console.error('Error getting vendor badges:', error);
    return [];
  }
}

/**
 * Attribue un badge à un vendor (admin seulement via RPC recommandé)
 */
export async function assignBadgeToVendor(
  vendorId: string,
  badgeId: string
): Promise<boolean> {
  const supabase = await createClient();

  try {
    // Vérifier si le badge est déjà attribué
    const { data: existing } = await (supabase as any)
      .from('vendor_badges')
      .select('vendor_id, badge_id')
      .eq('vendor_id', vendorId)
      .eq('badge_id', badgeId)
      .single();

    if (existing) {
      // Déjà attribué
      return true;
    }

    const { error } = await (supabase as any)
      .from('vendor_badges')
      .insert({
        vendor_id: vendorId,
        badge_id: badgeId,
      });

    if (error) {
      console.error('Error assigning badge:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error assigning badge:', error);
    return false;
  }
}

/**
 * Retire un badge d'un vendor
 */
export async function removeBadgeFromVendor(
  vendorId: string,
  badgeId: string
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { error } = await (supabase as any)
      .from('vendor_badges')
      .delete()
      .eq('vendor_id', vendorId)
      .eq('badge_id', badgeId);

    if (error) {
      console.error('Error removing badge:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error removing badge:', error);
    return false;
  }
}

/**
 * Attribue automatiquement les badges selon les critères
 */
export async function assignBadgesAuto(vendorId: string): Promise<void> {
  const supabase = await createClient();

  try {
    // Récupérer le vendor
    const { data: vendor } = await (supabase as any)
      .from('vendors')
      .select('status, level')
      .eq('id', vendorId)
      .single();

    if (!vendor) return;

    // Badge "Vendeur Vérifié" : si status = 'verified'
    if (vendor.status === 'verified') {
      const verifiedBadge = await getBadgeByCode('verified_seller');
      if (verifiedBadge) {
        await assignBadgeToVendor(vendorId, verifiedBadge.id);
      }
    }

    // Badge "Nouveau Vendeur" : si créé récemment (< 30 jours)
    const { data: vendorCreated } = await (supabase as any)
      .from('vendors')
      .select('created_at')
      .eq('id', vendorId)
      .single();

    if (vendorCreated) {
      const createdDate = new Date(vendorCreated.created_at);
      const daysSinceCreation = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceCreation < 30) {
        const newSellerBadge = await getBadgeByCode('new_seller');
        if (newSellerBadge) {
          await assignBadgeToVendor(vendorId, newSellerBadge.id);
        }
      }
    }

    // Badge "Top Vendeur" : si level = 'gold' ou 'premium' et >= 100 commandes
    if (vendor.level === 'gold' || vendor.level === 'premium') {
      const { data: orders } = await (supabase as any)
        .from('orders')
        .select('id')
        .eq('seller_id', vendorId)
        .in('status', ['CONFIRMED', 'SHIPPED', 'DELIVERED']);

      if (orders && orders.length >= 100) {
        const topSellerBadge = await getBadgeByCode('top_seller');
        if (topSellerBadge) {
          await assignBadgeToVendor(vendorId, topSellerBadge.id);
        }
      }
    }

    // Badge "Partenaire Premium" : si level = 'premium'
    if (vendor.level === 'premium') {
      const premiumBadge = await getBadgeByCode('premium_partner');
      if (premiumBadge) {
        await assignBadgeToVendor(vendorId, premiumBadge.id);
      }
    }
  } catch (error) {
    console.error('Error assigning badges automatically:', error);
  }
}
