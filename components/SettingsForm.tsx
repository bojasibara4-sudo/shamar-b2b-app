'use client';

import { useState } from 'react';
import { Bell, Globe, Shield, Moon } from 'lucide-react';

interface SettingsFormProps {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'seller' | 'buyer';
  };
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'fr',
    theme: 'light',
    timezone: 'Africa/Brazzaville',
  });

  return (
    <div className="space-y-8">
      {/* Notifications */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Notifications par email</p>
              <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
            />
          </label>
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Notifications push</p>
              <p className="text-sm text-gray-500">Recevoir des notifications push</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.push}
              onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
            />
          </label>
        </div>
      </div>

      {/* Préférences */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Préférences</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue
            </label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuseau horaire
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Africa/Brazzaville">Africa/Brazzaville (GMT+1)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Sécurité</h2>
        </div>
        <div className="space-y-4">
          <a
            href="/app/profile"
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <p className="font-medium text-gray-900">Changer le mot de passe</p>
            <p className="text-sm text-gray-500">Mettre à jour votre mot de passe</p>
          </a>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
        >
          Enregistrer les paramètres
        </button>
      </div>
    </div>
  );
}
