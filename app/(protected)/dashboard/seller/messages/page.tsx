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
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="mt-2 text-gray-600">Communiquez avec les acheteurs</p>
          </div>
          <LogoutButton />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : conversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Aucune conversation</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des conversations */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.order_id}
                  onClick={() => setSelectedOrderId(conv.order_id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedOrderId === conv.order_id ? 'bg-emerald-50 border-l-4 border-emerald-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-400" />
                      <span className="text-xs font-mono text-gray-500">
                        #{conv.order_id.slice(0, 8)}
                      </span>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="bg-emerald-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {conv.other_user?.company_name || conv.other_user?.full_name || conv.other_user?.email || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {conv.last_message.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(conv.last_message.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col" style={{ height: '600px' }}>
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversation.other_user?.company_name || selectedConversation.other_user?.full_name || selectedConversation.other_user?.email || 'Utilisateur'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Commande #{selectedConversation.order_id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isSent = msg.sender_id !== selectedConversation.other_user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isSent
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isSent ? 'text-emerald-100' : 'text-gray-500'}`}>
                            {new Date(msg.created_at).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled={sending}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={sending || !newMessage.trim()}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Send size={16} />
                      Envoyer
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Sélectionnez une conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
