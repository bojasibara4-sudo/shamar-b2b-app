'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';

type ReportType = 'vendor' | 'product' | 'user';

interface ReportButtonProps {
  reportType: ReportType;
  targetId: string;
  label?: string;
  className?: string;
}

const labels: Record<ReportType, string> = {
  vendor: 'Signaler le vendeur',
  product: 'Signaler ce produit',
  user: 'Signaler cet utilisateur',
};

export function ReportButton({ reportType, targetId, label, className = '' }: ReportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_type: reportType, target_id: targetId, message: message || undefined }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
        setShowForm(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return <span className="text-sm text-slate-500">Signalement envoyé.</span>;
  }

  if (showForm) {
    return (
      <div className="flex flex-col gap-2">
        <textarea
          placeholder="Précisez la raison (optionnel)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full min-h-[80px] px-3 py-2 border border-slate-200 rounded-lg text-sm"
          maxLength={500}
        />
        <div className="flex gap-2">
          <button onClick={submit} disabled={loading} className="px-3 py-1.5 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 disabled:opacity-50">
            {loading ? 'Envoi…' : 'Envoyer le signalement'}
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-slate-600 text-sm hover:underline">
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowForm(true)}
      className={`inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700 hover:underline ${className}`}
    >
      <Flag size={14} /> {label ?? labels[reportType]}
    </button>
  );
}
