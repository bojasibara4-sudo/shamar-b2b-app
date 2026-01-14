import { NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhook } from '@/services/webhook.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      );
    }

    // En production, valider la signature avec le secret Stripe
    // const secret = process.env.STRIPE_WEBHOOK_SECRET;
    // if (!validateStripeWebhookSignature(body, signature, secret)) {
    //   return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
    // }

    const event = JSON.parse(body);

    // Traiter le webhook
    await handleStripeWebhook(event.type, event.data.object);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook' },
      { status: 500 }
    );
  }
}
