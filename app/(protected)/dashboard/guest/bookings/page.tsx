import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GuestBookingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const bookings: any[] = [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Mes réservations</h1>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            {bookings.length > 0 ? (
              <div className="space-y-shamar-16">
                {bookings.map((b: any) => (
                  <Link
                    key={b.id}
                    href={`/dashboard/guest/bookings/${b.id}`}
                    className="block p-shamar-24 rounded-shamar-md bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{b.property_title}</p>
                        <p className="text-shamar-small text-gray-500">{b.check_in} → {b.check_out} {b.city ? `• ${b.city}` : ''}</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded-shamar-sm text-shamar-caption font-semibold ${
                          b.status === 'completed' ? 'bg-success-500/20 text-gray-800' :
                          b.status === 'pending' ? 'bg-warning-500/20 text-gray-800' :
                          'bg-gray-200 text-gray-700'
                        }`}>{b.status}</span>
                      </div>
                      <p className="font-semibold text-gray-900">{Number(b.total_amount || 0).toLocaleString()} {b.currency || 'FCFA'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
                <p className="text-gray-500 font-medium">Aucune réservation</p>
                <Link href="/host" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
                  Réserver un logement
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
