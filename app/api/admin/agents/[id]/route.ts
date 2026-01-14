import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';

/**
 * PUT /api/admin/agents/[id]
 * Met à jour un agent (admin uniquement)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
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
    const department = formData.get('department') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const notes = formData.get('notes') as string;
    const photo = formData.get('photo') as File | null;

    const updateData: Record<string, unknown> = {};
    if (department) updateData.department = department;
    if (phone !== null) updateData.phone = phone || null;
    if (address !== null) updateData.address = address || null;
    if (notes !== null) updateData.notes = notes || null;

    // Upload de la photo si fournie
    if (photo && photo.size > 0) {
      const { data: existingAgent } = await supabase
        .from('agents')
        .select('user_id')
        .eq('id', params.id)
        .single();

      if (existingAgent) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${existingAgent.user_id}-${Date.now()}.${fileExt}`;
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
          updateData.photo_url = urlData.publicUrl;
        }
      }
    }

    const { data, error } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }

    return NextResponse.json({ agent: data });
  } catch (error) {
    console.error('PUT /api/admin/agents/[id] error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/agents/[id]
 * Supprime un agent (admin uniquement)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();
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

    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/agents/[id] error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

