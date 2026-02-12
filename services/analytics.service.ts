/**
 * Service d'analytics pour admin
 * PHASE 9 - Production Ready
 */

import { createClient } from '@/lib/supabase/server';

export interface AnalyticsData {
  gmv: number; // Gross Merchandise Value
  platformRevenue: number; // Revenus plateforme (commissions)
  vendorRevenue: number; // Revenus vendeurs (net)
  topVendors: Array<{
    vendor_id: string;
    vendor_name: string;
    total_revenue: number;
    order_count: number;
  }>;
  conversionRate: number; // Taux de conversion
  totalOrders: number;
  completedOrders: number;
  totalPayments: number;
  totalPayouts: number;
}

/**
 * Récupère les analytics globales pour admin
 */
export async function getAdminAnalytics(): Promise<AnalyticsData | null> {
  const supabase = await createClient();

  try {
    // Récupérer tous les paiements payés
    const { data: payments } = await (supabase as any)
      .from('payments')
      .select('amount_total, commission_amount, seller_amount, seller_id, order_id')
      .eq('status', 'paid');

    // Calculer GMV (somme de tous les paiements)
    const gmv = payments?.reduce((sum: number, p: any) => sum + Number(p.amount_total || 0), 0) || 0;

    // Calculer revenus plateforme (commissions)
    const platformRevenue = payments?.reduce((sum: number, p: any) => sum + Number(p.commission_amount || 0), 0) || 0;

    // Calculer revenus vendeurs (net)
    const vendorRevenue = payments?.reduce((sum: number, p: any) => sum + Number(p.seller_amount || 0), 0) || 0;

    // Top sellers
    const vendorStats: Record<string, { revenue: number; orderCount: number; seller_id: string }> = {};
    payments?.forEach((payment: any) => {
      const vid = payment.seller_id;
      if (!vendorStats[vid]) {
        vendorStats[vid] = { revenue: 0, orderCount: 0, seller_id: vid };
      }
      vendorStats[vid].revenue += Number(payment.seller_amount || 0);
      vendorStats[vid].orderCount += 1;
    });

    // Récupérer les noms des vendeurs
    const vendorIds = Object.keys(vendorStats);
    const { data: vendors } = await (supabase as any)
      .from('users')
      .select('id, email, full_name, company_name')
      .in('id', vendorIds);

    const topVendors = Object.values(vendorStats)
      .map((stat) => {
        const vendor = vendors?.find((v: any) => v.id === stat.seller_id);
        return {
          vendor_id: stat.seller_id,
          vendor_name: vendor?.company_name || vendor?.full_name || vendor?.email || 'Seller',
          total_revenue: stat.revenue,
          order_count: stat.orderCount,
        };
      })
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 10);

    // Compter les commandes
    const { count: totalOrders } = await (supabase as any)
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { count: completedOrders } = await (supabase as any)
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'DELIVERED');

    // Taux de conversion (commandes complétées / total commandes)
    const conversionRate = totalOrders && totalOrders > 0
      ? (completedOrders || 0) / totalOrders * 100
      : 0;

    // Compter les paiements et payouts
    const { count: totalPayments } = await (supabase as any)
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'paid');

    const { count: totalPayouts } = await (supabase as any)
      .from('payouts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent');

    return {
      gmv,
      platformRevenue,
      vendorRevenue,
      topVendors,
      conversionRate: Math.round(conversionRate * 100) / 100,
      totalOrders: totalOrders || 0,
      completedOrders: completedOrders || 0,
      totalPayments: totalPayments || 0,
      totalPayouts: totalPayouts || 0,
    };
  } catch (error) {
    console.error('Error getting admin analytics:', error);
    return null;
  }
}
