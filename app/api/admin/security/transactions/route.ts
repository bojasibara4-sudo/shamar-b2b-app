import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { getSecurityTransactions } from '@/services/security.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !isAdminLike(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '100', 10);
    const list = await getSecurityTransactions(limit);
    return NextResponse.json(list);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
