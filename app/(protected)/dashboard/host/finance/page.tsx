import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { DollarSign, Wallet, History } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HostFinancePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // TODO: Récupérer solde escrow, disponible, historique
  const balance = { escrow: 0, available: 0 };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Revenus & Finance</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <DollarSign className="text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Solde Escrow</p>
              <p className="text-2xl font-black text-white">{balance.escrow.toLocaleString()} FCFA</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Montant bloqué (séjours en cours)</p>
        </div>
        <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Wallet className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Disponible au retrait</p>
              <p className="text-2xl font-black text-white">{balance.available.toLocaleString()} FCFA</p>
            </div>
          </div>
          <button className="mt-4 px-4 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 text-sm">
            Retirer
          </button>
        </div>
      </div>

      <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <History size={20} /> Historique des paiements
        </h2>
        <div className="text-center py-12 text-slate-500">
          Aucun versement pour le moment
        </div>
      </div>
    </div>
  );
}
