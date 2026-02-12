'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { UserPlus, Upload, Trash2, Edit2 } from 'lucide-react';

interface Agent {
  id: string;
  user_id: string;
  department: string;
  photo_url?: string;
  phone?: string;
  address?: string;
  notes?: string;
  user?: {
    email: string;
    full_name?: string;
  };
}

export default function AgentsPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Vérification du rôle côté client
  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== 'admin')) {
      window.location.href = '/dashboard';
    }
  }, [profile, authLoading]);
  const [formData, setFormData] = useState({
    user_id: '',
    department: '',
    phone: '',
    address: '',
    notes: '',
    photo: null as File | null,
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/admin/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('notes', formData.notes);
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const url = editingAgent
        ? `/api/admin/agents/${editingAgent.id}`
        : '/api/admin/agents';
      const method = editingAgent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({
          user_id: '',
          department: '',
          phone: '',
          address: '',
          notes: '',
          photo: null,
        });
        setEditingAgent(null);
        fetchAgents();
      }
    } catch (error) {
      console.error('Error saving agent:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) return;

    try {
      const response = await fetch(`/api/admin/agents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAgents();
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      user_id: agent.user_id,
      department: agent.department,
      phone: agent.phone || '',
      address: agent.address || '',
      notes: agent.notes || '',
      photo: null,
    });
    setShowModal(true);
  };

  if (authLoading || loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </AuthGuard>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Accès refusé</p>
          <p className="text-sm text-gray-400">Cette page est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Gestion des <span className="text-primary-600">Agents</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Gérez les agents et équipes de la plateforme
              </p>
            </div>
            <button
              onClick={() => {
                setEditingAgent(null);
                setFormData({
                  user_id: '',
                  department: '',
                  phone: '',
                  address: '',
                  notes: '',
                  photo: null,
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 bg-primary-600 text-gray-0 px-shamar-24 py-shamar-12 rounded-shamar-md hover:bg-primary-700 transition-colors font-semibold"
            >
              <UserPlus size={20} />
              Ajouter un agent
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-shamar-24">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-gray-0 rounded-shamar-md shadow-shamar-soft p-shamar-24 border border-gray-200 hover:shadow-md transition-shadow"
            >
            <div className="flex items-center gap-shamar-16 mb-shamar-16">
              {agent.photo_url ? (
                <img
                  src={agent.photo_url}
                  alt={agent.user?.full_name || 'Agent'}
                  className="w-16 h-16 rounded-shamar-md object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-shamar-md bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <UserPlus size={32} className="text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 text-shamar-body">
                  {agent.user?.full_name || agent.user?.email || 'Agent'}
                </h3>
                <p className="text-shamar-small text-gray-500 font-medium">{agent.department}</p>
              </div>
            </div>

            {agent.phone && (
              <p className="text-shamar-small text-gray-600 mb-2 font-medium">📞 {agent.phone}</p>
            )}
            {agent.address && (
              <p className="text-shamar-small text-gray-600 mb-2 font-medium">📍 {agent.address}</p>
            )}

            <div className="flex gap-2 mt-shamar-16 pt-shamar-16 border-t border-gray-200">
              <button
                onClick={() => handleEdit(agent)}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-50 text-primary-600 px-shamar-16 py-shamar-8 rounded-shamar-md hover:bg-primary-100 transition-colors font-semibold text-shamar-small"
              >
                <Edit2 size={16} />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(agent.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-danger-500/10 text-danger-500 px-shamar-16 py-shamar-8 rounded-shamar-md hover:bg-danger-500/20 transition-colors font-semibold text-shamar-small"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-0 rounded-shamar-md p-shamar-32 max-w-md w-full shadow-shamar-soft border border-gray-200">
            <h2 className="text-shamar-h2 font-semibold text-gray-900 mb-shamar-24">
              {editingAgent ? 'Modifier l\'agent' : 'Nouvel agent'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-shamar-20">
              <div>
                <label className="block text-shamar-small font-semibold text-gray-900 mb-2">
                  ID Utilisateur
                </label>
                <input
                  type="text"
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: e.target.value })
                  }
                  className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-shamar-small font-semibold text-gray-900 mb-2">
                  Département
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-shamar-small font-semibold text-gray-900 mb-2">
                  Téléphone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-gray-900"
                />
              </div>

              <div>
                <label className="block text-shamar-small font-semibold text-gray-900 mb-2">
                  Adresse
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-gray-900"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-shamar-small font-semibold text-gray-900 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-gray-900"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-shamar-small font-semibold text-gray-900 mb-2">
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      photo: e.target.files?.[0] || null,
                    })
                  }
                  className="w-full px-shamar-16 py-shamar-12 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-gray-900"
                />
              </div>

              <div className="flex gap-shamar-12 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-gray-0 px-shamar-24 py-shamar-12 rounded-shamar-md hover:bg-primary-700 transition-colors font-semibold"
                >
                  {editingAgent ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAgent(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-900 px-shamar-24 py-shamar-12 rounded-shamar-md hover:bg-gray-200 transition-colors font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
    </div>
    </AuthGuard>
  );
}

