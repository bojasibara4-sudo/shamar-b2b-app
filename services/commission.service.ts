/**
 * Service de gestion des commissions
 * Calcule les commissions basées sur le niveau vendeur et la catégorie
 */

import { createClient } from '@/lib/supabase/server';
import type { VendorLevel } from './vendor.service';

export interface Commission {
  id: string;
  category?: string;
  vendor_level: VendorLevel;
  percentage: number;
  created_at: string;
  updated_at: string;
}

export interface CommissionCalculation {
  orderAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  vendorRevenue: number;
}

/**
 * Récupère le taux de commission pour un niveau et une catégorie
 */
export async function getCommissionRate(
  vendorLevel: VendorLevel,
  category?: string
): Promise<number> {
  const supabase = await createClient();

  try {
    // Chercher d'abord une commission spécifique à la catégorie
    if (category) {
      const { data: categoryCommission } = await (supabase as any)
        .from('commissions')
        .select('percentage')
        .eq('category', category)
        .eq('vendor_level', vendorLevel)
        .single();

      if (categoryCommission) {
        return Number(categoryCommission.percentage);
      }
    }

    // Sinon, utiliser le taux général pour le niveau
    const { data: generalCommission } = await (supabase as any)
      .from('commissions')
      .select('percentage')
      .is('category', null)
      .eq('vendor_level', vendorLevel)
      .single();

    if (generalCommission) {
      return Number(generalCommission.percentage);
    }

    // Taux par défaut si aucune commission trouvée
    const defaultRates: Record<VendorLevel, number> = {
      bronze: 15.0,
      silver: 12.0,
      gold: 10.0,
      premium: 8.0,
    };

    return defaultRates[vendorLevel] || 15.0;
  } catch (error) {
    console.error('Error getting commission rate:', error);
    return 15.0;
  }
}

/**
 * Calcule la commission pour une commande
 */
export async function calculateCommission(
  orderAmount: number,
  vendorLevel: VendorLevel,
  category?: string
): Promise<CommissionCalculation> {
  const commissionPercentage = await getCommissionRate(vendorLevel, category);
  const commissionAmount = (orderAmount * commissionPercentage) / 100;
  const vendorRevenue = orderAmount - commissionAmount;

  return {
    orderAmount,
    commissionPercentage,
    commissionAmount: Math.round(commissionAmount * 100) / 100,
    vendorRevenue: Math.round(vendorRevenue * 100) / 100,
  };
}

/**
 * Crée une transaction pour une commande
 */
export async function createTransaction(
  orderId: string,
  amount: number,
  commissionAmount: number
): Promise<string | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('transactions')
      .insert({
        order_id: orderId,
        amount,
        commission_amount: commissionAmount,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
}

/**
 * Met à jour le statut d'une transaction
 */
export async function updateTransactionStatus(
  transactionId: string,
  status: 'pending' | 'paid' | 'failed'
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const { error } = await (supabase as any)
      .from('transactions')
      .update({ status })
      .eq('id', transactionId);

    if (error) {
      console.error('Error updating transaction status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    return false;
  }
}

/**
 * Récupère les transactions d'un vendor
 */
export async function getVendorTransactions(vendorId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('transactions')
      .select(`
        *,
        order:orders!transactions_order_id_fkey(id, total_amount, currency, status, created_at)
      `)
      .eq('order.seller_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting vendor transactions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting vendor transactions:', error);
    return [];
  }
}
