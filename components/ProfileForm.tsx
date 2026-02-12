'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/Input';
import type { AppRole } from '@/services/auth.service';

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
    role: AppRole;
  };
  profile: any;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    company_name: profile?.company_name || '',
    company_address: profile?.company_address || '',
    country: profile?.country || '',
    city: profile?.city || '',
    region: profile?.region || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: updateError } = await (supabase as any)
        .from('users')
        .update({
          full_name: formData.full_name || null,
          phone: formData.phone || null,
          company_name: formData.company_name || null,
          company_address: formData.company_address || null,
          country: formData.country || null,
          city: formData.city || null,
          region: formData.region || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.refresh();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-brand-vert/10 border border-brand-vert/30 rounded-xl text-brand-vert text-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-vert"></span>
          Profil mis à jour avec succès
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="email"
          label="Email"
          type="email"
          value={user.email}
          disabled
          variant="premium"
          helperText="L'email ne peut pas être modifié"
          className="cursor-not-allowed opacity-70"
        />

        <Input
          id="full_name"
          label="Nom complet"
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          placeholder="Votre nom complet"
          variant="premium"
        />

        <Input
          id="phone"
          label="Téléphone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+123 456 789"
          variant="premium"
        />

        <Input
          id="company_name"
          label="Nom de l'entreprise"
          type="text"
          value={formData.company_name}
          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          placeholder="Nom de votre société"
          variant="premium"
        />

        <Input
          id="country"
          label="Pays"
          type="text"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          placeholder="Pays de résidence"
          variant="premium"
        />

        <Input
          id="city"
          label="Ville"
          type="text"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="Ville"
          variant="premium"
        />

        <Input
          id="region"
          label="Région"
          type="text"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          placeholder="Région / État"
          variant="premium"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Adresse de l'entreprise
        </label>
        <textarea
          value={formData.company_address}
          onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 border border-brand-anthracite rounded-xl bg-brand-bleu-nuit text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-or/50 focus:border-brand-or/50 transition-all"
          placeholder="Adresse complète"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-brand-anthracite/30">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-brand-anthracite rounded-xl text-gray-400 hover:text-white hover:bg-brand-anthracite/50 transition-colors font-medium"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-brand-or to-brand-or-clair text-brand-noir font-bold rounded-xl hover:shadow-lg hover:shadow-brand-or/20 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}
