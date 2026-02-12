'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

interface AddToCartButtonProps {
  productId: string;
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({ productId, className, children }: AddToCartButtonProps) {
  const { add } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    add(productId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleClick}
        className={className || 'bg-brand-vert text-white px-6 py-3 rounded-xl font-black hover:bg-brand-vert-fonce transition-all shadow-lg shadow-brand-vert/20'}
      >
        {children || (added ? '✓ Ajouté' : 'Ajouter au panier')}
      </button>
      {added && (
        <button
          onClick={() => router.push('/cart')}
          className="px-4 py-3 rounded-xl font-bold border border-brand-vert text-brand-vert hover:bg-brand-vert/10"
        >
          Voir le panier
        </button>
      )}
    </div>
  );
}
