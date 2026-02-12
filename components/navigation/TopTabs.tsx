'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Building2, ShoppingBag, Globe, MapPin, Hotel, Package } from 'lucide-react';

const tabs = [
  { id: 'accueil', label: 'Accueil', href: '/', icon: Home },
  { id: 'b2b', label: 'B2B', href: '/b2b', icon: Building2 },
  { id: 'b2c', label: 'B2C', href: '/b2c', icon: ShoppingBag },
  { id: 'international', label: 'International', href: '/international', icon: Globe },
  { id: 'sourcing-chine', label: 'Sourcing Chine', href: '/china', icon: MapPin },
  { id: 'airbnb', label: 'Locations & Airbnb', href: '/host', icon: Hotel },
  { id: 'matieres', label: 'Matières Premières', href: '/negociation', icon: Package },
];

export default function TopTabs() {
  const pathname = usePathname();

  const isActive = (tab: (typeof tabs)[0]) => {
    if (tab.href === '/') return pathname === '/';
    return pathname?.startsWith(tab.href) || false;
  };

  return (
    <nav className="flex items-center gap-1 border-t border-gray-100 overflow-x-auto bg-white">
      <div className="flex items-center min-w-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
                active
                  ? 'text-primary-600 border-primary-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-200'
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
