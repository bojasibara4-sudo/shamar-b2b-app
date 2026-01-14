import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { usersDB } from '@/lib/mock-data';

export async function GET() {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const users = usersDB.getAll();
  return NextResponse.json({ users });
}

export async function DELETE(request: NextRequest) {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID requis' }, { status: 400 });
  }

  const deleted = usersDB.delete(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

