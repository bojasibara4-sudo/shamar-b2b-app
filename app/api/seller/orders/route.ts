import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Configuration Supabase manquante' },
      { status: 500 }
    );
  }

  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          *,
          product:products(id, name, price, currency, category)
        ),
        buyer:users!orders_buyer_id_fkey(email, full_name, company_name),
        transactions:transactions(id, amount, commission_amount, status)
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seller orders:', error);
      return NextResponse.json({ orders: [] });
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    console.error('Error in GET /api/seller/orders:', error);
    return NextResponse.json({ orders: [] });
  }
}
