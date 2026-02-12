import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { DollarSign, Calendar, TrendingUp, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HostDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // TODO: Récupérer stats depuis API
  const stats = {
    monthlyRevenue: 0,
    activeBookings: 0,
    occupancyRate: 0,
    rating: 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Tableau de bord Host</h1>
        <p className="text-gray-400 mt-1">Bienvenue, {user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Revenus du mois</p>
              <p className="text-2xl font-black text-white mt-1">{stats.monthlyRevenue.toLocaleString()} FCFA</p>
            </div>
            <DollarSign className="h-10 w-10 text-emerald-400" />
          </div>
        </div>
        <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Réservations actives</p>
              <p className="text-2xl font-black text-white mt-1">{stats.activeBookings}</p>
            </div>
            <Calendar className="h-10 w-10 text-rose-400" />
          </div>
        </div>
        <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Taux occupation</p>
              <p className="text-2xl font-black text-white mt-1">{stats.occupancyRate}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-amber-400" />
          </div>
        </div>
        <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Note moyenne</p>
              <p className="text-2xl font-black text-white mt-1">{stats.rating || '—'} ⭐</p>
            </div>
            <Star className="h-10 w-10 text-amber-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/host/properties/new"
          className="block p-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
        >
          <h3 className="font-bold text-white text-lg">Ajouter un logement</h3>
          <p className="text-rose-200 text-sm mt-1">Publiez votre annonce et commencez à recevoir des réservations</p>
        </Link>
        <Link
          href="/host"
          className="block p-8 rounded-2xl border border-brand-anthracite/50 bg-brand-bleu-ardoise/50 hover:bg-brand-bleu-ardoise/70 transition-colors"
        >
          <h3 className="font-bold text-white text-lg">Voir le catalogue</h3>
          <p className="text-slate-400 text-sm mt-1">Découvrez tous les logements disponibles sur SHAMAR Host</p>
        </Link>
      </div>
    </div>
  );
}
