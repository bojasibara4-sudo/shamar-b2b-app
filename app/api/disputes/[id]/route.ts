import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: dispute, error } = await (supabase as any)
      .from('disputes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !dispute) {
      return NextResponse.json({ error: 'Litige non trouvé' }, { status: 404 });
    }

    // Vérifier que l'utilisateur a accès (buyer ou seller impliqué)
    if (dispute.raised_by !== user.id && dispute.against_user !== user.id) {
      const { data: { user: authUser } } = await (supabase as any).auth.getUser();
      // Admin peut voir tous les litiges - vérifier le rôle
      const { data: profile } = await (supabase as any)
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      if (!isAdminLike(profile?.role ?? '')) {
        return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
      }
    }

    return NextResponse.json(dispute);
  } catch (error) {
    console.error('Error fetching dispute:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
