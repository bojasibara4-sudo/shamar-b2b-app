'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function ConfirmReceiptButton({ deliveryId }: { deliveryId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/delivery/confirm-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_id: deliveryId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.refresh();
      } else {
        alert(data.error || 'Erreur');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-vert text-white rounded-xl font-medium text-sm hover:bg-brand-vert/90 disabled:opacity-50"
    >
      <CheckCircle size={18} />
      {loading ? 'En cours…' : 'Confirmer réception'}
    </button>
  );
}
