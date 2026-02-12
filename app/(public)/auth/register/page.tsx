'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }
    try {
      await signUp(email, password);
      router.push('/auth/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex justify-center pt-shamar-40 pb-shamar-24">
        <Link href="/" className="text-shamar-h2 text-gray-900 font-semibold tracking-tight">
          SHAMAR
        </Link>
      </div>
      <div className="flex-1 flex items-start justify-center px-4 pb-shamar-40">
        <div className="w-full max-w-md bg-gray-0 p-shamar-16 rounded-shamar-md shadow-shamar-soft border border-gray-200">
          <h1 className="text-shamar-h2 text-gray-900 mb-shamar-24 text-center">
            Créer un compte
          </h1>
          {error && (
            <div className="mb-shamar-16 p-shamar-12 bg-danger-500/10 border border-danger-500/30 rounded-shamar-sm text-shamar-small text-danger-500 font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-shamar-16">
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Minimum 6 caractères"
              required
            />
            <Input
              id="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading} isLoading={loading} className="w-full">
              Créer un compte
            </Button>
          </form>
          <div className="mt-shamar-24 text-center">
            <Link
              href="/auth/login"
              className="text-shamar-small text-primary-600 hover:underline"
            >
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
