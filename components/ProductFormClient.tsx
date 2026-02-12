'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import ProductForm, { type ProductFormData } from './ProductForm';

type ProductFormClientProps = {
  initialData?: {
    name: string;
    description: string;
    price: number;
    category?: string;
    min_order_quantity?: number;
    specifications?: Record<string, unknown>;
    price_tiers?: { min_quantity: number; price: number }[];
  };
  productId?: string;
};

export default function ProductFormClient({
  initialData,
  productId,
}: ProductFormClientProps) {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && profile && profile.role !== 'seller') {
      router.push('/dashboard');
    }
  }, [profile, loading, router]);

  const handleSubmit = async (data: ProductFormData) => {
    if (!profile || profile.role !== 'seller') {
      alert('Seuls les vendeurs peuvent créer ou modifier des produits');
      router.push('/dashboard');
      return;
    }

    const url = productId
      ? `/api/seller/products/${productId}`
      : '/api/seller/products';
    const method = productId ? 'PUT' : 'POST';

    const body: Record<string, unknown> = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category || 'other',
      min_order_quantity: Math.max(1, parseInt(data.min_order_quantity, 10) || 1),
      specifications: Object.keys(data.specifications || {}).length ? data.specifications : {},
      price_tiers: (data.price_tiers || []).filter((t) => Number(t.min_quantity) >= 0 && Number(t.price) >= 0),
    };

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la sauvegarde');
    }

    router.push('/dashboard/seller/products');
    router.refresh();
  };

  const handleCancel = () => {
    router.push('/dashboard/seller/products');
  };

  return (
    <ProductForm
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={productId ? handleCancel : undefined}
    />
  );
}

