import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { updateDeliveryStatus } from '@/services/delivery.service';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const supabase = await createClient();

  try {
    const body = await request.json();
    const { delivery_id, status, tracking_code, notes, carrier_name } = body;

    if (!delivery_id || !status) {
      return NextResponse.json(
        { error: 'delivery_id et status sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que la livraison appartient au vendeur (vendor_id ou seller_id) ou admin
    const { data: delivery, error: deliveryError } = await (supabase as any)
      .from('deliveries')
      .select('vendor_id, seller_id')
      .eq('id', delivery_id)
      .single();

    if (deliveryError || !delivery) {
      return NextResponse.json(
        { error: 'Livraison non trouvée' },
        { status: 404 }
      );
    }

    const deliveryData = delivery as any;
    const isOwner = deliveryData.vendor_id === user.id || deliveryData.seller_id === user.id;
    if (user.role === 'seller' && !isOwner) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à modifier cette livraison' },
        { status: 403 }
      );
    }

    if (user.role !== 'seller' && !isAdminLike(user.role)) {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    // Filtrer le statut 'disputed' car updateDeliveryStatus ne l'accepte pas
    const validStatus = status === 'disputed' ? 'pending' : (status as 'pending' | 'shipped' | 'delivered');
    const success = await updateDeliveryStatus(
      delivery_id,
      validStatus,
      tracking_code,
      notes,
      carrier_name
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la livraison' },
        { status: 500 }
      );
    }

    // Récupérer la livraison mise à jour
    const { data: updatedDelivery } = await (supabase as any)
      .from('deliveries')
      .select('*')
      .eq('id', delivery_id)
      .single();

    return NextResponse.json({ delivery: updatedDelivery });
  } catch (error) {
    console.error('Error in PUT /api/delivery/update:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la livraison' },
      { status: 500 }
    );
  }
}
