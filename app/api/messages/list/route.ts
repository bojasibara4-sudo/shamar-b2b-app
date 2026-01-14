import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'buyer' && user.role !== 'seller') {
    return NextResponse.json(
      { error: 'Accès refusé' },
      { status: 403 }
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Configuration Supabase manquante' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get('order_id');

    if (order_id) {
      // Récupérer les messages d'une commande spécifique
      // Vérifier d'abord que l'utilisateur a accès à la commande
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

      // Vérifier que l'utilisateur est le buyer ou le seller
      if (order.buyer_id !== user.id && order.seller_id !== user.id) {
        return NextResponse.json(
          { error: 'Vous n\'êtes pas autorisé à voir les messages de cette commande' },
          { status: 403 }
        );
      }

      // Récupérer les messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, email, full_name, company_name, role),
          recipient:users!messages_recipient_id_fkey(id, email, full_name, company_name, role)
        `)
        .eq('order_id', order_id)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return NextResponse.json(
          { error: 'Erreur lors de la récupération des messages' },
          { status: 500 }
        );
      }

      // Marquer les messages reçus comme lus
      if (messages && messages.length > 0) {
        const unreadMessageIds = messages
          .filter((m: any) => m.recipient_id === user.id && !m.is_read)
          .map((m: any) => m.id);

        if (unreadMessageIds.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadMessageIds);
        }
      }

      return NextResponse.json({ messages: messages || [] });
    } else {
      // Récupérer toutes les conversations de l'utilisateur (groupées par commande)
      // Récupérer les commandes où l'utilisateur est buyer ou seller
      const { data: userOrders, error: ordersError } = await supabase
        .from('orders')
        .select('id, buyer_id, seller_id, created_at')
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (ordersError || !userOrders || userOrders.length === 0) {
        return NextResponse.json({ conversations: [] });
      }

      const orderIds = userOrders.map(o => o.id);

      // Récupérer les messages pour ces commandes
      const { data: allMessages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(id, email, full_name, company_name),
          recipient:users!messages_recipient_id_fkey(id, email, full_name, company_name),
          order:orders!inner(id, buyer_id, seller_id)
        `)
        .in('order_id', orderIds)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return NextResponse.json(
          { error: 'Erreur lors de la récupération des conversations' },
          { status: 500 }
        );
      }

      // Grouper les messages par commande
      const conversationsMap = new Map<string, any>();
      
      if (allMessages) {
        allMessages.forEach((msg: any) => {
          const orderId = msg.order_id;
          if (!conversationsMap.has(orderId)) {
            const order = userOrders.find(o => o.id === orderId);
            const otherUserId = order?.buyer_id === user.id ? order?.seller_id : order?.buyer_id;
            
            conversationsMap.set(orderId, {
              order_id: orderId,
              other_user: msg.sender?.id === otherUserId ? msg.sender : msg.recipient?.id === otherUserId ? msg.recipient : null,
              last_message: msg,
              unread_count: 0,
              messages: [],
            });
          }
          
          const conversation = conversationsMap.get(orderId)!;
          conversation.messages.push(msg);
          if (msg.recipient_id === user.id && !msg.is_read) {
            conversation.unread_count++;
          }
        });
      }

      // Trier les conversations par date du dernier message
      const conversations = Array.from(conversationsMap.values())
        .sort((a, b) => 
          new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime()
        );

      return NextResponse.json({ conversations });
    }
  } catch (error) {
    console.error('Error in GET /api/messages/list:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des messages' },
      { status: 500 }
    );
  }
}
