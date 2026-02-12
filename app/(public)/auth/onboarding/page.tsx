'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelection = async (selectedRole: 'buyer' | 'seller') => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      const { error: updateError } = await (supabase as any)
        .from('users')
        .update({ role: selectedRole })
        .eq('id', user.id);
      if (updateError) throw updateError;
      if (selectedRole === 'seller') {
        window.location.href = '/dashboard/onboarding-vendeur';
      } else {
        window.location.href = '/dashboard/buyer';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sélection du rôle');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex justify-center pt-shamar-40 pb-shamar-24">
        <Link href="/" className="text-shamar-h2 text-gray-900 font-semibold tracking-tight">
          SHAMAR
        </Link>
      </div>
      <div className="flex-1 flex items-start justify-center px-4 pb-shamar-40">
        <div className="w-full max-w-md bg-gray-0 p-shamar-16 rounded-shamar-md shadow-shamar-soft border border-gray-200">
          <h1 className="text-shamar-h2 text-gray-900 mb-shamar-24 text-center">
            Choisissez votre profil
          </h1>
          {error && (
            <div className="mb-shamar-16 p-shamar-12 bg-danger-500/10 border border-danger-500/30 rounded-shamar-sm text-shamar-small text-danger-500 font-medium">
              {error}
            </div>
          )}
          <div className="space-y-shamar-16">
            <button
              type="button"
              onClick={() => handleRoleSelection('buyer')}
              disabled={loading}
              className="w-full p-shamar-16 border-2 border-gray-200 rounded-shamar-md hover:border-primary-600 hover:bg-primary-50/50 transition-all disabled:opacity-50 text-left focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:ring-offset-2"
            >
              <h3 className="font-semibold text-shamar-h4 text-gray-900 mb-2">Acheteur</h3>
              <p className="text-shamar-body text-gray-600">
                Je souhaite acheter des produits et services pour mon entreprise
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelection('seller')}
              disabled={loading}
              className="w-full p-shamar-16 border-2 border-gray-200 rounded-shamar-md hover:border-primary-600 hover:bg-primary-50/50 transition-all disabled:opacity-50 text-left focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:ring-offset-2"
            >
              <h3 className="font-semibold text-shamar-h4 text-gray-900 mb-2">Vendeur</h3>
              <p className="text-shamar-body text-gray-600">
                Je souhaite vendre mes produits et services sur la plateforme
              </p>
            </button>
          </div>
          {loading && (
            <p className="mt-shamar-16 text-center text-shamar-small text-gray-500">
              Configuration en cours...
            </p>
          )}
          <div className="mt-shamar-24 text-center">
            <Link href="/dashboard" className="text-shamar-small text-primary-600 hover:underline">
              Passer cette étape
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
