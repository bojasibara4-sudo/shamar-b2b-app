import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET() {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'admin') {
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
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        order:orders!transactions_order_id_fkey(
          id,
          total_amount,
          currency,
          status,
          buyer:users!orders_buyer_id_fkey(email, company_name),
          seller:users!orders_seller_id_fkey(email, company_name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json({ transactions: [] });
    }

    return NextResponse.json({ transactions: transactions || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/transactions:', error);
    return NextResponse.json({ transactions: [] });
  }
}
