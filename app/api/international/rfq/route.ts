import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createInternationalRFQ } from '@/services/international.service';

export const dynamic = 'force-dynamic';

/** POST - Créer une RFQ */
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { offer_id, quantity, port_destination, incoterm, specs, message } = body;

    if (!offer_id || quantity == null) {
      return NextResponse.json(
        { error: 'offer_id et quantity requis' },
        { status: 400 }
      );
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty <= 0) {
      return NextResponse.json({ error: 'Quantité invalide' }, { status: 400 });
    }

    const result = await createInternationalRFQ(offer_id, user.id, {
      quantity: qty,
      port_destination: port_destination?.trim() || undefined,
      incoterm: incoterm || 'FOB',
      specs: specs?.trim() || undefined,
      message: message?.trim() || undefined,
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Erreur lors de la création de la RFQ' },
        { status: 500 }
      );
    }

    return NextResponse.json({ rfq: result }, { status: 201 });
  } catch (error) {
    console.error('POST /api/international/rfq:', error);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
