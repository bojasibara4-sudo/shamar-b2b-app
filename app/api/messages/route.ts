import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/messages
 * Récupère les messages de l'utilisateur
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('shamar_user');
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = JSON.parse(Buffer.from(userCookie.value, 'base64').toString());
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');
    const offerId = searchParams.get('offer_id');
    const conversationWith = searchParams.get('conversation_with');

    let query = (supabase as any)
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, email, full_name, company_name),
        recipient:users!messages_recipient_id_fkey(id, email, full_name, company_name)
      `)
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

    if (orderId) {
      query = query.eq('order_id', orderId);
    }

    if (offerId) {
      query = query.eq('offer_id', offerId);
    }

    if (conversationWith) {
      query = query.or(`sender_id.eq.${conversationWith},recipient_id.eq.${conversationWith}`);
    }

    query = query.order('created_at', { ascending: true });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des messages' },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: data || [] });
  } catch (error) {
    console.error('GET /api/messages error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages
 * Crée un nouveau message
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('shamar_user');
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = JSON.parse(Buffer.from(userCookie.value, 'base64').toString());
    const body = await request.json();
    const { recipient_id, content, order_id, offer_id } = body;

    if (!recipient_id || !content) {
      return NextResponse.json(
        { error: 'recipient_id et content sont requis' },
        { status: 400 }
      );
    }

    const { data: message, error: messageError } = await (supabase as any)
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id,
        content,
        order_id: order_id || null,
        offer_id: offer_id || null,
        is_read: false,
      })
      .select(`
        *,
        sender:users!messages_sender_id_fkey(id, email, full_name, company_name),
        recipient:users!messages_recipient_id_fkey(id, email, full_name, company_name)
      `)
      .single();

    if (messageError) {
      console.error('Supabase error:', messageError);
      return NextResponse.json(
        { error: 'Erreur lors de la création du message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

