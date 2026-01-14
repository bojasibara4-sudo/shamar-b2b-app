import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non configuré' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tags = searchParams.get('tags')?.split(',') || [];
    const limit = parseInt(searchParams.get('limit') || '10');

    // Recherche basée sur les tags dans le nom ou la description
    let query = supabase
      .from('products')
      .select('*')
      .limit(limit);

    if (tags.length > 0) {
      // Recherche par mots-clés dans le nom ou la description
      const searchTerms = tags.map(tag => tag.trim().toLowerCase()).filter(Boolean);
      if (searchTerms.length > 0) {
        // Utiliser ilike pour la recherche insensible à la casse
        const orConditions = searchTerms.map(term => `name.ilike.%${term}%,description.ilike.%${term}%`).join(',');
        query = query.or(orConditions);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Error searching products' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: data || [] });
  } catch (error) {
    console.error('Search products error:', error);
    return NextResponse.json(
      { error: 'Error searching products' },
      { status: 500 }
    );
  }
}
