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
      <div className="bg-gray-0 p-shamar-32 rounded-shamar-md shadow-shamar-soft border border-gray-200 w-full max-w-shamar-container max-w-2xl">
        <h2 className="text-shamar-h1 font-semibold text-warning-500 mb-shamar-16">
          🔍 Page introuvable (404)
        </h2>
        <div className="mb-shamar-24">
          <p className="text-gray-700 text-shamar-body mb-shamar-16">
            La page demandée n&apos;existe pas ou a été déplacée.
          </p>
          {isDev && (
            <div className="bg-warning-500/10 border border-warning-500/30 p-shamar-16 rounded-shamar-md">
              <p className="text-shamar-small font-semibold text-amber-800 mb-1">
                Informations de debug (développement uniquement) :
              </p>
              <p className="text-shamar-caption text-amber-700 font-mono">
                Pathname demandé : <strong>{pathname}</strong>
              </p>
              <p className="text-shamar-caption text-amber-600 mt-2">
                Vérifiez que la route existe dans le dossier <code className="bg-gray-100 px-1 rounded-shamar-sm">app/</code> ou qu&apos;elle n&apos;est pas dans un route group.
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-shamar-16 justify-center flex-wrap">
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

