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
      <div className="bg-gray-0 p-shamar-32 rounded-shamar-md shadow-shamar-soft border border-gray-200 w-full max-w-shamar-container max-w-2xl">
        <h2 className="text-shamar-h1 font-semibold text-danger-500 mb-shamar-16">
          ⚠️ Une erreur est survenue
        </h2>
        <div className="mb-shamar-24">
          <p className="text-gray-900 font-semibold mb-2 text-shamar-body">Message d&apos;erreur :</p>
          <p className="text-gray-700 bg-danger-500/10 p-shamar-16 rounded-shamar-md border border-danger-500/30 font-mono text-shamar-small">
            {error.message}
          </p>
          {isDev && error.stack && (
            <details className="mt-shamar-16">
              <summary className="cursor-pointer text-shamar-small text-gray-600 hover:text-gray-900">
                Stack trace (développement uniquement)
              </summary>
              <pre className="mt-2 text-shamar-caption bg-gray-100 p-shamar-16 rounded-shamar-md overflow-auto max-h-96">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
        <div className="flex gap-shamar-16 justify-center flex-wrap">
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

