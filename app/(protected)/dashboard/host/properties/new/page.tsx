import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HostPropertyForm from '@/components/host/HostPropertyForm';

export const dynamic = 'force-dynamic';

export default async function HostPropertyNewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-8 max-w-3xl">
      <Link href="/dashboard/host/properties" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium">
        <ArrowLeft size={20} /> Retour aux logements
      </Link>
      <h1 className="text-3xl font-bold text-white">Ajouter un logement</h1>
      <HostPropertyForm />
    </div>
  );
}
