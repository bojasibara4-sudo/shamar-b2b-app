import { Ship } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function NegoceSellerShipmentsPage() {
  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Expéditions</h1>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft text-center">
            <Ship className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
            <p className="text-gray-500">Aucune expédition en cours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
