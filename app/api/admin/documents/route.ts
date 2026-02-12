import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdminLike } from '@/lib/owner-roles';
import { getPendingDocuments, getVendorDocuments } from '@/services/document.service';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (!isAdminLike(user.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    if (status === 'pending') {
      const documents = await getPendingDocuments();
      return NextResponse.json({ documents });
    }

    // Sinon, récupérer tous les documents avec leurs vendors
    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ documents: [] });
    }

    const { data: documents, error } = await supabase
      .from('documents')
      .select(`
        *,
        vendor:vendors!documents_vendor_id_fkey(
          id,
          user_id,
          status,
          user:users!vendors_user_id_fkey(email, full_name, company_name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching documents:', error);
      return NextResponse.json({ documents: [] });
    }

    return NextResponse.json({ documents: documents || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/documents:', error);
    return NextResponse.json({ documents: [] });
  }
}
