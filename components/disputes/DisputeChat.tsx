'use client';

import { useState, useEffect, useRef } from 'react';

export default function DisputeChat({ disputeId, canSend }: { disputeId: string; canSend: boolean }) {
  const [messages, setMessages] = useState<{ id: string; message: string; sender_id: string; sender?: { full_name?: string; email?: string }; created_at: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = () => {
    fetch(`/api/disputes/${disputeId}/messages`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [disputeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !canSend || sending) return;
    setSending(true);
    try {
      await fetch(`/api/disputes/${disputeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() }),
      });
      setNewMessage('');
      load();
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-4 text-slate-500 text-sm">Chargement du chat...</div>;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm">Chat</div>
      <div className="max-h-64 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && <p className="text-slate-500 text-sm">Aucun message.</p>}
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col">
            <span className="text-xs text-slate-400">{m.sender?.full_name || m.sender?.email || m.sender_id?.slice(0, 8)} — {new Date(m.created_at).toLocaleString('fr-FR')}</span>
            <p className="text-slate-800">{m.message}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {canSend && (
        <form onSubmit={send} className="p-3 border-t border-slate-200 flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Votre message..."
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
          <button type="submit" disabled={sending || !newMessage.trim()} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold disabled:opacity-50">
            Envoyer
          </button>
        </form>
      )}
    </div>
  );
}
