'use client';

import { useRouter } from 'next/navigation';
import DeleteButton from './DeleteButton';

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export default function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await fetch(`/api/seller/products/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }

    router.refresh();
  };

  return <DeleteButton onDelete={handleDelete} itemName={productName} />;
}

