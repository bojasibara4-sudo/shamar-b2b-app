import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { getHostBookingsByHost } from '@/services/host.service';
import { Calendar, Check, X, MessageCircle, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HostBookingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const bookings = await getHostBookingsByHost(user.id);

  const tabs = [
    { id: 'pending', label: 'En attente' },
    { id: 'accepted', label: 'Acceptée' },
    { id: 'rejected', label: 'Refusée' },
    { id: 'active', label: 'En cours' },
    { id: 'completed', label: 'Terminée' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Réservations reçues</h1>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            className="px-4 py-2 rounded-xl bg-brand-anthracite/30 text-slate-300 hover:bg-brand-anthracite/50 hover:text-white font-medium text-sm"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-12">
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between py-4 border-b border-brand-anthracite/30 last:border-0">
                <div>
                  <p className="font-medium text-white">{b.property_title ?? 'Réservation'} #{b.id?.slice(0, 8)}</p>
                  <p className="text-sm text-slate-400">{b.check_in} → {b.check_out} • {b.total_amount?.toLocaleString()} {b.currency}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400" title="Accepter">
                    <Check size={18} />
                  </button>
                  <button className="p-2 rounded-lg bg-rose-500/20 text-rose-400" title="Refuser">
                    <X size={18} />
                  </button>
                  <Link href="/messages" className="p-2 rounded-lg bg-brand-anthracite/30 text-white">
                    <MessageCircle size={18} />
                  </Link>
                  <Link href="/disputes" className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <AlertTriangle size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Aucune réservation pour le moment</p>
            <p className="text-slate-500 text-sm mt-1">Les demandes de réservation apparaîtront ici</p>
            <Link href="/dashboard/host/properties" className="inline-block mt-6 text-rose-400 font-bold hover:underline">
              Gérer mes logements
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
