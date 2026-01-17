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
    return null;
  }

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Gestion des <span className="text-orange-600">Agents</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
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
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-black"
            >
              <UserPlus size={20} />
              Ajouter un agent
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-[2rem] shadow-sm p-6 border border-slate-200 hover:shadow-xl transition-all"
            >
            <div className="flex items-center gap-4 mb-4">
              {agent.photo_url ? (
                <img
                  src={agent.photo_url}
                  alt={agent.user?.full_name || 'Agent'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-slate-200">
                  <UserPlus size={32} className="text-slate-400" />
                </div>
              )}
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  {agent.user?.full_name || agent.user?.email || 'Agent'}
                </h3>
                <p className="text-sm text-slate-500 font-medium">{agent.department}</p>
              </div>
            </div>

            {agent.phone && (
              <p className="text-sm text-slate-600 mb-2 font-medium">📞 {agent.phone}</p>
            )}
            {agent.address && (
              <p className="text-sm text-slate-600 mb-2 font-medium">📍 {agent.address}</p>
            )}

            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleEdit(agent)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all font-black text-sm"
              >
                <Edit2 size={16} />
                Modifier
              </button>
              <button
                onClick={() => handleDelete(agent.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all font-black text-sm"
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
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              {editingAgent ? 'Modifier l\'agent' : 'Nouvel agent'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-black text-slate-900 mb-2">
                  ID Utilisateur
                </label>
                <input
                  type="text"
                  value={formData.user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, user_id: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Département
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Téléphone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Adresse
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-slate-900 mb-2">
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
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-black"
                >
                  {editingAgent ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAgent(null);
                  }}
                  className="flex-1 bg-slate-100 text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-200 transition-all font-black"
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
    </AuthGuard>
  );
}

