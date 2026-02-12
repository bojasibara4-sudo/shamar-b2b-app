'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send, User, Package } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

interface Conversation {
  order_id: string;
  other_user: {
    id: string;
    email: string;
    full_name?: string;
    company_name?: string;
  };
  last_message: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
  messages: Array<{
    id: string;
    content: string;
    sender_id: string;
    recipient_id: string;
    created_at: string;
    is_read: boolean;
    sender: {
      id: string;
      email: string;
      full_name?: string;
      company_name?: string;
    };
  }>;
}

export default function SellerMessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedOrderId) {
      loadMessages(selectedOrderId);
    }
  }, [selectedOrderId]);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/messages/list');
      const data = await response.json();
      
      if (response.ok && data.conversations) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !selectedOrderId) {
          setSelectedOrderId(data.conversations[0].order_id);
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (orderId: string) => {
    try {
      const response = await fetch(`/api/messages/list?order_id=${orderId}`);
      const data = await response.json();
      
      if (response.ok && data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedOrderId || !newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedOrderId,
          content: newMessage.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewMessage('');
        loadMessages(selectedOrderId);
        loadConversations();
      } else {
        alert(data.error || 'Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const selectedConversation = conversations.find(c => c.order_id === selectedOrderId);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                  <span className="text-primary-600">Messages</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium">Communiquez avec les acheteurs</p>
              </div>
              <LogoutButton />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-shamar-48 text-gray-500 font-medium">Chargement...</div>
          ) : conversations.length === 0 ? (
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-48 text-center">
              <MessageCircle size={48} className="mx-auto text-gray-400 mb-shamar-16" />
              <p className="text-gray-600 font-medium">Aucune conversation</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-shamar-24">
              <div className="lg:col-span-1 bg-gray-0 rounded-shamar-md shadow-shamar-soft border border-gray-200">
                <div className="p-shamar-24 border-b border-gray-200">
                  <h2 className="font-semibold text-shamar-h3 text-gray-900">Conversations</h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {conversations.map((conv) => (
                    <button
                      key={conv.order_id}
                      onClick={() => setSelectedOrderId(conv.order_id)}
                      className={`w-full p-shamar-16 text-left hover:bg-gray-50 transition-colors ${
                        selectedOrderId === conv.order_id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-400" />
                          <span className="text-shamar-caption font-mono text-gray-600 font-medium">
                            #{conv.order_id.slice(0, 8)}
                          </span>
                        </div>
                        {conv.unread_count > 0 && (
                          <span className="bg-primary-600 text-gray-0 text-shamar-caption font-semibold rounded-full px-2.5 py-1">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-shamar-body font-semibold text-gray-900 truncate">
                        {conv.other_user?.company_name || conv.other_user?.full_name || conv.other_user?.email || 'Utilisateur'}
                      </p>
                      <p className="text-shamar-small text-gray-500 truncate mt-1 font-medium">
                        {conv.last_message.content}
                      </p>
                      <p className="text-shamar-caption text-gray-400 mt-1 font-medium">
                        {new Date(conv.last_message.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-gray-0 rounded-shamar-md shadow-shamar-soft border border-gray-200 flex flex-col" style={{ height: '600px' }}>
                {selectedConversation ? (
                  <>
                    <div className="p-shamar-24 border-b border-gray-200">
                      <div className="flex items-center gap-shamar-12">
                        <User size={20} className="text-gray-400" />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-shamar-h4">
                            {selectedConversation.other_user?.company_name || selectedConversation.other_user?.full_name || selectedConversation.other_user?.email || 'Utilisateur'}
                          </h3>
                          <p className="text-shamar-small text-gray-500 font-medium">
                            Commande #{selectedConversation.order_id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-shamar-24 space-y-shamar-16">
                      {messages.map((msg) => {
                        const isSent = msg.sender_id !== selectedConversation.other_user.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-shamar-md p-shamar-16 ${
                                isSent
                                  ? 'bg-primary-600 text-gray-0 rounded-tr-none'
                                  : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-tl-none'
                              }`}
                            >
                              <p className="text-shamar-body font-medium">{msg.content}</p>
                              <p className={`text-shamar-small mt-1.5 ${isSent ? 'text-primary-100' : 'text-gray-500'} font-medium`}>
                                {new Date(msg.created_at).toLocaleString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-shamar-24 border-t border-gray-200">
                      <div className="flex gap-shamar-12">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                          placeholder="Écrire votre message..."
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900 font-medium"
                          disabled={sending}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={sending || !newMessage.trim()}
                          className="px-shamar-24 py-3 bg-gray-900 text-gray-0 font-semibold rounded-shamar-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                          <Send size={18} />
                          Envoyer
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 font-medium">
                    Sélectionnez une conversation
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
