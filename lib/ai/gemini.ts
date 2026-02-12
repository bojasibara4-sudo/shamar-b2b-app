import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

let geminiClient: GoogleGenerativeAI | null = null;

if (API_KEY) {
  geminiClient = new GoogleGenerativeAI(API_KEY);
}

export interface GeminiResponse {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * Service Gemini pour SHAMAR B2B
 * Moteur recherche / analyse / intelligence données (pas conversationnel).
 * - Comparaison prix / analyse marché
 * - Multi-devises (FCFA / USD / EUR)
 * - Sourcing international
 * - Aide import-export
 */
export class GeminiService {
  private model: string = 'gemini-1.5-pro';

  /**
   * Compare les prix (analyse marché : Chine vs local)
   */
  async comparePrices(
    product: string,
    chinaPrice: number,
    localPrice: number,
    currency: 'FCFA' | 'USD' | 'EUR'
  ): Promise<GeminiResponse> {
    if (!geminiClient) {
      return {
        success: false,
        error: 'Gemini API key not configured',
      };
    }

    try {
      const model = geminiClient.getGenerativeModel({ model: this.model });
      const prompt = `Compare les prix pour "${product}" :
- Prix Chine : ${chinaPrice} ${currency}
- Prix marché local : ${localPrice} ${currency}

Analyse les avantages et inconvénients de chaque option, incluant les coûts logistiques et les délais.
Réponds en français de manière structurée.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        text,
      };
    } catch (error) {
      console.error('Gemini comparePrices error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Convertit une devise (FCFA / USD / EUR)
   */
  async convertCurrency(
    amount: number,
    from: 'FCFA' | 'USD' | 'EUR',
    to: 'FCFA' | 'USD' | 'EUR'
  ): Promise<GeminiResponse> {
    if (!geminiClient) {
      return {
        success: false,
        error: 'Gemini API key not configured',
      };
    }

    try {
      const model = geminiClient.getGenerativeModel({ model: this.model });
      const prompt = `Convertis ${amount} ${from} en ${to}. Réponds uniquement avec le montant converti et la devise, sans explication.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        text,
      };
    } catch (error) {
      console.error('Gemini currency conversion error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Aide au sourcing international
   */
  async assistSourcing(product: string, country: string): Promise<GeminiResponse> {
    if (!geminiClient) {
      return {
        success: false,
        error: 'Gemini API key not configured',
      };
    }

    try {
      const model = geminiClient.getGenerativeModel({ model: this.model });
      const prompt = `Fournis des conseils pour le sourcing international de "${product}" depuis ${country}.
Inclus des informations sur les réglementations, les coûts logistiques et les meilleures pratiques.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        text,
      };
    } catch (error) {
      console.error('Gemini sourcing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Aide import-export
   */
  async assistImportExport(
    product: string,
    origin: string,
    destination: string
  ): Promise<GeminiResponse> {
    if (!geminiClient) {
      return {
        success: false,
        error: 'Gemini API key not configured',
      };
    }

    try {
      const model = geminiClient.getGenerativeModel({ model: this.model });
      const prompt = `Fournis des conseils pour l'import-export de "${product}" de ${origin} vers ${destination}.
Inclus les documents nécessaires, les réglementations et les coûts estimés.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        text,
      };
    } catch (error) {
      console.error('Gemini import-export error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const geminiService = new GeminiService();

