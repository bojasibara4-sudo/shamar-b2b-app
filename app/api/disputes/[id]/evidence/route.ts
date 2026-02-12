import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { getDisputeById, getDisputeEvidence, addDisputeEvidence } from '@/services/dispute.service';

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

  const evidence = await getDisputeEvidence(id);
  return NextResponse.json({ evidence });
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

  let body: { file_url?: string; file_name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body invalide' }, { status: 400 });
  }
  if (!body.file_url) return NextResponse.json({ error: 'file_url requis' }, { status: 400 });

  const ok = await addDisputeEvidence(id, user.id, body.file_url, body.file_name ?? undefined);
  if (!ok) return NextResponse.json({ error: 'Erreur ajout preuve' }, { status: 500 });
  const evidence = await getDisputeEvidence(id);
  return NextResponse.json({ evidence }, { status: 201 });
}
