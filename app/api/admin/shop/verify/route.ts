import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { createClient } from '@/lib/supabase/server';
import { getVendorByUserId } from '@/services/vendor.service';
import { updateVendorStatusAuto } from '@/services/vendorStatus.service';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (!isAdminLike(user.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const supabase = await createClient();

  try {
    const body = await request.json();
    const { shopId, action } = body; // action: 'verify' | 'reject' | 'suspend'

    if (!shopId || !action) {
      return NextResponse.json(
        { error: 'shopId et action sont requis' },
        { status: 400 }
      );
    }

    // Récupérer la boutique
    const { data: shop, error: shopError } = await supabase
      .from('shops')
      .select('*')
      .eq('id', shopId)
      .single();

    if (shopError || !shop) {
      return NextResponse.json(
        { error: 'Boutique non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour selon l'action
    const updateData: any = { updated_at: new Date().toISOString() };

    if (action === 'verify') {
      updateData.status = 'verified';
      updateData.is_verified = true;
    } else if (action === 'reject') {
      updateData.status = 'draft';
      updateData.is_verified = false;
    } else if (action === 'suspend') {
      updateData.status = 'suspended';
      updateData.is_verified = false;
    } else {
      return NextResponse.json(
        { error: 'Action invalide' },
        { status: 400 }
      );
    }

    const { data: updatedShop, error: updateError } = await (supabase as any)
      .from('shops')
      .update(updateData)
      .eq('id', shopId)
      .select()
      .single();

    if (updateError || !updatedShop) {
      console.error('Error updating shop:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de la boutique' },
        { status: 500 }
      );
    }

    // Mettre à jour automatiquement le statut du vendor
    const shopWithVendorId = shop as any;
    if (shopWithVendorId.vendor_id) {
      const { data: vendor } = await (supabase as any)
        .from('vendors')
        .select('user_id')
        .eq('id', shopWithVendorId.vendor_id)
        .single();
      
      if (vendor) {
        await updateVendorStatusAuto(vendor.user_id);
      }
    }

    return NextResponse.json({ shop: updatedShop });
  } catch (error) {
    console.error('Error in PUT /api/admin/shop/verify:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la validation de la boutique' },
      { status: 500 }
    );
  }
}
