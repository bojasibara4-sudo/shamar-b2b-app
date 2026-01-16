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
  // En développement, afficher l'erreur complète pour le debugging
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          ⚠️ Une erreur est survenue
        </h2>
        <div className="mb-6">
          <p className="text-gray-900 font-semibold mb-2">Message d'erreur :</p>
          <p className="text-gray-700 bg-red-50 p-4 rounded border border-red-200 font-mono text-sm">
            {error.message}
          </p>
          {isDev && error.stack && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                Stack trace (développement uniquement)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
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

