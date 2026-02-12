'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeleteButtonProps = {
  onDelete: () => Promise<void>;
  label?: string;
  itemName?: string;
};

export default function DeleteButton({
  onDelete,
  label = 'Supprimer',
  itemName,
}: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete();
      router.refresh();
      setShowConfirm(false);
    } catch {
      alert('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2 items-center animate-in fade-in duration-200">
        <span className="text-sm text-gray-400 font-medium">
          Confirmer ?
        </span>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="px-3 py-1 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
        >
          {isLoading ? '...' : 'Oui'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1 border border-brand-anthracite/50 text-gray-400 text-sm rounded-lg hover:text-white hover:bg-brand-anthracite/50 transition-all"
        >
          Non
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all"
    >
      {label}
    </button>
  );
}

