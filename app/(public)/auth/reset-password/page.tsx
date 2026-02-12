'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          setError('Session expirée. Veuillez demander un nouveau lien.');
        }
      });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex justify-center pt-shamar-40 pb-shamar-24">
        <Link href="/" className="text-shamar-h2 text-gray-900 font-semibold tracking-tight">
          SHAMAR
        </Link>
      </div>
      <div className="flex-1 flex items-start justify-center px-4 pb-shamar-40">
        <div className="w-full max-w-md bg-gray-0 p-shamar-16 rounded-shamar-md shadow-shamar-soft border border-gray-200">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24"
          >
            <ArrowLeft size={16} />
            Retour à la connexion
          </Link>
          <h1 className="text-shamar-h2 text-gray-900 mb-2">
            Nouveau mot de passe
          </h1>
          <p className="text-shamar-body text-gray-500 mb-shamar-24">
            Choisissez un nouveau mot de passe sécurisé.
          </p>
          {error && (
            <div className="mb-shamar-16 p-shamar-12 bg-danger-500/10 border border-danger-500/30 rounded-shamar-sm text-shamar-small text-danger-500 font-medium">
              {error}
            </div>
          )}
          {success ? (
            <div className="p-shamar-16 bg-success-500/10 border border-success-500/30 rounded-shamar-md text-center">
              <div className="w-12 h-12 bg-success-500/20 rounded-full flex items-center justify-center mx-auto mb-shamar-16">
                <span className="text-2xl">✓</span>
              </div>
              <p className="font-semibold text-shamar-body text-gray-900 mb-1">Mot de passe mis à jour</p>
              <p className="text-shamar-small text-gray-500">Redirection vers la connexion...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-shamar-16">
              <Input
                id="password"
                label="Nouveau mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
              <Input
                id="confirm"
                label="Confirmer le mot de passe"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                disabled={loading}
              />
              <Button type="submit" disabled={loading} isLoading={loading} className="w-full">
                Mettre à jour
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
