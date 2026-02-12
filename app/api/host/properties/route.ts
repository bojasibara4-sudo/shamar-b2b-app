import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createHostProperty, getHostProperties } from '@/services/host.service';

export const dynamic = 'force-dynamic';

/**
 * GET - Liste des propriétés (catalogue public)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') ?? undefined;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const filters = {
      city,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };
    const properties = await getHostProperties(filters);
    return NextResponse.json({ properties });
  } catch (error) {
    console.error('GET /api/host/properties:', error);
    return NextResponse.json({ error: 'Erreur', properties: [] }, { status: 500 });
  }
}

/**
 * POST - Créer une propriété Host (logement)
 */
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, city, price_per_night, capacity, type, amenities, rules, images } = body;

    if (!title || !city || price_per_night == null) {
      return NextResponse.json(
        { error: 'Titre, ville et prix sont requis' },
        { status: 400 }
      );
    }

    const price = Number(price_per_night);
    if (isNaN(price) || price <= 0) {
      return NextResponse.json({ error: 'Prix invalide' }, { status: 400 });
    }

    const amenitiesList = Array.isArray(amenities)
      ? amenities
      : typeof amenities === 'string'
        ? amenities.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

    const property = await createHostProperty(user.id, {
      title: String(title).trim(),
      description: description?.trim() ?? '',
      city: String(city).trim(),
      price_per_night: price,
      currency: 'FCFA',
      capacity: Math.max(1, Number(capacity) || 1),
      type: type?.trim() ?? 'Logement',
      amenities: amenitiesList,
      rules: rules?.trim() ?? undefined,
      images: Array.isArray(images) ? images : [],
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du logement' },
        { status: 500 }
      );
    }

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    console.error('POST /api/host/properties:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}
