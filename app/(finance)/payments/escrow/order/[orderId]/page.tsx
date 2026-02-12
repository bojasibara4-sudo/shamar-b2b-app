'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, CheckCircle, AlertCircle, Truck, Package } from 'lucide-react';

const STEPS = ['CREATED', 'HOLD', 'SHIPPED', 'DELIVERED', 'RELEASED'] as const;

export default function EscrowOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [escrow, setEscrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/escrow?order_id=${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setEscrow(d.escrow);
      })
      .catch(() => setError('Erreur chargement'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const isBuyer = escrow && typeof window !== 'undefined' && escrow.buyer_id; // will be set from escrow after we have profile; we need to compare with current user
  const canConfirm = escrow && ['HOLD', 'SHIPPED'].includes(escrow.status);

  const handleConfirmReception = async () => {
    setConfirming(true);
    setError('');
    try {
      const res = await fetch('/api/escrow/delivered', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setEscrow((e: any) => (e ? { ...e, status: 'DELIVERED' } : e));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return (<div className="bg-gray-50 min-h-full"><div className="max-w-shamar-container mx-auto py-shamar-48 px-4 text-center text-gray-500 text-shamar-body font-medium">Chargement...</div></div>);
  if (error && !escrow) return (<div className="bg-gray-50 min-h-full"><div className="max-w-shamar-container mx-auto py-shamar-48 px-4 text-center text-danger-500 text-shamar-body font-medium">{error}</div></div>);
  if (!escrow) return (<div className="bg-gray-50 min-h-full"><div className="max-w-shamar-container mx-auto py-shamar-48 px-4 text-center text-gray-500 text-shamar-body font-medium">Escrow introuvable.</div></div>);

  const currentIndex = STEPS.indexOf(escrow.status as any) >= 0 ? STEPS.indexOf(escrow.status as any) : 0;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto py-shamar-24 px-4">
      <Link href="/payments" className="inline-flex gap-2 text-gray-600 font-medium mb-shamar-24 hover:text-primary-600 text-shamar-body">← Paiements</Link>
      <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
        <div className="flex items-center gap-3 mb-shamar-24">
          <div className="p-3 bg-warning-500/20 rounded-shamar-md">
            <Shield className="text-amber-600" size={28} />
          </div>
          <div>
            <h1 className="text-shamar-h2 text-gray-900">Statut escrow</h1>
            <p className="text-gray-500 text-shamar-small">Commande #{orderId.slice(0, 8)}</p>
          </div>
        </div>

        <div className="mb-shamar-24 p-shamar-16 bg-gray-50 rounded-shamar-md flex justify-between items-center">
          <span className="text-gray-600 font-medium text-shamar-body">Montant</span>
          <span className="text-shamar-h3 font-semibold text-gray-900">
            {Number(escrow.amount).toLocaleString()} {escrow.currency || 'FCFA'}
          </span>
        </div>

        <div className="mb-shamar-24">
          <h2 className="text-shamar-caption font-semibold text-gray-500 uppercase tracking-wider mb-3">Étapes</h2>
          <div className="space-y-2">
            {STEPS.map((step, i) => {
              const done = i <= currentIndex;
              const current = i === currentIndex;
              return (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {done ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  <span className={`text-shamar-body ${current ? 'font-semibold text-gray-900' : done ? 'text-gray-600' : 'text-gray-400'}`}>
                    {step === 'CREATED' && 'Créé'}
                    {step === 'HOLD' && 'Fonds bloqués'}
                    {step === 'SHIPPED' && 'Expédié'}
                    {step === 'DELIVERED' && 'Livré'}
                    {step === 'RELEASED' && 'Libéré'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {error && <p className="text-red-600 text-shamar-small mb-shamar-16">{error}</p>}

        <div className="flex flex-wrap gap-shamar-12">
          {canConfirm && (
            <button
              onClick={handleConfirmReception}
              disabled={confirming}
              className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md bg-primary-600 text-white font-semibold disabled:opacity-50 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-shamar-body"
            >
              <Package size={20} /> {confirming ? 'Envoi...' : 'Confirmer réception'}
            </button>
          )}
          <Link
            href={`/payments/confirm/${orderId}`}
            className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 text-shamar-body"
          >
            Page confirmation
          </Link>
          <Link href="/disputes" className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md border border-amber-200 text-amber-700 font-semibold hover:bg-amber-50 text-shamar-body">
            <AlertCircle size={20} /> Signaler un litige
          </Link>
          <Link href={`/dashboard/orders/${orderId}`} className="inline-flex items-center gap-2 px-shamar-24 py-3 rounded-shamar-md border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 text-shamar-body">
            <Truck size={20} /> Voir la commande
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
