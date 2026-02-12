'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';
import { Store } from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export default function ShopsPage() {
  const { profile } = useAuth();
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');

  useEffect(() => {
    if (profile) {
      loadShops();
    }
  }, [profile]);

  const loadShops = async () => {
    try {
      const res = await fetch('/api/seller/shop');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur chargement');
      setShops(data.shop ? [data.shop] : []);
    } catch (error) {
      console.error('Error loading shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const res = await fetch('/api/seller/shop/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: shopName,
          description: shopDescription || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur création');
      await loadShops();
      setShowCreateModal(false);
      setShopName('');
      setShopDescription('');
    } catch (error) {
      console.error('Error creating shop:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la création de la boutique');
    }
  };

  return (
    <AuthGuard requiredRole="seller">
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          <div className="space-y-shamar-32 animate-in fade-in duration-500">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
                <div className="flex items-center gap-shamar-16">
                  <div className="p-3 bg-primary-100 rounded-shamar-md">
                    <Store className="text-primary-600" size={28} />
                  </div>
                  <div>
                    <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-1">
                      Mes <span className="text-primary-600">Boutiques</span>
                    </h1>
                    <p className="text-shamar-body text-gray-500 font-medium">
                      Gérez vos boutiques et points de vente
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary-600 text-gray-0 px-shamar-24 py-3 rounded-shamar-md font-semibold hover:bg-primary-700 transition-colors shadow-shamar-soft text-shamar-body"
                >
                  Créer une boutique
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-shamar-48 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
                <p className="text-gray-500 font-medium text-shamar-body">Chargement...</p>
              </div>
            ) : shops.length === 0 ? (
              <div className="text-center py-shamar-48 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
                <Store className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
                <p className="text-gray-500 font-medium text-shamar-body mb-2">Aucune boutique</p>
                <p className="text-shamar-small text-gray-400">Créez-en une pour commencer</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-shamar-24">
                {shops.map((shop) => (
                  <Link
                    key={shop.id}
                    href="/dashboard/seller"
                    className="bg-gray-0 p-shamar-24 rounded-shamar-md border border-gray-200 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-200 transition-all block"
                  >
                    <h3 className="text-shamar-h3 text-gray-900 mb-2 font-semibold">
                      {shop.name}
                    </h3>
                    {shop.description && (
                      <p className="text-shamar-small text-gray-600 mb-shamar-16 font-medium line-clamp-2">{shop.description}</p>
                    )}
                    <p className="text-shamar-caption text-gray-400 font-medium">
                      Créée le {new Date(shop.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </Link>
                ))}
              </div>
            )}

            {showCreateModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-0 p-shamar-32 rounded-shamar-md max-w-md w-full border border-gray-200 shadow-shamar-large">
                  <h2 className="text-shamar-h2 text-gray-900 mb-shamar-24 font-semibold">Nouvelle boutique</h2>
                  <form onSubmit={handleCreateShop} className="space-y-shamar-24">
                    <div>
                      <label className="block text-shamar-small font-semibold text-gray-700 mb-2">
                        Nom de la boutique
                      </label>
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        className="w-full px-shamar-16 py-3 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-shamar-body text-gray-900 font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-shamar-small font-semibold text-gray-700 mb-2">
                        Description (optionnel)
                      </label>
                      <textarea
                        value={shopDescription}
                        onChange={(e) => setShopDescription(e.target.value)}
                        className="w-full px-shamar-16 py-3 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-shamar-body text-gray-900 font-medium"
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-shamar-16">
                      <button
                        type="submit"
                        className="flex-1 bg-primary-600 text-gray-0 py-3 px-shamar-24 rounded-shamar-md font-semibold hover:bg-primary-700 transition-colors text-shamar-body"
                      >
                        Créer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateModal(false);
                          setShopName('');
                          setShopDescription('');
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-shamar-24 rounded-shamar-md font-semibold hover:bg-gray-200 transition-colors text-shamar-body"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
