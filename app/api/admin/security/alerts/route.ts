import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { getSecurityAlerts, updateAlertStatus } from '@/services/security.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdminLike(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const status = request.nextUrl.searchParams.get('status') || undefined;
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50', 10);
    const alerts = await getSecurityAlerts({ status, limit });
    return NextResponse.json(alerts);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdminLike(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const body = await request.json();
    const { id, status } = body as { id: string; status: string };
    if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    const ok = await updateAlertStatus(id, status, user.id);
    return NextResponse.json({ success: ok });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
