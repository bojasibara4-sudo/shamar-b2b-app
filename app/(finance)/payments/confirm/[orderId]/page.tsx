'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, CheckCircle, AlertCircle } from 'lucide-react';

export default function ConfirmReceptionPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [escrow, setEscrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
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

  const canConfirm = escrow && ['HOLD', 'SHIPPED'].includes(escrow.status);

  const handleConfirm = async () => {
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
      setDone(true);
      setEscrow((e: any) => (e ? { ...e, status: 'DELIVERED' } : e));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center text-gray-500 text-shamar-body font-medium">Chargement...</div>
      </div>
    );
  }
  if (error && !escrow) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center text-danger-500 text-shamar-body font-medium">{error}</div>
      </div>
    );
  }
  if (!escrow) {
    return (
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 py-shamar-48 text-center text-gray-500 text-shamar-body font-medium">Commande introuvable.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
        <div className="max-w-lg mx-auto">
          <Link href="/payments" className="inline-flex gap-2 text-shamar-body font-medium text-gray-500 mb-shamar-24 hover:text-primary-600 transition-colors">← Paiements</Link>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">Confirmer la réception</h1>
            <p className="text-shamar-body text-gray-500 font-medium mb-shamar-24">Commande #{orderId.slice(0, 8)} — {Number(escrow.amount).toLocaleString()} {escrow.currency || 'FCFA'}</p>

            {done ? (
              <div className="p-shamar-16 bg-success-500/10 rounded-shamar-md border border-success-500/30 flex items-center gap-3 text-gray-800 font-semibold text-shamar-body">
                <CheckCircle className="text-success-500 shrink-0" size={24} /> Réception confirmée. Les fonds seront libérés au vendeur.
              </div>
            ) : (
              <>
                {error && <p className="text-danger-500 text-shamar-small mb-shamar-16 font-medium">{error}</p>}
                <div className="flex flex-col gap-shamar-16">
                  {canConfirm && (
                    <button
                      onClick={handleConfirm}
                      disabled={confirming}
                      className="w-full inline-flex items-center justify-center gap-2 px-shamar-24 py-shamar-16 rounded-shamar-md bg-primary-600 text-gray-0 font-semibold disabled:opacity-50 hover:bg-primary-700 transition-colors text-shamar-body"
                    >
                      <Package size={22} /> {confirming ? 'Envoi...' : 'Confirmer reçu'}
                    </button>
                  )}
                  {!canConfirm && !['DELIVERED', 'RELEASED'].includes(escrow.status) && (
                    <p className="text-gray-500 text-shamar-small font-medium">La confirmation sera possible une fois le colis expédié.</p>
                  )}
                  <Link
                    href="/disputes"
                    className="w-full inline-flex items-center justify-center gap-2 px-shamar-24 py-3 rounded-shamar-md border border-warning-500/50 text-amber-700 font-semibold hover:bg-warning-500/10 transition-colors text-shamar-body"
                  >
                    <AlertCircle size={20} /> Signaler un problème
                  </Link>
                </div>
              </>
            )}

            <div className="mt-shamar-24 pt-shamar-24 border-t border-gray-200 flex gap-shamar-16 flex-wrap">
              <Link href={`/payments/escrow/order/${orderId}`} className="text-shamar-small font-medium text-primary-600 hover:underline">Voir statut escrow</Link>
              <Link href={`/dashboard/orders/${orderId}`} className="text-shamar-small font-medium text-gray-600 hover:underline">Voir la commande</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
