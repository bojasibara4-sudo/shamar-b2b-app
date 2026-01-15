import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export default async function AdminOffersPage() {
  requireAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestion des Offres
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez les offres et propositions de la plateforme
              </p>
            </div>
            <LogoutButton />
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">
            Interface de gestion des offres à venir.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

