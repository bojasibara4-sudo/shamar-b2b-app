import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

export const dynamic = 'force-dynamic';

export default async function SellerLeadsPage() {
  requireSeller();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
              <p className="mt-2 text-gray-600">
                Gérez vos leads et opportunités commerciales
              </p>
            </div>
            <LogoutButton />
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">
            Interface de gestion des leads à venir.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

