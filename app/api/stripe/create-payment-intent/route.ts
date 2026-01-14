import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/payments/stripe';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * POST /api/stripe/create-payment-intent
 * Crée un PaymentIntent Stripe pour une commande
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
    const { amount, currency, orderId, metadata } = body;

    if (!amount || !currency || !orderId) {
      return NextResponse.json(
        { error: 'amount, currency et orderId sont requis' },
        { status: 400 }
      );
    }

    const result = await stripeService.createPaymentIntent({
      amount: parseFloat(amount),
      currency: currency === 'FCFA' ? 'xof' : currency.toLowerCase(),
      orderId,
      buyerId: user.id,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors de la création du paiement' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    });
  } catch (error) {
    console.error('POST /api/stripe/create-payment-intent error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

