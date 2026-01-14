'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type CreateOrderButtonProps = {
  productId: string;
};

export default function CreateOrderButton({ productId }: CreateOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { profile, isAuthenticated } = useAuth();

  const handleCreateOrder = async () => {
    // Vérification du rôle avant de procéder
    if (!isAuthenticated || !profile) {
      router.push('/auth/login');
      return;
    }

    if (profile.role !== 'buyer') {
      alert('Seuls les acheteurs peuvent créer une commande');
      router.push('/dashboard');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/buyer/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: [{ productId, quantity: 1 }],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la création de la commande');
        return;
      }

      alert('Commande créée avec succès !');
      router.push('/dashboard/buyer/orders');
      router.refresh();
    } catch {
      alert('Erreur lors de la création de la commande');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreateOrder}
      disabled={isLoading}
      className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⏳</span> Chargement...
        </>
      ) : (
        <>
          <ShoppingCart size={14} /> Ajouter
        </>
      )}
    </button>
  );
}

