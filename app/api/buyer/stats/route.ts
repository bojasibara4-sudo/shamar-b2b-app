import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'buyer') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    // Récupérer les statistiques de l'acheteur
    const [
      { count: totalOrders },
      { count: pendingOrders },
      { count: activeOffers },
      { data: recentOrders },
      { data: recentOffers }
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('buyer_id', user.id),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('buyer_id', user.id).eq('status', 'PENDING'),
      supabase.from('offers').select('*', { count: 'exact', head: true }).eq('buyer_id', user.id).eq('status', 'pending'),
      supabase.from('orders').select('id, total_amount, status, created_at, seller_id').eq('buyer_id', user.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('offers').select('id, price, quantity, status, created_at, product_id').eq('buyer_id', user.id).order('created_at', { ascending: false }).limit(5)
    ]);

    // Calculer le montant total dépensé (somme des commandes payées/delivrées)
    const { data: completedOrders } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('buyer_id', user.id)
      .in('status', ['DELIVERED', 'SHIPPED']);

    const totalSpent = completedOrders?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;

    return NextResponse.json({
      stats: {
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        activeOffers: activeOffers || 0,
        totalSpent,
      },
      recentOrders: recentOrders || [],
      recentOffers: recentOffers || [],
    });
  } catch (error) {
    console.error('Error fetching buyer stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
