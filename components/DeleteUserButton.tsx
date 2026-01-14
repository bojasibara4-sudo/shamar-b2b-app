'use client';

import { useRouter } from 'next/navigation';
import DeleteButton from './DeleteButton';

type DeleteUserButtonProps = {
  userId: string;
  userEmail: string;
};

export default function DeleteUserButton({
  userId,
  userEmail,
}: DeleteUserButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await fetch(`/api/admin/users?id=${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression');
    }

    router.refresh();
  };

  return <DeleteButton onDelete={handleDelete} itemName={userEmail} />;
}

