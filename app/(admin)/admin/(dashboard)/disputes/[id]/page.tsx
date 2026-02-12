import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/dashboard/admin/disputes/${id}`);
}
