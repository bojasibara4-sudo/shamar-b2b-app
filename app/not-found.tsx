import Link from 'next/link';
import { Button } from '@/components/ui';
import { headers } from 'next/headers';

export default async function NotFound() {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || 'unknown';
  
  // En développement, afficher le pathname pour le debugging
  const isDev = process.env.NODE_ENV === 'development';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">
          🔍 Page introuvable (404)
        </h2>
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            La page demandée n&apos;existe pas ou a été déplacée.
          </p>
          {isDev && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <p className="text-sm font-semibold text-yellow-800 mb-1">
                Informations de debug (développement uniquement) :
              </p>
              <p className="text-xs text-yellow-700 font-mono">
                Pathname demandé : <strong>{pathname}</strong>
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                Vérifiez que la route existe dans le dossier <code>app/</code> ou qu&apos;elle n&apos;est pas dans un route group.
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">Retour à l&apos;accueil</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline">Se connecter</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

