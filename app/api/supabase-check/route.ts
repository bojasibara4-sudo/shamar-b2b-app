import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/supabase-check
 * Vérifie que la connexion Supabase est OK (env + accès BDD).
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { connected: false, error: 'Variables manquantes: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      { status: 503 }
    );
  }

  try {
    const supabase = await createClient();
    const { error } = await (supabase as any).from('users').select('id').limit(1).maybeSingle();
    if (error) {
      return NextResponse.json(
        { connected: false, error: error.message, hint: 'Vérifiez que la table public.users existe (migrations Supabase).' },
        { status: 503 }
      );
    }
    return NextResponse.json({ connected: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json(
      { connected: false, error: message },
      { status: 503 }
    );
  }
}
