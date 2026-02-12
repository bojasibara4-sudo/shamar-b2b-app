import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Callback auth Supabase : magic link / OTP par email.
 * Échange le code pour une session et redirige vers "/" ou la page demandée.
 * Ne pas rediriger vers /auth/login pour éviter la boucle.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || requestUrl.searchParams.get('redirect') || '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const redirectUrl = next.startsWith('/') ? new URL(next, requestUrl.origin) : new URL('/', requestUrl.origin);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
