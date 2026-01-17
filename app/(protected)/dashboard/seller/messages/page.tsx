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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                <span className="text-indigo-600">Messages</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">Communiquez avec les acheteurs</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-medium">Chargement...</div>
        ) : conversations.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 text-center">
            <MessageCircle size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 font-medium">Aucune conversation</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des conversations */}
            <div className="lg:col-span-1 bg-white rounded-[2rem] shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="font-black text-xl text-slate-900">Conversations</h2>
              </div>
              <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.order_id}
                  onClick={() => setSelectedOrderId(conv.order_id)}
                  className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                    selectedOrderId === conv.order_id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-slate-400" />
                      <span className="text-xs font-mono text-slate-600 font-medium">
                        #{conv.order_id.slice(0, 8)}
                      </span>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="bg-indigo-600 text-white text-xs font-black rounded-full px-2.5 py-1">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-black text-slate-900 truncate">
                    {conv.other_user?.company_name || conv.other_user?.full_name || conv.other_user?.email || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-1 font-medium">
                    {conv.last_message.content}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {new Date(conv.last_message.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </button>
              ))}
            </div>
          </div>

            {/* Chat */}
            <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col" style={{ height: '600px' }}>
              {selectedConversation ? (
                <>
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-slate-400" />
                      <div>
                        <h3 className="font-black text-slate-900 text-lg">
                          {selectedConversation.other_user?.company_name || selectedConversation.other_user?.full_name || selectedConversation.other_user?.email || 'Utilisateur'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Commande #{selectedConversation.order_id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg) => {
                      const isSent = msg.sender_id !== selectedConversation.other_user.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-[1.5rem] p-4 ${
                              isSent
                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm font-medium">{msg.content}</p>
                            <p className={`text-xs mt-1.5 ${isSent ? 'text-indigo-100' : 'text-slate-500'} font-medium`}>
                              {new Date(msg.created_at).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-6 border-t border-slate-200">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        placeholder="Écrire votre message..."
                        className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                        disabled={sending}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-black shadow-md"
                      >
                        <Send size={18} />
                        Envoyer
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 font-medium">
                  Sélectionnez une conversation
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
