import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { productsDB } from '@/lib/mock-data';

export async function GET() {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'buyer') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const products = productsDB.getAll();
  return NextResponse.json({ products });
}

