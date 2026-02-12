import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const supabase = await createClient();

  try {
    // Vérifier que le produit appartient au seller
    const { data: existingProduct, error: checkError } = await (supabase as any)
      .from('products')
      .select('seller_id')
      .eq('id', id)
      .single();

    if (checkError || !existingProduct) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
    }

    if (existingProduct.seller_id !== user.id) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, category, currency, image_url, status, specifications, price_tiers, min_order_quantity } = body;

    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Le prix doit être un nombre positif' },
        { status: 400 }
      );
    }

    const { data: product, error: updateError } = await (supabase as any)
      .from('products')
      .update({
        name,
        description,
        price: Number(price),
        category: category || existingProduct.category || 'other',
        currency: currency || existingProduct.currency || 'FCFA',
        image_url: image_url ?? existingProduct.image_url ?? null,
        status: status || existingProduct.status || 'active',
        updated_at: new Date().toISOString(),
        ...(specifications !== undefined && (specifications === null || typeof specifications === 'object') && { specifications: specifications || {} }),
        ...(price_tiers !== undefined && Array.isArray(price_tiers) && { price_tiers }),
        ...(typeof min_order_quantity === 'number' && min_order_quantity >= 1 && { min_order_quantity }),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du produit' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/seller/products/[id]:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
