import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import {
  getAgentById,
  updateAgent,
  deleteAgent,
  type AgentUpdate,
} from '@/services/agent.service';

export const dynamic = 'force-dynamic';

/**
 * PUT /api/admin/agents/[id] — Modifier un agent (admin)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  if (!isAdminLike(user.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'id requis' }, { status: 400 });
  }

  const existing = await getAgentById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Agent non trouvé' }, { status: 404 });
  }

  let body: AgentUpdate;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON invalide' }, { status: 400 });
  }

  const result = await updateAgent(id, {
    department: body.department,
    phone: body.phone ?? undefined,
    address: body.address ?? undefined,
    notes: body.notes ?? undefined,
    photo_url: body.photo_url ?? undefined,
  });
  if (!result.success) {
    return NextResponse.json(
      { error: result.error || 'Erreur mise à jour' },
      { status: 500 }
    );
  }
  const updated = await getAgentById(id);
  return NextResponse.json({ agent: updated });
}

/**
 * DELETE /api/admin/agents/[id] — Supprimer un agent (admin)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  if (!isAdminLike(user.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'id requis' }, { status: 400 });
  }

  const existing = await getAgentById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Agent non trouvé' }, { status: 404 });
  }

  const result = await deleteAgent(id);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error || 'Erreur suppression' },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true });
}
