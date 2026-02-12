import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Key, Shield, Smartphone, LogOut, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

/**
 * Sécurité — sous « Pour moi » (spec: changer MDP, 2FA, appareils, sessions, supprimer compte)
 * Hub vers paramètres sécurité.
 */
export default async function ProfileSecurityPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const items = [
    { href: '/settings/security', icon: Key, label: 'Changer mot de passe', sub: 'Mettre à jour votre mot de passe' },
    { href: '/settings/security', icon: Shield, label: 'Authentification 2FA', sub: 'Double facteur (à brancher)' },
    { href: '/settings/security', icon: Smartphone, label: 'Appareils connectés', sub: 'Sessions actives' },
    { href: '/settings/security', icon: LogOut, label: 'Sessions', sub: 'Déconnexion sur autres appareils' },
    { href: '/settings/security', icon: Trash2, label: 'Supprimer le compte', sub: 'Action irréversible (à brancher)' },
  ];

  return (
    <div className="max-w-shamar-container mx-auto px-4 py-shamar-24">
      <Link href="/profile" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 mb-shamar-24">← Retour Pour moi</Link>
      <h1 className="text-shamar-h2 text-gray-900">Sécurité & sessions</h1>
      <p className="text-shamar-body text-gray-500 mt-1">Mot de passe, 2FA, appareils, sessions actives.</p>

      <div className="mt-shamar-24 bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
        <div className="divide-y divide-gray-200">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-shamar-16 p-shamar-16 hover:bg-gray-50 transition-colors"
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
