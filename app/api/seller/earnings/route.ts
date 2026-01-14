import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getVendorTransactions } from '@/services/commission.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Configuration Supabase manquante' },
      { status: 500 }
    );
  }

  try {
    // Récupérer le vendor_id
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!vendor) {
      return NextResponse.json({
        earnings: {
          totalRevenue: 0,
          totalCommissions: 0,
          netEarnings: 0,
          totalTransactions: 0,
          currency: 'FCFA',
        },
      });
    }

    // Récupérer les transactions
    const transactions = await getVendorTransactions(vendor.id);

    let totalRevenue = 0;
    let totalCommissions = 0;
    let currency = 'FCFA';

    transactions.forEach((tx: any) => {
      if (tx.order && tx.status === 'paid') {
        totalRevenue += Number(tx.amount || 0);
        totalCommissions += Number(tx.commission_amount || 0);
        currency = tx.order.currency || 'FCFA';
      }
    });

    const netEarnings = totalRevenue - totalCommissions;

    return NextResponse.json({
      earnings: {
        totalRevenue,
        totalCommissions,
        netEarnings,
        totalTransactions: transactions.length,
        currency,
      },
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json({
      earnings: {
        totalRevenue: 0,
        totalCommissions: 0,
        netEarnings: 0,
        totalTransactions: 0,
        currency: 'FCFA',
      },
    });
  }
}
