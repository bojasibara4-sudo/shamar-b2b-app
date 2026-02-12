import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/badges — Liste publique des badges (Bronze, Silver, Gold, Diamond, etc.)
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from('badges')
      .select('id, code, label, description, category, level_required, created_at')
      .order('level_required', { ascending: true });

    if (error) {
      console.error('Error fetching badges:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des badges' }, { status: 500 });
    }

    return NextResponse.json({ badges: data || [] });
  } catch (err) {
    console.error('GET /api/badges:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
