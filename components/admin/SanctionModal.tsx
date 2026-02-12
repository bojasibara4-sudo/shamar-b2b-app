'use client';

import { useState } from 'react';

interface SanctionModalProps {
  userId: string;
  userEmail: string;
  sanctionType?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: string, reason: string) => Promise<void>;
}

export default function SanctionModal({
  userId,
  userEmail,
  sanctionType = 'sanction',
  isOpen,
  onClose,
  onConfirm,
}: SanctionModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setLoading(true);
    try {
      await onConfirm(sanctionType, reason.trim());
      setReason('');
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Confirmer la sanction</h3>
        <p className="text-sm text-slate-600 mb-4">{userEmail}</p>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700 mb-2">Motif</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900"
            rows={3}
            required
          />
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'En cours...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
