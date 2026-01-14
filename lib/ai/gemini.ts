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
 * Service Gemini 3 Pro pour SHAMAR B2B
 * Fonctionnalités :
 * - Multi-devises (FCFA / USD / EUR)
 * - Traduction instantanée FR/EN
 * - Descriptions fiches produits
 * - Sourcing international
 * - Aide import-export
 */
export class GeminiService {
  private model: string = 'gemini-1.5-pro';

  /**
   * Génère une description de produit
   */
  async generateProductDescription(productName: string, category: string): Promise<GeminiResponse> {
    if (!geminiClient) {
      return {
        success: false,
        error: 'Gemini API key not configured',
      };
    }

    try {
      const model = geminiClient.getGenerativeModel({ model: this.model });
      const prompt = `Génère une description professionnelle en français pour un produit B2B :
Nom: ${productName}
Catégorie: ${category}

La description doit être concise (2-3 phrases), professionnelle et mettre en avant les avantages pour les acheteurs B2B.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        text,
      };
    } catch (error) {
      console.error('Gemini error:', error);
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
   * Traduit un texte (FR ↔ EN)
   */
  async translate(inputText: string, from: 'fr' | 'en', to: 'fr' | 'en'): Promise<GeminiResponse> {
    if (!geminiClient) {
      return {
        success: false,
        error: 'Gemini API key not configured',
      };
    }

    try {
      const model = geminiClient.getGenerativeModel({ model: this.model });
      const prompt = `Traduis ce texte de ${from} vers ${to}:
"${inputText}"

Réponds uniquement avec la traduction, sans explication.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translatedText = response.text();

      return {
        success: true,
        text: translatedText,
      };
    } catch (error) {
      console.error('Gemini translation error:', error);
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

