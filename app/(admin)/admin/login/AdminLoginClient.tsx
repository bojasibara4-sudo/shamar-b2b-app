'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLoginClient({ returnUrl = '/admin/overview' }: { returnUrl?: string }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendOtp() {
    if (!email) {
      setError('Email requis');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${returnUrl}`,
      },
    });
    setLoading(false);
    if (!otpError) setStep('otp');
    else setError(otpError.message);
  }

  async function verifyOtp() {
    if (!code) {
      setError('Code requis');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });
    setLoading(false);
    if (!verifyError) {
      window.location.href = returnUrl;
    } else {
      setError(verifyError.message);
    }
  }

  return (
    <div className="bg-gray-0 p-shamar-32 rounded-shamar-md shadow-shamar-soft w-full max-w-md border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Connexion administration
      </h1>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Utilisez un compte administrateur Shamar.
      </p>
      {error && (
        <div className="mb-shamar-16 p-shamar-12 bg-danger-500/10 border border-danger-500/30 rounded-shamar-md text-danger-500 text-shamar-small font-medium">
          {error}
        </div>
      )}
      {step === 'email' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@exemple.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900"
              disabled={loading}
            />
          </div>
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-primary-600 text-gray-0 py-2 px-4 rounded-shamar-md hover:bg-primary-700 disabled:opacity-50 font-semibold"
          >
            {loading ? 'Envoi...' : 'Recevoir le code'}
          </button>
        </div>
      )}
      {step === 'otp' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            Code envoyé à <strong>{email}</strong>
          </p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code à 6 chiffres"
            maxLength={8}
            className="w-full px-3 py-2 border border-gray-200 rounded-shamar-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-gray-900"
            disabled={loading}
          />
          <button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full bg-primary-600 text-gray-0 py-2 px-4 rounded-shamar-md hover:bg-primary-700 disabled:opacity-50 font-semibold"
          >
            {loading ? 'Vérification...' : 'Se connecter'}
          </button>
          <button
            type="button"
            onClick={() => setStep('email')}
            className="w-full text-sm text-gray-600 hover:text-gray-900"
            disabled={loading}
          >
            Changer d’email
          </button>
        </div>
      )}
      <div className="mt-shamar-24 text-center">
        <Link href="/" className="text-shamar-small text-primary-600 hover:underline font-medium">
          Retour au site
        </Link>
      </div>
    </div>
  );
}
