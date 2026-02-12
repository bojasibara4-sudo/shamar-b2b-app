/**
 * Service produits — lecture/admin et liste buyer.
 * Pas de modification des services existants : ajout des fonctions nécessaires.
 */

import { createClient } from '@/lib/supabase/server';

export interface ProductRow {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  seller_id: string;
  shop_id?: string | null;
  image_url?: string | null;
  stock_quantity?: number | null;
  category?: string | null;
  created_at?: string;
}

/**
 * Liste tous les produits (admin)
 */
export async function getProductsForAdmin(): Promise<ProductRow[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('products')
    .select('id, name, description, price, currency, seller_id, shop_id, image_url, stock_quantity, category, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('product.service getProductsForAdmin:', error);
    return [];
  }
  return (data || []) as ProductRow[];
}

/**
 * Liste des produits pour un acheteur (catalogue)
 */
export async function getProductsForBuyer(): Promise<ProductRow[]> {
  const supabase = await createClient();
  const { data, error } = await (supabase as any)
    .from('products')
    .select('id, name, description, price, currency, seller_id, shop_id, image_url, stock_quantity, category, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('product.service getProductsForBuyer:', error);
    return [];
  }
  return (data || []) as ProductRow[];
}

/**
 * Supprime un produit (admin)
 */
export async function deleteProductById(productId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await (supabase as any).from('products').delete().eq('id', productId);
  if (error) {
    console.error('product.service deleteProductById:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}
