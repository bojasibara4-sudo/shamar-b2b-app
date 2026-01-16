'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LandingPage from '@/components/layout/LandingPage';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Timeout de sécurité : après 1.5s, afficher le contenu même si loading est true
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Si loading et timeout pas atteint, afficher loader
  if (loading && !timeoutReached) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Sinon, afficher la landing page (même si loading est true après timeout)
  return <LandingPage />;
}
