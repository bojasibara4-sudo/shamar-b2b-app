import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * POST /api/payments/mobile-money
 * Initie un paiement via Mobile Money (MTN ou Airtel)
 * 
 * NOTE: Cette route est un exemple. Dans un environnement de production,
 * vous devrez intégrer avec les APIs réelles de MTN Mobile Money et Airtel Money.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('shamar_user');
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = JSON.parse(Buffer.from(userCookie.value, 'base64').toString());
    const body = await request.json();
    const { provider, phone, amount, currency, orderId } = body;

    if (!provider || !phone || !amount || !orderId) {
      return NextResponse.json(
        { error: 'provider, phone, amount et orderId sont requis' },
        { status: 400 }
      );
    }

    if (provider !== 'mtn' && provider !== 'airtel') {
      return NextResponse.json(
        { error: 'Provider doit être "mtn" ou "airtel"' },
        { status: 400 }
      );
    }

    // Génération d'un ID de transaction simulé
    // Dans un environnement réel, vous appelleriez l'API du provider
    const transactionId = `${provider.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Mise à jour de la commande dans Supabase
    const supabase = createSupabaseServerClient();
    if (supabase) {
      await supabase
        .from('orders')
        .update({
          payment_method: `${provider}_mobile_money`,
          payment_status: 'pending',
        })
        .eq('id', orderId);
    }

    // Dans un environnement réel, vous devriez :
    // 1. Appeler l'API du provider (MTN/Airtel)
    // 2. Attendre la confirmation du paiement
    // 3. Mettre à jour le statut de la commande via webhook

    return NextResponse.json({
      success: true,
      transactionId,
      message: `Paiement ${provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'} initié. Veuillez confirmer sur votre téléphone.`,
    });
  } catch (error) {
    console.error('POST /api/payments/mobile-money error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

