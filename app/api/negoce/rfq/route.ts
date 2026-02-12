import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  try {
    const body = await request.json();
    const { offer_id, quantity, port_destination, incoterm, specs, message } = body;
    if (!offer_id || quantity == null) return NextResponse.json({ error: 'offer_id et quantity requis' }, { status: 400 });

    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('negoce_rfqs')
      .insert({ offer_id, buyer_id: user.id, quantity: Number(quantity), port_destination: port_destination || null, incoterm: incoterm || 'FOB', specs: specs || null, message: message || null, status: 'pending' })
      .select('id')
      .single();

    if (error) return NextResponse.json({ error: 'Erreur création RFQ' }, { status: 500 });
    return NextResponse.json({ rfq: data }, { status: 201 });
  } catch (e) {
    console.error('POST /api/negoce/rfq:', e);
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
