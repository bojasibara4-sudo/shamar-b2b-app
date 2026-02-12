'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Package } from 'lucide-react';

type Provider = { id: string; name: string; slug: string; base_price: number; avg_days: number; quality_rating: number };
type Delivery = { id: string; tracking_code?: string; carrier_name?: string; status: string } | null;

export default function PrepareShipmentForm({
  orderId,
  delivery,
  providers,
}: {
  orderId: string;
  delivery: Delivery;
  providers: Provider[];
}) {
  const router = useRouter();
  const [trackingCode, setTrackingCode] = useState(delivery?.tracking_code || '');
  const [carrierId, setCarrierId] = useState('');
  const [carrierName, setCarrierName] = useState(delivery?.carrier_name || '');
  const [loading, setLoading] = useState(false);

  async function handleMarkShipped(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/delivery/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          delivery_id: delivery?.id,
          order_id: orderId,
          status: 'shipped',
          tracking_code: trackingCode || undefined,
          carrier_name: carrierName || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Erreur');
        setLoading(false);
        return;
      }
      const res2 = await fetch('/api/escrow/shipped', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (!res2.ok) {
        // delivery updated but escrow maybe not - still refresh
      }
      router.push('/dashboard/seller/deliveries');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const canShip = delivery && delivery.status === 'pending';

  return (
    <form onSubmit={handleMarkShipped} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Transporteur</label>
        <select
          value={carrierId}
          onChange={(e) => {
            const id = e.target.value;
            setCarrierId(id);
            const p = providers.find((x) => x.id === id);
            if (p) setCarrierName(p.name);
          }}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
        >
          <option value="">— Choisir —</option>
          {providers.map((p) => (
            <option key={p.id} value={p.id}>{p.name} — {Number(p.base_price).toLocaleString()} FCFA, ~{p.avg_days} j</option>
          ))}
        </select>
        {carrierId && <input type="hidden" value={carrierName} onChange={() => {}} />}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nom transporteur (si autre)</label>
        <input
          type="text"
          value={carrierName}
          onChange={(e) => setCarrierName(e.target.value)}
          placeholder="DHL, FedEx, partenaire local..."
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">N° de suivi</label>
        <input
          type="text"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          placeholder="Code tracking transporteur"
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
        />
      </div>
      <p className="text-slate-500 text-xs">Imprimer facture et étiquette depuis votre espace (à brancher). Génération QR tracking (à brancher).</p>
      {delivery ? (
        canShip ? (
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-vert text-white rounded-xl font-medium text-sm hover:bg-brand-vert/90 disabled:opacity-50"
          >
            <Truck size={18} /> {loading ? 'En cours…' : 'Marquer expédié'}
          </button>
        ) : (
          <p className="text-slate-500 text-sm">Statut actuel : <strong>{delivery.status}</strong>. Expédition déjà enregistrée.</p>
        )
      ) : (
        <p className="text-amber-600 text-sm">Aucune livraison créée pour cette commande. Créez-en une depuis la commande ou le tunnel de vente.</p>
      )}
    </form>
  );
}
