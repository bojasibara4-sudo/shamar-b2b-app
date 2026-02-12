import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { createClient } from '@/lib/supabase/server';
import { getDisputeMessages, addDisputeMessage, getDisputeById } from '@/services/dispute.service';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

  const dispute = await getDisputeById(id);
  if (!dispute) return NextResponse.json({ error: 'Litige non trouvé' }, { status: 404 });
  if (dispute.raised_by !== user.id && dispute.against_user !== user.id && !isAdminLike(user.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const messages = await getDisputeMessages(id);
  const supabase = await createClient();
  const userIds = [...new Set(messages.map((m) => m.sender_id))];
  const { data: users } = userIds.length
    ? await (supabase as any).from('users').select('id, full_name, email').in('id', userIds)
    : { data: [] };
  const userMap = (users || []).reduce((acc: Record<string, { full_name?: string; email?: string }>, u: any) => {
    acc[u.id] = { full_name: u.full_name, email: u.email };
    return acc;
  }, {});

  return NextResponse.json({
    messages: messages.map((m) => ({ ...m, content: m.content, sender: userMap[m.sender_id] })),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });

  const dispute = await getDisputeById(id);
  if (!dispute) return NextResponse.json({ error: 'Litige non trouvé' }, { status: 404 });
  if (dispute.raised_by !== user.id && dispute.against_user !== user.id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }
  if (dispute.status !== 'open') return NextResponse.json({ error: 'Litige fermé' }, { status: 400 });

  let body: { message?: string; attachments?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body invalide' }, { status: 400 });
  }
  if (!body.message || !String(body.message).trim()) {
    return NextResponse.json({ error: 'message requis' }, { status: 400 });
  }

  const ok = await addDisputeMessage(id, user.id, String(body.message).trim());
  if (!ok) return NextResponse.json({ error: 'Erreur envoi' }, { status: 500 });
  const messages = await getDisputeMessages(id);
  return NextResponse.json({ messages }, { status: 201 });
}
