/**
 * Service de gestion du statut vendeur automatique
 * PHASE 6 - Onboarding Vendeur
 */

import { createClient } from '@/lib/supabase/server';
import { getVendorByUserId, VendorStatus } from './vendor.service';
import { getVendorDocuments } from './document.service';

/**
 * Vérifie si un vendeur peut être vérifié automatiquement
 * Règles:
 * - Boutique doit être verified
 * - TOUS les documents requis doivent être approved
 */
export async function canVendorBeVerified(userId: string): Promise<boolean> {
  const supabase = await createClient();

  try {
    // Récupérer le vendor
    const vendor = await getVendorByUserId(userId);
    if (!vendor) return false;

    // Vérifier si la boutique est verified
    const { data: shops, error: shopsError } = await (supabase as any)
      .from('shops')
      .select('is_verified, status')
      .eq('vendor_id', vendor.id);

    if (shopsError || !shops || shops.length === 0) {
      return false;
    }

    const hasVerifiedShop = shops.some(
      (shop: any) => shop.is_verified === true && shop.status === 'verified'
    );

    if (!hasVerifiedShop) {
      return false;
    }

    // Vérifier si TOUS les documents requis sont approuvés
    const documents = await getVendorDocuments(vendor.id);

    if (documents.length === 0) {
      return false; // Au moins un document requis
    }

    const allDocumentsApproved = documents.every((doc) => doc.status === 'approved');

    return allDocumentsApproved;
  } catch (error) {
    console.error('Error checking if vendor can be verified:', error);
    return false;
  }
}

/**
 * Met à jour automatiquement le statut du vendor
 * Appelé après validation boutique ou document
 */
export async function updateVendorStatusAuto(userId: string): Promise<VendorStatus> {
  const supabase = await createClient();

  try {
    const vendor = await getVendorByUserId(userId);
    if (!vendor) return 'pending';

    // Si le vendor est suspendu, on ne change pas son statut
    if (vendor.status === 'suspended') {
      return 'suspended';
    }

    // Vérifier si le vendor peut être vérifié
    const canBeVerified = await canVendorBeVerified(userId);

    if (canBeVerified) {
      // Mettre à jour le statut à verified
      const { error } = await (supabase as any)
        .from('vendors')
        .update({ status: 'verified', updated_at: new Date().toISOString() })
        .eq('id', vendor.id);

      if (!error) {
        return 'verified';
      }
    } else {
      // Mettre à jour le statut à pending
      const { error } = await (supabase as any)
        .from('vendors')
        .update({ status: 'pending', updated_at: new Date().toISOString() })
        .eq('id', vendor.id);

      if (!error) {
        return 'pending';
      }
    }

    return vendor.status;
  } catch (error) {
    console.error('Error updating vendor status automatically:', error);
    return 'pending';
  }
}

/**
 * Vérifie si un vendeur est vérifié
 */
export async function isVendorVerified(userId: string): Promise<boolean> {
  const vendor = await getVendorByUserId(userId);
  return vendor?.status === 'verified' || false;
}

/**
 * Récupère le statut actuel du vendor avec détails
 */
export interface VendorStatusDetails {
  status: VendorStatus;
  shopStatus: 'draft' | 'pending' | 'verified' | 'suspended' | 'none';
  documentsStatus: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  canBeVerified: boolean;
}

export async function getVendorStatusDetails(userId: string): Promise<VendorStatusDetails | null> {
  const supabase = await createClient();

  try {
    const vendor = await getVendorByUserId(userId);
    if (!vendor) return null;

    // Récupérer le statut de la boutique
    const { data: shops } = await (supabase as any)
      .from('shops')
      .select('status')
      .eq('vendor_id', vendor.id)
      .limit(1)
      .single();

    const shopStatus = (shops?.status as any) || 'none';

    // Récupérer le statut des documents
    const documents = await getVendorDocuments(vendor.id);
    const documentsStatus = {
      total: documents.length,
      approved: documents.filter((d) => d.status === 'approved').length,
      pending: documents.filter((d) => d.status === 'pending').length,
      rejected: documents.filter((d) => d.status === 'rejected').length,
    };

    // Vérifier si le vendor peut être vérifié
    const canBeVerified = await canVendorBeVerified(userId);

    return {
      status: vendor.status,
      shopStatus,
      documentsStatus,
      canBeVerified,
    };
  } catch (error) {
    console.error('Error getting vendor status details:', error);
    return null;
  }
}
