/**
 * Service de gestion des versements aux vendeurs
 * PHASE 7 - Production Ready
 */

import { createClient } from '@/lib/supabase/server';
import { getVendorByUserId } from './vendor.service';

export type PayoutStatus = 'pending' | 'sent' | 'failed';

export interface Payout {
  id: string;
  vendor_id: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  period_start: string;
  period_end: string;
  provider_payout_id?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

/**
 * Calcule le montant disponible pour un vendeur (paiements payés non versés)
 */
export async function calculateVendorPendingAmount(userId: string): Promise<number> {
  const supabase = await createClient();

  try {

    const { data: payments } = await (supabase as any)
      .from('payments')
      .select('vendor_amount, currency')
      .eq('vendor_id', userId)
      .eq('status', 'paid');

    if (!payments || payments.length === 0) return 0;

    // Calculer le total des paiements payés
    let totalAmount = 0;
    payments.forEach((payment: any) => {
      totalAmount += Number(payment.vendor_amount || 0);
    });

    // Soustraire les payouts déjà envoyés
    const { data: payouts } = await (supabase as any)
      .from('payouts')
      .select('amount')
      .eq('vendor_id', userId)
      .in('status', ['sent', 'pending']);

    if (payouts && payouts.length > 0) {
      payouts.forEach((payout: any) => {
        totalAmount -= Number(payout.amount || 0);
      });
    }

    return Math.max(0, totalAmount);
  } catch (error) {
    console.error('Error calculating vendor pending amount:', error);
    return 0;
  }
}

/**
 * Crée un payout pour un vendeur
 */
export async function createPayout(
  vendorId: string,
  amount: number,
  periodStart: string,
  periodEnd: string,
  currency: string = 'FCFA'
): Promise<Payout | null> {
  const supabase = await createClient();

  try {
    const { data: payout, error } = await (supabase as any)
      .from('payouts')
      .insert({
        vendor_id: vendorId,
        amount,
        currency,
        status: 'pending',
        period_start: periodStart,
        period_end: periodEnd,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payout:', error);
      return null;
    }

    return payout as Payout;
  } catch (error) {
    console.error('Error creating payout:', error);
    return null;
  }
}

/**
 * Met à jour le statut d'un payout
 */
export async function updatePayoutStatus(
  payoutId: string,
  status: PayoutStatus,
  providerPayoutId?: string
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (providerPayoutId) {
      updateData.provider_payout_id = providerPayoutId;
    }

    const { error } = await (supabase as any)
      .from('payouts')
      .update(updateData)
      .eq('id', payoutId);

    if (error) {
      console.error('Error updating payout status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating payout status:', error);
    return false;
  }
}

/**
 * Récupère les payouts d'un vendeur
 */
export async function getVendorPayouts(userId: string): Promise<Payout[]> {
  const supabase = await createClient();

  try {
    const { data: payouts, error } = await (supabase as any)
      .from('payouts')
      .select('*')
      .eq('vendor_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting vendor payouts:', error);
      return [];
    }

    return (payouts || []) as Payout[];
  } catch (error) {
    console.error('Error getting vendor payouts:', error);
    return [];
  }
}
