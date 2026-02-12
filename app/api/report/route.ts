import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createReport } from '@/services/security.service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const { report_type, target_id, message } = body as { report_type: string; target_id: string; message?: string };
    if (!report_type || !target_id) return NextResponse.json({ error: 'report_type and target_id required' }, { status: 400 });
    if (!['vendor', 'product', 'user'].includes(report_type)) return NextResponse.json({ error: 'Invalid report_type' }, { status: 400 });
    const result = await createReport(user.id, report_type as 'vendor' | 'product' | 'user', target_id, message);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true, id: result.id });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
