import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, FileText, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaDocumentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const docs: { type: string; label: string; orderId?: string }[] = [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Documents import</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Factures, BL, packing list, certificats, téléchargements.</p>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h2 className="text-shamar-h3 text-gray-900 mb-shamar-24 flex items-center gap-2">
              <FileText size={22} /> Mes documents
            </h2>
            {docs.length > 0 ? (
              <ul className="space-y-shamar-12">
                {docs.map((d, i) => (
                  <li key={i} className="flex items-center justify-between p-shamar-16 rounded-shamar-md bg-gray-50 border border-gray-200">
                    <span className="font-medium text-gray-900">{d.label}</span>
                    <span className="text-shamar-small text-gray-500">{d.type}</span>
                    <button type="button" className="text-primary-600 font-medium hover:underline flex items-center gap-1">
                      <Download size={16} /> Télécharger
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Aucun document pour le moment. Les factures, BL et packing list apparaîtront ici une fois les commandes expédiées.</p>
            )}
            <Link href="/china/orders" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
              Voir mes commandes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
