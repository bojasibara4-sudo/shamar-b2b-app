import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Initialiser Stripe seulement si la clé est définie
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
}) : null;

/**
 * POST /api/stripe/webhook
 * Webhook Stripe pour gérer les événements de paiement
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe non configuré' },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Traitement des événements
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        if (paymentIntent.metadata.order_id) {
          // Mise à jour du statut de la commande
          await (supabase as any)
            .from('orders')
            .update({
              payment_status: 'paid',
              status: 'CONFIRMED',
            })
            .eq('id', paymentIntent.metadata.order_id);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        if (failedPayment.metadata.order_id) {
          await (supabase as any)
            .from('orders')
            .update({
              payment_status: 'failed',
            })
            .eq('id', failedPayment.metadata.order_id);
        }
        break;

      case 'charge.refunded':
        const refund = event.data.object as Stripe.Charge;
        if (refund.metadata.order_id) {
          await (supabase as any)
            .from('orders')
            .update({
              payment_status: 'refunded',
            })
            .eq('id', refund.metadata.order_id);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

