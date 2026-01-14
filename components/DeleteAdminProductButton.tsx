'use client';

import { useRouter } from 'next/navigation';
import DeleteButton from './DeleteButton';

type DeleteAdminProductButtonProps = {
  productId: string;
  productName: string;
};

export default function DeleteAdminProductButton({
  productId,
  productName,
}: DeleteAdminProductButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await fetch(`/api/admin/products?id=${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }

    router.refresh();
  };

  return <DeleteButton onDelete={handleDelete} itemName={productName} />;
}

