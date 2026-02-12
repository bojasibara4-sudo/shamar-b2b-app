/**
 * GET /api/admin/security
 * ASB Security — Logs et stats (admin uniquement)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { getSecurityLogs, getSecurityStats } from '@/services/security.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !isAdminLike(user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const severity = searchParams.get('severity') as 'low' | 'medium' | 'high' | 'critical' | null;
    const eventType = searchParams.get('event_type') as string | null;
    const userId = searchParams.get('user_id') || undefined;
    const statsOnly = searchParams.get('stats') === 'true';

    const [logs, stats] = await Promise.all([
      statsOnly ? [] : getSecurityLogs({ limit, severity, eventType: eventType as any, userId }),
      getSecurityStats(),
    ]);

    return NextResponse.json({
      logs: statsOnly ? undefined : logs,
      stats,
    });
  } catch (error) {
    console.error('Error fetching security data:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données sécurité' },
      { status: 500 }
    );
  }
}
