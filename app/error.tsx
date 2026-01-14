'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()} variant="primary">
            Réessayer
          </Button>
          <Link href="/">
            <Button variant="outline">Retour à l&apos;accueil</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

