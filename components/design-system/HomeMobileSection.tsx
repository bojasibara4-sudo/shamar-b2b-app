'use client';

import Link from 'next/link';

/**
 * CHAMA Design System — 02-mobile-ui/home/spec
 * Sections: Greeting header, Wallet balance card, Quick actions grid (4), Recent activity, Notifications
 * Style: Cards rounded (shamar-md), soft shadows, spacing 16
 */
export default function HomeMobileSection() {
  const quickActions = [
    { label: 'Acheter', href: '/shop', icon: '🛒' },
    { label: 'Commandes', href: '/dashboard/buyer/orders', icon: '📦' },
    { label: 'Paiements', href: '/dashboard/finance', icon: '💳' },
    { label: 'Profil', href: '/profile', icon: '👤' },
  ];

  const recentItems = [
    { id: '1', title: 'Commande #2847', subtitle: 'En cours', amount: '12 500 FCFA', href: '#' },
    { id: '2', title: 'Paiement reçu', subtitle: 'Il y a 2j', amount: '+45 000 FCFA', href: '#' },
  ];

  const notifications = [
    { id: '1', text: 'Votre commande a été expédiée', time: 'Il y a 1h', unread: true },
    { id: '2', text: 'Nouvelle offre sur un produit suivi', time: 'Hier', unread: false },
  ];

  return (
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 py-shamar-24 md:py-shamar-40">
      <div className="space-y-shamar-24">
        {/* Greeting header */}
        <header>
          <h1 className="text-shamar-h1 text-gray-900">
            Bonjour
          </h1>
          <p className="text-shamar-body text-gray-500 mt-1">
            Gérez vos achats et votre wallet
          </p>
        </header>

        {/* Wallet balance card — Card padding 16, radius medium, shadow soft */}
        <section className="bg-gray-0 p-shamar-16 rounded-shamar-md shadow-shamar-soft border border-gray-200">
          <p className="text-shamar-small text-gray-500 uppercase tracking-wide">
            Solde disponible
          </p>
          <p className="text-shamar-h2 text-gray-900 mt-1">
            0 FCFA
          </p>
          <div className="mt-shamar-16 flex gap-shamar-12">
            <Link
              href="/dashboard/finance"
              className="inline-flex items-center justify-center h-shamar-40 px-shamar-16 rounded-shamar-md font-medium bg-primary-600 hover:bg-primary-700 text-white shadow-shamar-soft hover:shadow-shamar-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-0 transition-all duration-200 text-shamar-body"
            >
              Dépôt
            </Link>
            <Link
              href="/dashboard/finance"
              className="inline-flex items-center justify-center h-shamar-40 px-shamar-16 rounded-shamar-md font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-0 transition-all duration-200 text-shamar-body"
            >
              Retrait
            </Link>
          </div>
        </section>

        {/* Quick actions grid (4) */}
        <section>
          <h2 className="text-shamar-h4 text-gray-900 mb-shamar-16">
            Actions rapides
          </h2>
          <div className="grid grid-cols-4 gap-shamar-16">
            {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="bg-gray-0 p-shamar-16 rounded-shamar-md shadow-shamar-soft border border-gray-200 hover:shadow-shamar-medium focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:ring-offset-2 focus:ring-offset-gray-50 transition-all duration-200 flex flex-col items-center gap-2"
            >
                <span className="text-2xl" aria-hidden>{a.icon}</span>
                <span className="text-shamar-small text-gray-700 text-center font-medium">
                  {a.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <div className="flex items-center justify-between mb-shamar-16">
            <h2 className="text-shamar-h4 text-gray-900">
              Activité récente
            </h2>
            <Link
              href="/dashboard/buyer/orders"
              className="text-shamar-small text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:ring-offset-2 rounded-shamar-sm"
            >
              Voir tout
            </Link>
          </div>
          <div className="bg-gray-0 rounded-shamar-md shadow-shamar-soft border border-gray-200 divide-y divide-gray-200">
            {recentItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between p-shamar-16 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-shamar-body font-medium text-gray-900">{item.title}</p>
                  <p className="text-shamar-small text-gray-500">{item.subtitle}</p>
                </div>
                <span className="text-shamar-body font-medium text-gray-900">{item.amount}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-shamar-h4 text-gray-900 mb-shamar-16">
            Notifications
          </h2>
          <div className="bg-gray-0 rounded-shamar-md shadow-shamar-soft border border-gray-200 divide-y divide-gray-200">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-shamar-16 ${n.unread ? 'bg-primary-50/50' : ''}`}
              >
                <p className="text-shamar-body text-gray-900">{n.text}</p>
                <p className="text-shamar-caption text-gray-500 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
