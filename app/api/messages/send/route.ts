import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'buyer' && user.role !== 'seller') {
    return NextResponse.json(
      { error: 'Accès refusé. Seuls les acheteurs et vendeurs peuvent envoyer des messages.' },
      { status: 403 }
    );
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Configuration Supabase manquante' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { order_id, content } = body;

    if (!order_id || !content) {
      return NextResponse.json(
        { error: 'order_id et content sont requis' },
        { status: 400 }
      );
    }

    if (typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le contenu du message ne peut pas être vide' },
        { status: 400 }
      );
    }

    // Vérifier que la commande existe et que l'utilisateur a accès
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, buyer_id, seller_id')
      .eq('id', order_id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est le buyer ou le seller de la commande
    if (order.buyer_id !== user.id && order.seller_id !== user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à envoyer un message pour cette commande' },
        { status: 403 }
      );
    }

    // Déterminer le destinataire
    const recipient_id = order.buyer_id === user.id ? order.seller_id : order.buyer_id;

    // Créer le message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id,
        order_id,
        content: content.trim(),
        is_read: false,
      })
      .select()
      .single();

    if (messageError || !message) {
      console.error('Error creating message:', messageError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/messages/send:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message' },
      { status: 500 }
    );
  }
}
