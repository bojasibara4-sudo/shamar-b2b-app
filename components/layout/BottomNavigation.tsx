'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNavigation() {
  const pathname = usePathname();

  // Navigation basse canonique (ordre strict)
  const navItems = [
    { id: 'home', label: 'Accueil', href: '/' },
    { id: 'products', label: 'Produits', href: '/products' },
    { id: 'cart', label: 'Panier', href: '/panier' },
    { id: 'messages', label: 'Messages', href: '/messages' },
    { id: 'settings', label: 'Mon espace', href: '/parametres' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href) || false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive(item.href)
                ? 'text-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
