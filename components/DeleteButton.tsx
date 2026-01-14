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
      <div className="flex gap-2 items-center">
        <span className="text-sm text-gray-600">
          Confirmer la suppression{itemName ? ` de ${itemName}` : ''} ?
        </span>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? '...' : 'Oui'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
        >
          Non
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
    >
      {label}
    </button>
  );
}

