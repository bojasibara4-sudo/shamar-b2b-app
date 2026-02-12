import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminKycSellerPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  redirect(`/dashboard/admin/documents?seller=${sellerId}`);
}
