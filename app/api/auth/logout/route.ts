import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Déconnexion Supabase si disponible
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.warn('Supabase logout error:', error);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: 500 }
    );
  }
}

