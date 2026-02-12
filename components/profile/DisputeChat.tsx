'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

type Message = { id: string; content: string; sender_id: string; created_at: string; sender?: { full_name?: string; email?: string } };

export default function DisputeChat({ disputeId, messages: initialMessages }: { disputeId: string; messages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/disputes/${disputeId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages)) setMessages(data.messages);
        else router.refresh();
        setContent('');
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-xl border border-slate-200 max-h-80 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">Aucun message. Démarrez la conversation.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex flex-col">
              <p className="text-slate-700 text-sm">{m.content}</p>
              <span className="text-slate-400 text-xs mt-0.5">
                {m.sender?.full_name || m.sender?.email || 'Utilisateur'} · {new Date(m.created_at).toLocaleString('fr-FR')}
              </span>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrire un message…"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-vert/30 focus:border-brand-vert outline-none"
        />
        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="p-2 rounded-xl bg-brand-vert text-white hover:bg-brand-vert/90 disabled:opacity-50 disabled:pointer-events-none"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
