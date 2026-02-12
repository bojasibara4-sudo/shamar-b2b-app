'use client';

import { useState, FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export type PriceTier = { min_quantity: number; price: number };

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  min_order_quantity: string;
  specifications: Record<string, string>;
  price_tiers: PriceTier[];
};

type ProductFormProps = {
  initialData?: {
    name: string;
    description: string;
    price: number;
    category?: string;
    min_order_quantity?: number;
    specifications?: Record<string, unknown>;
    price_tiers?: PriceTier[];
  };
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
};

function specsToLines(specs: Record<string, unknown> | null | undefined): string {
  if (!specs || typeof specs !== 'object') return '';
  return Object.entries(specs)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join('\n');
}

function linesToSpecs(lines: string): Record<string, string> {
  const out: Record<string, string> = {};
  lines.split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) {
      const key = line.slice(0, i).trim();
      const value = line.slice(i + 1).trim();
      if (key) out[key] = value;
    }
  });
  return out;
}

const CATEGORIES = [
  { value: 'other', label: 'Autres' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'legumes', label: 'Légumes' },
  { value: 'cereales', label: 'Céréales' },
  { value: 'semences', label: 'Semences' },
];

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price.toString() || '',
    category: initialData?.category || 'other',
    min_order_quantity: String(initialData?.min_order_quantity ?? 1),
    specifications: {},
    price_tiers: Array.isArray(initialData?.price_tiers) ? initialData.price_tiers : [],
  });
  const [specsText, setSpecsText] = useState(specsToLines(initialData?.specifications as Record<string, unknown>));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const specs = linesToSpecs(specsText);
    try {
      await onSubmit({ ...formData, specifications: specs });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la soumission');
    } finally {
      setIsLoading(false);
    }
  };

  const addTier = () => {
    setFormData((d) => ({
      ...d,
      price_tiers: [...d.price_tiers, { min_quantity: 0, price: 0 }],
    }));
  };
  const updateTier = (index: number, field: 'min_quantity' | 'price', value: number) => {
    setFormData((d) => {
      const next = [...d.price_tiers];
      next[index] = { ...next[index], [field]: value };
      return { ...d, price_tiers: next };
    });
  };
  const removeTier = (index: number) => {
    setFormData((d) => ({
      ...d,
      price_tiers: d.price_tiers.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-black text-slate-900 mb-2">
          Nom du produit
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-black text-slate-900 mb-2">
          Catégorie
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-black text-slate-900 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-black text-slate-900 mb-2">
            Prix (FCFA)
          </label>
          <input
            type="number"
            id="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
        <div>
          <label htmlFor="moq" className="block text-sm font-black text-slate-900 mb-2">
            Quantité min. (MOQ)
          </label>
          <input
            type="number"
            id="moq"
            min="1"
            value={formData.min_order_quantity}
            onChange={(e) => setFormData({ ...formData, min_order_quantity: e.target.value })}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      <div>
        <label htmlFor="specs" className="block text-sm font-black text-slate-900 mb-2">
          Spécifications (une ligne par « clé : valeur »)
        </label>
        <textarea
          id="specs"
          value={specsText}
          onChange={(e) => setSpecsText(e.target.value)}
          placeholder={'Poids: 25 kg\nOrigine: Sénégal'}
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-black text-slate-900">Paliers B2B (quantité / prix)</label>
          <button type="button" onClick={addTier} className="flex items-center gap-1 text-sm font-bold text-brand-vert hover:underline">
            <Plus size={16} /> Ajouter
          </button>
        </div>
        {formData.price_tiers.length === 0 ? (
          <p className="text-slate-500 text-sm py-2">Aucun palier. Optionnel.</p>
        ) : (
          <ul className="space-y-2">
            {formData.price_tiers.map((tier, index) => (
              <li key={index} className="flex items-center gap-2 flex-wrap">
                <input
                  type="number"
                  min="0"
                  placeholder="Qté min"
                  value={tier.min_quantity || ''}
                  onChange={(e) => updateTier(index, 'min_quantity', Number(e.target.value) || 0)}
                  className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Prix FCFA"
                  value={tier.price || ''}
                  onChange={(e) => updateTier(index, 'price', Number(e.target.value) || 0)}
                  className="w-28 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
                <button type="button" onClick={() => removeTier(index)} className="p-2 text-slate-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-black"
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-black text-slate-900"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

