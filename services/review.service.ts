/**
 * Service de gestion des avis et notations
 * PHASE 9 - Production Ready
 */

import { createClient } from '@/lib/supabase/server';

export interface Review {
  id: string;
  order_id: string;
  buyer_id: string;
  vendor_id: string;
  rating: number;
  comment?: string;
  status: 'pending' | 'published' | 'rejected';
  created_at: string;
  updated_at: string;
}

/**
 * Crée un avis
 */
export async function createReview(
  orderId: string,
  buyerId: string,
  vendorId: string,
  rating: number,
  comment?: string
): Promise<Review | null> {
  const supabase = await createClient();

  try {
    // Vérifier qu'un avis n'existe pas déjà pour cette commande
    const { data: existing } = await (supabase as any)
      .from('reviews')
      .select('id')
      .eq('order_id', orderId)
      .eq('buyer_id', buyerId)
      .single();

    if (existing) {
      console.error('Review already exists for this order');
      return null;
    }

    const { data: review, error } = await (supabase as any)
      .from('reviews')
      .insert({
        order_id: orderId,
        buyer_id: buyerId,
        vendor_id: vendorId,
        rating,
        comment: comment || null,
        status: 'published', // Auto-publish (peut être modifié pour modération)
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      return null;
    }

    // Recalculer la note moyenne du vendeur
    await recalculateVendorRating(vendorId);

    return review as Review;
  } catch (error) {
    console.error('Error creating review:', error);
    return null;
  }
}

/**
 * Recalcule la note moyenne d'un vendeur
 */
export async function recalculateVendorRating(vendorId: string): Promise<number> {
  const supabase = await createClient();

  try {
    const { data: reviews } = await (supabase as any)
      .from('reviews')
      .select('rating')
      .eq('vendor_id', vendorId)
      .eq('status', 'published');

    if (!reviews || reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Note: On pourrait stocker cette moyenne dans une table vendors ou shops
    // Pour l'instant, on la calcule à la volée

    return Math.round(averageRating * 10) / 10; // Arrondir à 1 décimale
  } catch (error) {
    console.error('Error recalculating vendor rating:', error);
    return 0;
  }
}

/**
 * Récupère les avis d'un vendeur
 */
export async function getVendorReviews(vendorId: string): Promise<Review[]> {
  const supabase = await createClient();

  try {
    const { data: reviews, error } = await (supabase as any)
      .from('reviews')
      .select('*')
      .eq('vendor_id', vendorId)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting vendor reviews:', error);
      return [];
    }

    return (reviews || []) as Review[];
  } catch (error) {
    console.error('Error getting vendor reviews:', error);
    return [];
  }
}

/**
 * Récupère la note moyenne d'un vendeur
 */
export async function getVendorAverageRating(vendorId: string): Promise<number> {
  return await recalculateVendorRating(vendorId);
}
