import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = getCurrentUser();

    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    // Récupérer les statistiques du vendeur
    const [
      { count: totalProducts },
      { count: activeProducts },
      { count: totalOrders },
      { count: pendingOrders },
      { count: activeOffers },
      { data: recentOrders },
      { data: recentProducts }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('seller_id', user.id),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('seller_id', user.id).eq('status', 'active'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('seller_id', user.id),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('seller_id', user.id).eq('status', 'PENDING'),
      supabase.from('offers').select('*', { count: 'exact', head: true }).eq('seller_id', user.id).eq('status', 'pending'),
      supabase.from('orders').select('id, total_amount, status, created_at, buyer_id').eq('seller_id', user.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('products').select('id, name, status, created_at').eq('seller_id', user.id).order('created_at', { ascending: false }).limit(5)
    ]);

    // Calculer le revenu total (somme des commandes livrées)
    const { data: completedOrders } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('seller_id', user.id)
      .eq('status', 'DELIVERED');

    const totalRevenue = completedOrders?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;

    return NextResponse.json({
      stats: {
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        activeOffers: activeOffers || 0,
        totalRevenue,
      },
      recentOrders: recentOrders || [],
      recentProducts: recentProducts || [],
    });
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
