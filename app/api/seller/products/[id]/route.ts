import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { productsDB } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const product = productsDB.getById(params.id);

  if (!product) {
    return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
  }

  if (product.sellerId !== user.id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, description, price } = body;

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

    const updated = productsDB.update(params.id, {
      name,
      description,
      price,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: updated });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const product = productsDB.getById(params.id);

  if (!product) {
    return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 });
  }

  if (product.sellerId !== user.id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const deleted = productsDB.delete(params.id);
  if (!deleted) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

