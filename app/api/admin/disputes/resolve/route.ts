import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { resolveDispute } from '@/services/dispute.service';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { dispute_id, status, resolution_note } = body;

    if (!dispute_id || !status || !resolution_note) {
      return NextResponse.json(
        { error: 'dispute_id, status et resolution_note sont requis' },
        { status: 400 }
      );
    }

    if (!['resolved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status invalide. Utiliser "resolved" ou "rejected"' },
        { status: 400 }
      );
    }

    const success = await resolveDispute(
      dispute_id,
      user.id,
      status as 'resolved' | 'rejected',
      resolution_note
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la résolution du litige' },
        { status: 500 }
      );
    }

    // Récupérer le litige mis à jour
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ success: true });
    }

    const { data: dispute } = await supabase
      .from('disputes')
      .select('*')
      .eq('id', dispute_id)
      .single();

    return NextResponse.json({ dispute });
  } catch (error) {
    console.error('Error in PUT /api/admin/disputes/resolve:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la résolution du litige' },
      { status: 500 }
    );
  }
}
