'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (err) setError(err.message);
    else setSent(true);
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
            Mot de passe oublié ?
          </h1>
          <p className="text-shamar-body text-gray-500 mb-shamar-24">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
          {error && (
            <div className="mb-shamar-16 p-shamar-12 bg-danger-500/10 border border-danger-500/30 rounded-shamar-sm text-shamar-small text-danger-500 font-medium">
              {error}
            </div>
          )}
          {sent ? (
            <div className="p-shamar-16 bg-success-500/10 border border-success-500/30 rounded-shamar-md text-shamar-body text-gray-800">
              <p className="font-semibold mb-1">Email envoyé</p>
              <p className="text-shamar-small">
                Un lien a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-shamar-16">
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@entreprise.com"
                required
              />
              <Button type="submit" disabled={loading} isLoading={loading} className="w-full">
                Envoyer le lien
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
