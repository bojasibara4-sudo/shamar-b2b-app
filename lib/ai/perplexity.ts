/**
 * Service Perplexity AI pour SHAMAR B2B
 * Assistant conversationnel pour négociation B2B
 */

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY || process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

export interface PerplexityResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface NegotiationContext {
  commodity: string;
  quantity: number;
  unit: string;
  proposedPrice: number;
  currency: 'FCFA' | 'USD' | 'EUR';
  originCountry?: string;
  destinationCountry?: string;
  deliveryDeadline?: string;
}

/**
 * Service Perplexity AI pour assistance négociation
 */
export class PerplexityService {
  /**
   * Génère des arguments de négociation
   */
  async generateNegotiationArguments(context: NegotiationContext): Promise<PerplexityResponse> {
    if (!PERPLEXITY_API_KEY) {
      return {
        success: false,
        error: 'Perplexity API key not configured',
      };
    }

    try {
      const prompt = `Tu es un expert en négociation B2B pour la plateforme SHAMAR.
Contexte de négociation :
- Produit : ${context.commodity}
- Quantité : ${context.quantity} ${context.unit}
- Prix proposé : ${context.proposedPrice} ${context.currency}
${context.originCountry ? `- Pays d'origine : ${context.originCountry}` : ''}
${context.destinationCountry ? `- Pays de destination : ${context.destinationCountry}` : ''}
${context.deliveryDeadline ? `- Délai de livraison : ${context.deliveryDeadline}` : ''}

Génère 3-5 arguments de négociation professionnels et persuasifs pour convaincre le fournisseur/acheteur.
Réponds en français, de manière concise et professionnelle.`;

      const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Tu es un assistant expert en négociation B2B pour la plateforme SHAMAR.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content || 'Réponse non disponible';

      return {
        success: true,
        message,
      };
    } catch (error) {
      console.error('Perplexity error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Analyse comparée prix Chine / marché local
   */
  async comparePrices(
    product: string,
    chinaPrice: number,
    localPrice: number,
    currency: 'FCFA' | 'USD' | 'EUR'
  ): Promise<PerplexityResponse> {
    if (!PERPLEXITY_API_KEY) {
      return {
        success: false,
        error: 'Perplexity API key not configured',
      };
    }

    try {
      const prompt = `Compare les prix pour "${product}" :
- Prix Chine : ${chinaPrice} ${currency}
- Prix marché local : ${localPrice} ${currency}

Analyse les avantages et inconvénients de chaque option, incluant les coûts logistiques et les délais.
Réponds en français de manière structurée.`;

      const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content || 'Réponse non disponible';

      return {
        success: true,
        message,
      };
    } catch (error) {
      console.error('Perplexity price comparison error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Génère des réponses aux objections clients
   */
  async generateObjectionResponses(objection: string, context: string): Promise<PerplexityResponse> {
    if (!PERPLEXITY_API_KEY) {
      return {
        success: false,
        error: 'Perplexity API key not configured',
      };
    }

    try {
      const prompt = `Objection client : "${objection}"
Contexte : ${context}

Génère 3 réponses professionnelles et persuasives pour répondre à cette objection.
Réponds en français, de manière concise.`;

      const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content || 'Réponse non disponible';

      return {
        success: true,
        message,
      };
    } catch (error) {
      console.error('Perplexity objection response error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Rédige des messages persuasifs pour fournisseurs
   */
  async generatePersuasiveMessage(
    recipient: 'supplier' | 'buyer',
    product: string,
    context: string
  ): Promise<PerplexityResponse> {
    if (!PERPLEXITY_API_KEY) {
      return {
        success: false,
        error: 'Perplexity API key not configured',
      };
    }

    try {
      const prompt = `Rédige un message professionnel et persuasif pour un ${recipient === 'supplier' ? 'fournisseur' : 'acheteur'} concernant "${product}".
Contexte : ${context}

Le message doit être courtois, professionnel et mettre en avant les avantages mutuels.
Réponds en français.`;

      const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 400,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content || 'Réponse non disponible';

      return {
        success: true,
        message,
      };
    } catch (error) {
      console.error('Perplexity message generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const perplexityService = new PerplexityService();

