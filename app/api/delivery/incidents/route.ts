/**
 * POST /api/delivery/incidents — Signaler un incident (retard, perdu, endommagé, mauvais article)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getDeliveryById } from '@/services/delivery.service';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const TYPES = ['delay', 'lost', 'damaged', 'wrong_item', 'other'] as const;

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    const body = await request.json();
    const { delivery_id, type, description, photo_urls } = body;
    if (!delivery_id || !type || !TYPES.includes(type)) {
      return NextResponse.json({ error: 'delivery_id et type (delay|lost|damaged|wrong_item|other) requis' }, { status: 400 });
    }

    const delivery = await getDeliveryById(delivery_id);
    if (!delivery) return NextResponse.json({ error: 'Livraison introuvable' }, { status: 404 });
    if (delivery.buyer_id !== user.id && delivery.seller_id !== user.id && delivery.vendor_id !== user.id) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const supabase = await createClient();
    const { data: incident, error } = await (supabase as any)
      .from('delivery_incidents')
      .insert({
        delivery_id,
        reported_by: user.id,
        type,
        description: description || null,
        photo_urls: Array.isArray(photo_urls) ? photo_urls : [],
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating incident:', error);
      return NextResponse.json({ error: 'Erreur création ticket' }, { status: 500 });
    }
    return NextResponse.json({ incident }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/delivery/incidents:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
