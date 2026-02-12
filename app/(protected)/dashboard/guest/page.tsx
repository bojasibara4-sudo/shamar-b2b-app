import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Calendar, DollarSign, MessageSquare, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GuestDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const bookings: any[] = [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Mon espace Voyageur</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Bienvenue, {user.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-shamar-24">
            <Link href="/dashboard/guest/bookings" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Calendar className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Mes réservations</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{bookings.length}</p>
            </Link>
            <Link href="/payments" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <DollarSign className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Paiements</p>
            </Link>
            <Link href="/messages" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <MessageSquare className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Messages</p>
            </Link>
            <Link href="/dashboard/guest/reviews" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Star className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Avis donnés</p>
            </Link>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Mes réservations</h2>
            {bookings.length > 0 ? (
              <div className="space-y-shamar-16">
                {bookings.map((b: any) => (
                  <Link key={b.id} href={`/dashboard/guest/bookings/${b.id}`} className="block p-shamar-16 rounded-shamar-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <p className="font-medium text-gray-900">{b.property_title}</p>
                    <p className="text-shamar-small text-gray-500">{b.check_in} → {b.check_out} • {b.status}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-shamar-12" />
                <p className="text-gray-500 font-medium">Aucune réservation</p>
                <Link href="/host" className="inline-block mt-shamar-16 text-primary-600 font-semibold hover:underline">
                  Découvrir les logements
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
