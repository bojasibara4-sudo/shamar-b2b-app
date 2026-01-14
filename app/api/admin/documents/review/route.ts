import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { updateDocumentStatus, getVendorDocuments } from '@/services/document.service';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { updateVendorStatusAuto } from '@/services/vendorStatus.service';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { documentId, status, rejectionReason } = body;

    if (!documentId || !status) {
      return NextResponse.json(
        { error: 'documentId et status sont requis' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status invalide. Utiliser "approved" ou "rejected"' },
        { status: 400 }
      );
    }

    // Vérifier que le document existe et récupérer le vendor_id
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configuration Supabase manquante' },
        { status: 500 }
      );
    }

    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('vendor_id')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut du document
    const success = await updateDocumentStatus(
      documentId,
      status as 'approved' | 'rejected',
      rejectionReason
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour du document' },
        { status: 500 }
      );
    }

    // Récupérer le user_id du vendor pour mettre à jour le statut
    const { data: vendor } = await supabase
      .from('vendors')
      .select('user_id')
      .eq('id', document.vendor_id)
      .single();

    if (vendor) {
      // Mettre à jour automatiquement le statut du vendor
      await updateVendorStatusAuto(vendor.user_id);
    }

    // Récupérer le document mis à jour
    const { data: updatedDocument } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    return NextResponse.json({ document: updatedDocument });
  } catch (error) {
    console.error('Error in PUT /api/admin/documents/review:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la validation du document' },
      { status: 500 }
    );
  }
}
