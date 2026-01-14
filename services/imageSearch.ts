/**
 * Service de recherche par image pour SHAMAR B2B
 * Utilise une API de vision par ordinateur pour analyser les images
 * et proposer des produits similaires
 */

const IMAGE_SEARCH_API_KEY = process.env.IMAGE_SEARCH_API_KEY || '';
const IMAGE_SEARCH_API_URL = process.env.IMAGE_SEARCH_API_URL || 'https://api.clarifai.com/v2/models/general-image-recognition/outputs';

export interface ImageAnalysisResult {
  success: boolean;
  tags?: string[];
  categories?: string[];
  description?: string;
  error?: string;
}

export interface SimilarProduct {
  id: string;
  name: string;
  similarity: number;
  image_url?: string;
}

/**
 * Service de recherche par image
 * Supporte plusieurs providers (Clarifai, Google Vision, etc.)
 */
export class ImageSearchService {
  /**
   * Analyse une image et extrait des tags/catégories
   */
  async analyzeImage(imageFile: File | Blob): Promise<ImageAnalysisResult> {
    if (!IMAGE_SEARCH_API_KEY) {
      return {
        success: false,
        error: 'IMAGE_SEARCH_API_KEY non configurée',
      };
    }

    try {
      // Conversion de l'image en base64
      const base64Image = await this.fileToBase64(imageFile);

      // Appel à l'API Clarifai (exemple)
      const response = await fetch(IMAGE_SEARCH_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${IMAGE_SEARCH_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  base64: base64Image,
                },
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const concepts = data.outputs?.[0]?.data?.concepts || [];

      // Extraction des tags et catégories
      const tags = concepts
        .filter((c: { value: number }) => c.value > 0.5)
        .map((c: { name: string }) => c.name);

      const categories = this.categorizeTags(tags);
      const description = this.generateDescription(tags);

      return {
        success: true,
        tags,
        categories,
        description,
      };
    } catch (error) {
      console.error('Image analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Recherche des produits similaires basés sur les tags d'image
   */
  async findSimilarProducts(
    tags: string[],
    limit: number = 10
  ): Promise<SimilarProduct[]> {
    try {
      // Appel à l'API des produits pour rechercher par tags
      const response = await fetch(
        `/api/products/search?tags=${tags.join(',')}&limit=${limit}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Similar products search error:', error);
      return [];
    }
  }

  /**
   * Convertit un fichier en base64
   */
  private async fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Supprime le préfixe data:image/...;base64,
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Catégorise les tags en catégories de produits
   */
  private categorizeTags(tags: string[]): string[] {
    const categories: string[] = [];
    const tagLower = tags.map((t) => t.toLowerCase());

    // Mapping des tags vers catégories
    const categoryMap: Record<string, string> = {
      food: 'Alimentation',
      clothing: 'Textile',
      electronics: 'Électronique',
      furniture: 'Mobilier',
      vehicle: 'Véhicule',
      building: 'Construction',
      tool: 'Outillage',
      container: 'Emballage',
    };

    for (const [key, category] of Object.entries(categoryMap)) {
      if (tagLower.some((t) => t.includes(key))) {
        categories.push(category);
      }
    }

    return categories.length > 0 ? categories : ['Autre'];
  }

  /**
   * Génère une description basée sur les tags
   */
  private generateDescription(tags: string[]): string {
    if (tags.length === 0) return 'Aucune description disponible';

    const topTags = tags.slice(0, 5).join(', ');
    return `Produit identifié : ${topTags}`;
  }

  /**
   * Vérifie si le service est configuré
   */
  isConfigured(): boolean {
    return !!IMAGE_SEARCH_API_KEY;
  }
}

export const imageSearchService = new ImageSearchService();

