'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ReportButton } from '@/components/security/ReportButton';
import { ArrowLeft } from 'lucide-react';

export default function MessageConversationPage() {
  const params = useParams();
  const { profile } = useAuth();
  const orderId = params.id as string;
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetch(`/api/messages/list?order_id=${orderId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <Link
              href="/messages"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium mb-shamar-16 transition-colors"
            >
              <ArrowLeft size={20} />
              Retour aux messages
            </Link>
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Conversation
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Commande <span className="text-primary-600">#{orderId?.slice(0, 8)}</span>
              </p>
              {profile && messages.length > 0 && (() => {
                const otherUserId = messages.find((m: any) => m.sender_id !== profile.id)?.sender_id;
                return otherUserId ? <div className="mt-3"><ReportButton reportType="user" targetId={otherUserId} className="text-gray-500 hover:text-danger-500" /></div> : null;
              })()}
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            {loading ? (
              <div className="text-center py-shamar-32 text-gray-500 text-shamar-body">Chargement...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-shamar-32">
                <p className="text-gray-500 font-medium text-shamar-body">Aucun message.</p>
              </div>
            ) : (
              <div className="space-y-shamar-16">
                {messages.map((m: any) => {
                  const isMe = profile && m.sender_id === profile.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-shamar-16 rounded-shamar-md ${
                        isMe ? 'bg-primary-600 text-gray-0' : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-shamar-body">{m.content}</p>
                        <p className="text-shamar-small text-gray-500 mt-1">
                          {!isMe && (m.sender?.full_name || m.sender?.email || '—')} • {m.created_at ? new Date(m.created_at).toLocaleString('fr-FR') : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
