import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h2>
        <p className="text-gray-600 mb-6">
          La page demandée n&apos;existe pas ou a été déplacée.
        </p>
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

