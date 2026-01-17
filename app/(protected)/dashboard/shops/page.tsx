'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { supabaseClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Store } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                  Mes <span className="text-indigo-600">Boutiques</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium">
                  Gérez vos boutiques et points de vente
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
              >
                Créer une boutique
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200">
              <p className="text-slate-500 font-medium">Chargement...</p>
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-200">
              <Store className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 font-medium mb-2">Aucune boutique</p>
              <p className="text-sm text-slate-400">Créez-en une pour commencer</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/dashboard/shops/${shop.id}`}
                  className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all"
                >
                  <h3 className="text-xl font-black text-slate-900 mb-2">
                    {shop.name}
                  </h3>
                  {shop.description && (
                    <p className="text-sm text-slate-600 mb-4 font-medium line-clamp-2">{shop.description}</p>
                  )}
                  <p className="text-xs text-slate-400 font-medium">
                    Créée le {new Date(shop.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-8 rounded-[2rem] max-w-md w-full border border-slate-200 shadow-xl">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Nouvelle boutique</h2>
                <form onSubmit={handleCreateShop} className="space-y-6">
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2">
                      Nom de la boutique
                    </label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2">
                      Description (optionnel)
                    </label>
                    <textarea
                      value={shopDescription}
                      onChange={(e) => setShopDescription(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
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
                      className="flex-1 bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-black hover:bg-slate-200 transition-all"
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
    </AuthGuard>
  );
}

