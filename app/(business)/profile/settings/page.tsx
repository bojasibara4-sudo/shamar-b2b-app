import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Globe, Bell, Palette, MapPin, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const items = [
    { href: '/settings', icon: Globe, label: 'Paramètres généraux', sub: 'Langue, pays, préférences' },
    { href: '/settings/notifications', icon: Bell, label: 'Notifications', sub: 'Commandes, paiements, litiges, messages' },
    { href: '/profile', icon: Palette, label: 'Thème', sub: 'Apparence (à brancher)' },
    { href: '/profile/info', icon: MapPin, label: 'Pays & adresse', sub: 'Modifier dans Infos personnelles' },
    { href: '/profile/security', icon: Shield, label: 'Sécurité', sub: 'Mot de passe, 2FA, sessions' },
  ];

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Pour moi</Link>
      <h1 className="text-shamar-h2 text-gray-900">Paramètres</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Langue, thème, pays, préférences.</p>

      <div className="mt-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
        <div className="divide-y divide-gray-200">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-shamar-16 p-shamar-16 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:ring-inset"
              >
                <Icon size={20} className="text-primary-600 shrink-0" />
                <div>
                  <p className="font-semibold text-shamar-body text-gray-900">{item.label}</p>
                  <p className="text-shamar-small text-gray-500">{item.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
