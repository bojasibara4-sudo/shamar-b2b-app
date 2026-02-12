'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

/* CHAMA Design System — 02-mobile-ui/login/spec: Logo top center, Form card center, CTA primary full width, Secondary ghost */
export default function LoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState<string>('/');

  useEffect(() => {
    const next = searchParams.get('next') || searchParams.get('redirect') || '/';
    setRedirectTo(next);
  }, [searchParams]);

  async function sendOtp() {
    if (!email) {
      setError('Email requis');
      return;
    }
    setLoading(true);
    setError(null);
    const callbackUrl = `${window.location.origin}/auth/callback${redirectTo !== '/' ? `?next=${encodeURIComponent(redirectTo)}` : ''}`;
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl },
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
      window.location.href = redirectTo;
    } else {
      setError(verifyError.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Logo top center */}
      <div className="flex justify-center pt-shamar-40 pb-shamar-24">
        <Link href="/" className="text-shamar-h2 text-gray-900 font-semibold tracking-tight">
          SHAMAR
        </Link>
      </div>

      {/* Form card center */}
      <div className="flex-1 flex items-start justify-center px-4 pb-shamar-40">
        <div className="w-full max-w-md bg-gray-0 p-shamar-16 rounded-shamar-md shadow-shamar-soft border border-gray-200">
          <h1 className="text-shamar-h2 text-gray-900 mb-shamar-24 text-center">
            Connexion
          </h1>

          {error && (
            <div className="mb-shamar-16 p-shamar-12 bg-danger-500/10 border border-danger-500/30 rounded-shamar-sm text-shamar-small text-danger-500 font-medium">
              {error}
            </div>
          )}

          {step === 'email' && (
            <div className="space-y-shamar-16">
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled={loading}
              />
              <Button
                onClick={sendOtp}
                disabled={loading}
                isLoading={loading}
                className="w-full"
              >
                Recevoir le code
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-shamar-16">
              <p className="text-shamar-body text-gray-600 mb-shamar-16">
                Un code a été envoyé à <strong className="text-gray-900">{email}</strong>
              </p>
              <Input
                id="code"
                label="Code reçu par email"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="12345678"
                maxLength={8}
                disabled={loading}
              />
              <Button
                onClick={verifyOtp}
                disabled={loading}
                isLoading={loading}
                className="w-full"
              >
                Se connecter
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep('email')}
                disabled={loading}
                className="w-full"
              >
                Renvoyer un nouveau code
              </Button>
            </div>
          )}

          <div className="mt-shamar-24 flex flex-col items-center gap-shamar-8 text-center">
            <Link
              href="/auth/forgot-password"
              className="text-shamar-small text-primary-600 hover:underline"
            >
              Mot de passe oublié
            </Link>
            <Link
              href="/auth/register"
              className="text-shamar-small text-primary-600 hover:underline"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
