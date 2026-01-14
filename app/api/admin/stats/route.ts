import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const user = getCurrentUser();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    // Récupérer les statistiques globales
    const [
      { count: totalUsers },
      { count: totalSellers },
      { count: totalBuyers },
      { count: totalProducts },
      { count: totalOrders },
      { count: pendingOrders },
      { count: activeOffers },
      { data: recentUsers },
      { data: recentOrders }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'buyer'),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
      supabase.from('offers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('users').select('id, email, role, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('orders').select('id, total_amount, status, created_at, buyer_id').order('created_at', { ascending: false }).limit(5)
    ]);

    // Calculer le revenu total (somme des commandes livrées)
    const { data: completedOrders } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'DELIVERED');

    const totalRevenue = completedOrders?.reduce((sum, order) => sum + Number(order.total_amount || 0), 0) || 0;

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalSellers: totalSellers || 0,
        totalBuyers: totalBuyers || 0,
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        activeOffers: activeOffers || 0,
        totalRevenue,
      },
      recentUsers: recentUsers || [],
      recentOrders: recentOrders || [],
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
