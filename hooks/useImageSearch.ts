'use client';

import { useState } from 'react';

interface ImageAnalysisResult {
  success: boolean;
  tags?: string[];
  categories?: string[];
  description?: string;
  error?: string;
}

export function useImageSearch() {
  const [loading, setLoading] = useState(false);

  const analyzeImage = async (imageFile: File): Promise<ImageAnalysisResult> => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/image-search/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    } finally {
      setLoading(false);
    }
  };

  const findSimilarProducts = async (tags: string[], limit: number = 10) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/products/search?tags=${tags.join(',')}&limit=${limit}`
      );
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error finding similar products:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    analyzeImage,
    findSimilarProducts,
  };
}

