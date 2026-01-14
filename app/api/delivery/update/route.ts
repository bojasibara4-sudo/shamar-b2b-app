import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateDeliveryStatus } from '@/services/delivery.service';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Configuration Supabase manquante' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { delivery_id, status, tracking_code, notes } = body;

    if (!delivery_id || !status) {
      return NextResponse.json(
        { error: 'delivery_id et status sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que la livraison appartient au vendeur (si seller) ou admin
    const { data: delivery, error: deliveryError } = await supabase
      .from('deliveries')
      .select('vendor_id')
      .eq('id', delivery_id)
      .single();

    if (deliveryError || !delivery) {
      return NextResponse.json(
        { error: 'Livraison non trouvée' },
        { status: 404 }
      );
    }

    if (user.role === 'seller' && delivery.vendor_id !== user.id) {
      return NextResponse.json(
        { error: 'Vous n\'êtes pas autorisé à modifier cette livraison' },
        { status: 403 }
      );
    }

    if (user.role !== 'seller' && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const success = await updateDeliveryStatus(
      delivery_id,
      status as 'pending' | 'shipped' | 'delivered' | 'disputed',
      tracking_code,
      notes
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la livraison' },
        { status: 500 }
      );
    }

    // Récupérer la livraison mise à jour
    const { data: updatedDelivery } = await supabase
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
