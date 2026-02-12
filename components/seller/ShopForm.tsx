'use client';

import React, { useState, FormEvent } from 'react';

interface ShopFormData {
  name: string;
  description: string;
  category: string;
  country: string;
  city: string;
  region: string;
}

interface ShopFormProps {
  initialData?: ShopFormData;
  onSubmit: (data: ShopFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const CATEGORIES = [
  'Agro & Matières Premières',
  'Industrie & Équipements',
  'Électronique & High-Tech',
  'Mode & Textile',
  'Tourisme & Services',
  'Import / Export',
];

const COUNTRIES = [
  'CI', 'SN', 'BJ', 'TG', 'NG', // Afrique de l'Ouest
  'CM', 'GA', 'CG', // Afrique Centrale
  'KE', 'TZ', // Afrique de l'Est
  'CN', // Chine
  'FR', 'BE', 'CH', // Europe
];

export default function ShopForm({
  initialData,
  onSubmit,
  isLoading = false,
  error: externalError,
}: ShopFormProps) {
  const [formData, setFormData] = useState<ShopFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    country: initialData?.country || '',
    city: initialData?.city || '',
    region: initialData?.region || '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Le nom de la boutique est requis');
      return;
    }

    if (!formData.category) {
      setError('La catégorie est requise');
      return;
    }

    if (!formData.country) {
      setError('Le pays est requis');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(error || externalError) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error || externalError}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nom de la boutique <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Ex: Ma Boutique Africaine"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Décrivez votre boutique, vos produits, vos valeurs..."
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Catégorie <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Sélectionner une catégorie</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Pays <span className="text-red-500">*</span>
        </label>
        <select
          id="country"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Sélectionner un pays</option>
          {COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          Ville
        </label>
        <input
          type="text"
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Ex: Abidjan, Douala"
        />
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
          Région
        </label>
        <input
          type="text"
          id="region"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Ex: Afrique de l'Ouest"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Créer la boutique'}
        </button>
      </div>
    </form>
  );
}
