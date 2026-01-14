'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import ProductForm from './ProductForm';

type ProductFormClientProps = {
  initialData?: {
    name: string;
    description: string;
    price: number;
  };
  productId?: string;
};

export default function ProductFormClient({
  initialData,
  productId,
}: ProductFormClientProps) {
  const router = useRouter();
  const { profile, loading } = useAuth();

  // Redirection si l'utilisateur n'est pas seller
  useEffect(() => {
    if (!loading && profile && profile.role !== 'seller') {
      router.push('/dashboard');
    }
  }, [profile, loading, router]);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    price: string;
  }) => {
    // Vérification du rôle avant soumission
    if (!profile || profile.role !== 'seller') {
      alert('Seuls les vendeurs peuvent créer ou modifier des produits');
      router.push('/dashboard');
      return;
    }

    const url = productId
      ? `/api/seller/products/${productId}`
      : '/api/seller/products';
    const method = productId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
      }),
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

