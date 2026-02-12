import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { getHostPropertiesByHost } from '@/services/host.service';
import { Home, Plus, Pencil, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HostPropertiesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const properties = await getHostPropertiesByHost(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Mes logements</h1>
        <Link
          href="/dashboard/host/properties/new"
          className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors"
        >
          <Plus size={20} />
          Ajouter un logement
        </Link>
      </div>

      <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 overflow-hidden">
        {properties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-anthracite/50">
              <thead className="bg-brand-bleu-nuit">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-or uppercase">Photo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-or uppercase">Titre</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-or uppercase">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-or uppercase">Prix</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-or uppercase">Disponibilité</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-brand-or uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-anthracite/30">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-brand-bleu-nuit/30">
                    <td className="px-6 py-4">
                      <img src={p.images[0]} alt="" className="w-16 h-12 object-cover rounded-lg" />
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{p.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">Actif</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{p.price_per_night.toLocaleString()} FCFA/nuit</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">—</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/host/${p.id}`}
                          className="p-2 rounded-lg bg-brand-anthracite/30 text-white hover:bg-brand-anthracite/50"
                          title="Voir"
                        >
                          <Home size={18} />
                        </Link>
                        <button className="p-2 rounded-lg bg-brand-anthracite/30 text-white hover:bg-brand-anthracite/50" title="Éditer">
                          <Pencil size={18} />
                        </button>
                        <button className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30" title="Supprimer">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <Home className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Aucun logement pour le moment</p>
            <Link
              href="/dashboard/host/properties/new"
              className="inline-flex items-center gap-2 mt-4 text-rose-400 font-bold hover:underline"
            >
              <Plus size={18} /> Ajouter votre premier logement
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
