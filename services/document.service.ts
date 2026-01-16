/**
 * Service de gestion des documents
 * Gère l'upload et la validation des documents légaux
 */

import { createClient } from '@/lib/supabase/server';

export type DocumentType = 'rccm' | 'id_fiscal' | 'registre_commerce' | 'autre';
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Document {
  id: string;
  vendor_id: string;
  type: DocumentType;
  file_url: string;
  status: DocumentStatus;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Crée un document pour un vendor
 */
export async function createDocument(
  vendorId: string,
  type: DocumentType,
  fileUrl: string
): Promise<Document | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('documents')
      .insert({
        vendor_id: vendorId,
        type,
        file_url: fileUrl,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating document:', error);
      return null;
    }

    return data as Document;
  } catch (error) {
    console.error('Error creating document:', error);
    return null;
  }
}

/**
 * Récupère les documents d'un vendor
 */
export async function getVendorDocuments(vendorId: string): Promise<Document[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('documents')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting vendor documents:', error);
      return [];
    }

    return (data || []) as Document[];
  } catch (error) {
    console.error('Error getting vendor documents:', error);
    return [];
  }
}

/**
 * Met à jour le statut d'un document (admin seulement)
 */
export async function updateDocumentStatus(
  documentId: string,
  status: DocumentStatus,
  rejectionReason?: string
): Promise<boolean> {
  const supabase = await createClient();

  try {
    const updateData: { status: DocumentStatus; rejection_reason?: string } = {
      status,
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    } else if (status === 'approved') {
      updateData.rejection_reason = undefined;
    }

    const { error } = await (supabase as any)
      .from('documents')
      .update(updateData)
      .eq('id', documentId);

    if (error) {
      console.error('Error updating document status:', error);
      return false;
    }

    // Si le document est approuvé, vérifier si tous les documents sont approuvés
    // et mettre à jour le statut du vendor si nécessaire
    if (status === 'approved') {
      const { data: document } = await (supabase as any)
        .from('documents')
        .select('vendor_id')
        .eq('id', documentId)
        .single();

      if (document) {
        await checkAndVerifyVendor(document.vendor_id);
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating document status:', error);
    return false;
  }
}

/**
 * Vérifie si tous les documents requis sont approuvés et vérifie le vendor
 */
async function checkAndVerifyVendor(vendorId: string): Promise<void> {
  const supabase = await createClient();

  try {
    const { data: documents } = await (supabase as any)
      .from('documents')
      .select('status, type')
      .eq('vendor_id', vendorId);

    if (!documents || documents.length === 0) return;

    // Documents requis minimaux : RCCM + ID Fiscal
    const hasRCCM = documents.some(
      (doc: any) => doc.status === 'approved' && doc.type === 'rccm'
    );
    const hasIDFiscal = documents.some(
      (doc: any) => doc.status === 'approved' && doc.type === 'id_fiscal'
    );

    // Si tous les documents requis sont approuvés, vérifier le vendor
    if (hasRCCM && hasIDFiscal) {
      const { error } = await (supabase as any)
        .from('vendors')
        .update({ status: 'verified' })
        .eq('id', vendorId);

      if (!error) {
        // Attribuer le badge "Vendeur Vérifié"
        const { assignBadgesAuto } = await import('./badge.service');
        await assignBadgesAuto(vendorId);
      }
    }
  } catch (error) {
    console.error('Error checking vendor verification:', error);
  }
}

/**
 * Récupère tous les documents en attente (admin)
 */
export async function getPendingDocuments(): Promise<Document[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await (supabase as any)
      .from('documents')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error getting pending documents:', error);
      return [];
    }

    return (data || []) as Document[];
  } catch (error) {
    console.error('Error getting pending documents:', error);
    return [];
  }
}
