'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { supabaseClient } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Shop {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
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
      const { data, error } = await supabaseClient
        .from('shops')
        .select('*')
        .eq('owner_id', profile!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShops(data || []);
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
      const { data, error } = await supabaseClient
        .from('shops')
        .insert({
          name: shopName,
          description: shopDescription || null,
          owner_id: profile.id,
        } as any)
        .select()
        .single();

      if (error) throw error;

      setShops([data, ...shops]);
      setShowCreateModal(false);
      setShopName('');
      setShopDescription('');
    } catch (error) {
      console.error('Error creating shop:', error);
      alert('Erreur lors de la création de la boutique');
    }
  };

  return (
    <AuthGuard requiredRole="seller">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mes Boutiques</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
          >
            Créer une boutique
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Chargement...</div>
        ) : shops.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune boutique. Créez-en une pour commencer.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops.map((shop) => (
              <Link
                key={shop.id}
                href={`/dashboard/shops/${shop.id}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {shop.name}
                </h3>
                {shop.description && (
                  <p className="text-sm text-gray-600 mb-4">{shop.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  Créée le {new Date(shop.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Nouvelle boutique</h2>
              <form onSubmit={handleCreateShop} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la boutique
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700"
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
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

