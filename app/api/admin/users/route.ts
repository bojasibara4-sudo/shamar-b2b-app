import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUsersForAdmin, deleteUserById } from '@/services/user.service';
import { isAdminLike } from '@/lib/owner-roles';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (!isAdminLike(user.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const users = await getUsersForAdmin();
  return NextResponse.json({ users });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (!isAdminLike(user.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const result = await deleteUserById(id);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error || 'Utilisateur non trouvé' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
