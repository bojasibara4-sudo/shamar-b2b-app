'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'buyer' | 'seller' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelection = async (selectedRole: 'buyer' | 'seller') => {
    setRole(selectedRole);
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Mettre à jour le rôle de l'utilisateur
      const { error: updateError } = await (supabase as any)
        .from('users')
        .update({ role: selectedRole })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Rediriger vers le dashboard approprié
      // Utiliser window.location.href pour forcer un rechargement complet
      if (selectedRole === 'seller') {
        window.location.href = '/dashboard/seller/onboarding';
      } else {
        window.location.href = '/dashboard/buyer';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sélection du rôle');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Choisissez votre profil
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelection('buyer')}
            disabled={loading}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all disabled:opacity-50 text-left"
          >
            <h3 className="font-bold text-lg mb-2">Acheteur</h3>
            <p className="text-sm text-gray-600">
              Je souhaite acheter des produits et services pour mon entreprise
            </p>
          </button>

          <button
            onClick={() => handleRoleSelection('seller')}
            disabled={loading}
            className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all disabled:opacity-50 text-left"
          >
            <h3 className="font-bold text-lg mb-2">Vendeur</h3>
            <p className="text-sm text-gray-600">
              Je souhaite vendre mes produits et services sur la plateforme
            </p>
          </button>
        </div>

        {loading && (
          <div className="mt-4 text-center text-gray-500">
            Configuration en cours...
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-sm text-emerald-600 hover:underline">
            Passer cette étape
          </Link>
        </div>
      </div>
    </div>
  );
}
