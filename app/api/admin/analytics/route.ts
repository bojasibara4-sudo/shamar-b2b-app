import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAdminAnalytics } from '@/services/analytics.service';

export async function GET() {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const analytics = await getAdminAnalytics();
    return NextResponse.json({ analytics: analytics || {
      gmv: 0,
      platformRevenue: 0,
      vendorRevenue: 0,
      topVendors: [],
      conversionRate: 0,
      totalOrders: 0,
      completedOrders: 0,
      totalPayments: 0,
      totalPayouts: 0,
    } });
  } catch (error) {
    console.error('Error in GET /api/admin/analytics:', error);
    return NextResponse.json({ analytics: null }, { status: 500 });
  }
}
