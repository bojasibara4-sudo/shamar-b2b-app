import { Ship } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ExporterShipmentsPage() {
  const shipments: any[] = [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Expéditions</h1>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            {shipments.length > 0 ? (
              <div className="space-y-shamar-16">
                {shipments.map((s: any) => (
                  <div key={s.id} className="p-shamar-16 rounded-shamar-md bg-gray-50">
                    <p className="font-semibold text-gray-900">{s.product}</p>
                    <p className="text-shamar-small text-gray-500">{s.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <Ship className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
                <p className="text-gray-500 font-medium">Aucune expédition</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
