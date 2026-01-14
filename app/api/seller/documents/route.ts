import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getVendorByUserId } from '@/services/vendor.service';
import { getVendorDocuments } from '@/services/document.service';

export async function GET() {
  const user = getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  if (user.role !== 'seller') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  try {
    const vendor = await getVendorByUserId(user.id);
    if (!vendor) {
      return NextResponse.json({ documents: [] });
    }

    const documents = await getVendorDocuments(vendor.id);
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Error in GET /api/seller/documents:', error);
    return NextResponse.json({ documents: [] });
  }
}
