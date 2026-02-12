import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getVendorByUserId } from '@/services/vendor.service';
import { createDocument } from '@/services/document.service';
import { updateVendorStatusAuto } from '@/services/vendorStatus.service';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Configuration Supabase manquante' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file || !type) {
      return NextResponse.json(
        { error: 'Fichier et type sont requis' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux (max 5MB)' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Formats acceptés: PDF, JPEG, PNG' },
        { status: 400 }
      );
    }

    // Récupérer le vendor
    const vendor = await getVendorByUserId(user.id);
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendeur non trouvé' },
        { status: 404 }
      );
    }

    // Upload vers Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${vendor.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `vendor-documents/${fileName}`;

    // Convertir File en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vendor-documents')
      .upload(filePath, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload du fichier' },
        { status: 500 }
      );
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabase.storage
      .from('vendor-documents')
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;

    // Créer l'enregistrement dans la table documents
    const document = await createDocument(
      vendor.id,
      type as 'rccm' | 'id_fiscal' | 'registre_commerce' | 'autre' | 'id_card' | 'passport' | 'selfie' | 'proof_of_address',
      fileUrl
    );

    if (!document) {
      // Supprimer le fichier uploadé si la création du document échoue
      await supabase.storage.from('vendor-documents').remove([filePath]);
      return NextResponse.json(
        { error: 'Erreur lors de la création de l\'enregistrement' },
        { status: 500 }
      );
    }

    // Mettre à jour automatiquement le statut du vendor
    await updateVendorStatusAuto(user.id);

    return NextResponse.json({ document }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/seller/documents/upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du document' },
      { status: 500 }
    );
  }
}
