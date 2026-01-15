'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/app/dashboard');
      } else {
        // Ne pas rediriger automatiquement, laisser voir la page d'accueil
        // L'utilisateur peut choisir de se connecter
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Chargement...</div>
    </div>
  );
}
