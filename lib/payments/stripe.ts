import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export interface PaymentIntentData {
  amount: number;
  currency: 'usd' | 'eur' | 'xof'; // XOF pour FCFA
  orderId: string;
  buyerId: string;
  metadata?: Record<string, string>;
}

export interface PaymentMethodData {
  type: 'card' | 'mobile_money';
  card?: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  mobile_money?: {
    provider: 'mtn' | 'airtel';
    phone: string;
  };
}

/**
 * Service Stripe pour les paiements internationaux
 * Supporte : Visa, Mastercard, Amex, et méthodes de paiement africaines
 */
export class StripeService {
  private stripe: Stripe | null = null;

  constructor() {
    if (STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover',
      });
    } else {
      console.warn('STRIPE_SECRET_KEY non configurée. Les paiements Stripe seront désactivés.');
    }
  }

  /**
   * Crée un PaymentIntent pour une commande
   */
  async createPaymentIntent(data: PaymentIntentData): Promise<{
    success: boolean;
    clientSecret?: string;
    paymentIntentId?: string;
    error?: string;
  }> {
    if (!this.stripe) {
      return {
        success: false,
        error: 'Stripe non configuré',
      };
    }

    try {
      // Conversion FCFA en centimes (Stripe utilise les centimes)
      const amountInCents = this.convertToStripeAmount(data.amount, data.currency);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: data.currency === 'xof' ? 'xof' : data.currency,
        metadata: {
          order_id: data.orderId,
          buyer_id: data.buyerId,
          ...data.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret || undefined,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Stripe payment intent creation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Confirme un paiement
   */
  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<{
    success: boolean;
    paymentIntent?: Stripe.PaymentIntent;
    error?: string;
  }> {
    if (!this.stripe) {
      return {
        success: false,
        error: 'Stripe non configuré',
      };
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
        }
      );

      return {
        success: paymentIntent.status === 'succeeded',
        paymentIntent,
      };
    } catch (error) {
      console.error('Stripe payment confirmation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Rembourse un paiement
   */
  async refundPayment(
    paymentIntentId: string,
    amount?: number
  ): Promise<{
    success: boolean;
    refund?: Stripe.Refund;
    error?: string;
  }> {
    if (!this.stripe) {
      return {
        success: false,
        error: 'Stripe non configuré',
      };
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? this.convertToStripeAmount(amount, 'usd') : undefined,
      });

      return {
        success: true,
        refund,
      };
    } catch (error) {
      console.error('Stripe refund error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Convertit un montant en centimes pour Stripe
   */
  private convertToStripeAmount(amount: number, currency: string): number {
    // Stripe utilise les centimes pour USD/EUR, mais XOF est en unités entières
    if (currency === 'xof') {
      return Math.round(amount);
    }
    return Math.round(amount * 100);
  }

  /**
   * Vérifie si Stripe est configuré
   */
  isConfigured(): boolean {
    return !!this.stripe && !!STRIPE_PUBLISHABLE_KEY;
  }

  /**
   * Retourne la clé publique Stripe
   */
  getPublishableKey(): string {
    return STRIPE_PUBLISHABLE_KEY;
  }
}

export const stripeService = new StripeService();

