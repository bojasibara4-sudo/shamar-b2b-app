import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

/**
 * PUT /api/messages/[id]/read
 * Marque un message comme lu
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non configuré' },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('shamar_user');
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = JSON.parse(Buffer.from(userCookie.value, 'base64').toString());

    // Vérification que l'utilisateur est le destinataire
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('recipient_id')
      .eq('id', params.id)
      .single();

    if (fetchError || !message) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }

    if (message.recipient_id !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: data });
  } catch (error) {
    console.error('PUT /api/messages/[id]/read error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

