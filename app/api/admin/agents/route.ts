import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/agents
 * Récupère tous les agents (admin uniquement)
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non configuré' },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('shamar_user');
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = JSON.parse(Buffer.from(userCookie.value, 'base64').toString());
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('agents')
      .select(`
        *,
        user:users!agents_user_id_fkey(id, email, full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des agents' },
        { status: 500 }
      );
    }

    return NextResponse.json({ agents: data || [] });
  } catch (error) {
    console.error('GET /api/admin/agents error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/agents
 * Crée un nouvel agent (admin uniquement)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase non configuré' },
        { status: 503 }
      );
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('shamar_user');
    if (!userCookie) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const user = JSON.parse(Buffer.from(userCookie.value, 'base64').toString());
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const user_id = formData.get('user_id') as string;
    const department = formData.get('department') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const notes = formData.get('notes') as string;
    const photo = formData.get('photo') as File | null;

    if (!user_id || !department) {
      return NextResponse.json(
        { error: 'user_id et department sont requis' },
        { status: 400 }
      );
    }

    let photo_url: string | null = null;

    // Upload de la photo vers Supabase Storage si fournie
    if (photo && photo.size > 0) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${user_id}-${Date.now()}.${fileExt}`;
      const filePath = `agents/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, photo, {
          cacheControl: '3600',
          upsert: false,
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);
        photo_url = urlData.publicUrl;
      }
    }

    const { data, error } = await (supabase as any)
      .from('agents')
      .insert({
        user_id,
        department,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
        photo_url,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'agent' },
        { status: 500 }
      );
    }

    return NextResponse.json({ agent: data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/agents error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

