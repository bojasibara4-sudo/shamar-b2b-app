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
      router.push('/dashboard');
    }
  }, [profile, authLoading, router]);
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
    return null;
  }

  return (
    <AuthGuard>
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Agents</h1>
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
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <UserPlus size={20} />
          Ajouter un agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-4">
              {agent.photo_url ? (
                <img
                  src={agent.photo_url}
                  alt={agent.user?.full_name || 'Agent'}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserPlus size={32} className="text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {agent.user?.full_name || agent.user?.email || 'Agent'}
                </h3>
                <p className="text-sm text-gray-500">{agent.department}</p>
              </div>
            </div>

            {agent.phone && (
              <p className="text-sm text-gray-600 mb-2">📞 {agent.phone}</p>
            )}
            {agent.address && (
              <p className="text-sm text-gray-600 mb-2">📍 {agent.address}</p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(agent)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100"
              >
                <Edit2 size={16} />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(agent.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded hover:bg-red-100"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {editingAgent ? 'Modifier l\'agent' : 'Nouvel agent'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Utilisateur
                </label>
                <input
                  type="text"
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Département
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  {editingAgent ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAgent(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AuthGuard>
  );
}

