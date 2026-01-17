import { requireSeller } from '@/lib/auth-guard';
import ProductFormClient from '@/components/ProductFormClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  await requireSeller();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="mb-6">
          <Link
            href="/dashboard/seller/products"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux produits
          </Link>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            Créer un <span className="text-indigo-600">nouveau produit</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium mb-8">
            Ajoutez un nouveau produit à votre catalogue
          </p>
          <ProductFormClient />
        </div>
      </div>
    </div>
  );
}
