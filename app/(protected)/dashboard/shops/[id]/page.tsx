'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';
import { ArrowLeft, Store } from 'lucide-react';

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useAuth();
  const [shop, setShop] = useState<{ id: string; name: string; description?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/seller/shop');
        const data = await res.json();
        if (res.ok && data.shop && data.shop.id === params.id) {
          setShop(data.shop);
        } else {
          router.push('/dashboard/shops');
        }
      } catch {
        router.push('/dashboard/shops');
      } finally {
        setLoading(false);
      }
    }
    if (profile) load();
  }, [profile, params.id, router]);

  if (loading || !shop) {
    return (
      <AuthGuard requiredRole="seller">
        <div className="bg-gray-50 min-h-full">
          <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
            <p className="text-shamar-body text-gray-500 font-medium">Chargement...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="seller">
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <div className="space-y-shamar-32 animate-in fade-in duration-500">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
              <Link
                href="/dashboard/shops"
                className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 mb-shamar-16 transition-colors"
              >
                <ArrowLeft size={20} />
                Retour aux boutiques
              </Link>
              <div className="flex items-center gap-shamar-16 mb-2">
                <div className="p-shamar-12 bg-primary-500/10 rounded-shamar-md border border-primary-500/20">
                  <Store className="text-primary-600" size={32} />
                </div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                  {shop.name}
                </h1>
              </div>
              {shop.description && (
                <p className="text-shamar-body text-gray-600 font-medium ml-[4.5rem]">
                  {shop.description}
                </p>
              )}
            </div>

            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
              <p className="text-shamar-body text-gray-500 font-medium">
                Paramètres et édition de la boutique.
              </p>
              <div className="mt-shamar-24 flex justify-center">
                <span className="px-shamar-16 py-2 bg-primary-500/10 text-primary-600 rounded-shamar-md border border-primary-500/20 text-shamar-small font-semibold">
                  Module d&apos;édition à venir
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
