import { requireSeller } from '@/lib/auth-guard';
import Link from 'next/link';
import ProductFormClient from '@/components/ProductFormClient';
import { ArrowLeft, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerProductNewPage() {
  await requireSeller();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <Link
              href="/dashboard/seller/products"
              className="inline-flex items-center gap-2 text-shamar-body font-medium text-gray-500 hover:text-primary-600 mb-shamar-24 transition-colors"
            >
              <ArrowLeft size={20} />
              Retour aux produits
            </Link>
            <div className="flex items-center gap-shamar-16 mb-2">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <Package className="text-primary-600" size={28} />
              </div>
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                  Nouveau <span className="text-primary-600">produit</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium mt-1">
                  Ajoutez un produit à votre catalogue
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24 md:p-shamar-32">
            <ProductFormClient />
          </div>
        </div>
      </div>
    </div>
  );
}
