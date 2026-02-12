import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    // TODO: Récupérer les leads depuis la table leads/offers quand elle sera disponible
    // Pour l'instant, retourner un tableau vide
    return NextResponse.json({ leads: [] });
  } catch (error) {
    console.error('Error fetching seller leads:', error);
    return NextResponse.json({ leads: [] });
  }
}
