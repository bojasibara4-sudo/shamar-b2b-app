'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GlobalHeader() {
  const pathname = usePathname();

  // Navigation canonique selon structure UI (ordre strict et immuable)
  const navItems = [
    { id: 'sourcing', label: 'SOURCING', href: '/marketplace/sourcing' },
    { id: 'b2b-b2c', label: 'B2B | B2C', href: '/marketplace/b2b' }, // Groupé dans un bloc unique
    { id: 'international', label: 'INTERNATIONAL', href: '/marketplace/international' },
    { id: 'sourcing-chine', label: 'SOURCING EN CHINE', href: '/marketplace/sourcing-chine' },
    { id: 'airbnb', label: 'AIRBNB', href: '/airbnb' },
    { id: 'negociation', label: 'NÉGOCIATION MATIÈRES PREMIÈRES', href: '/negociation' },
  ];

  const isActive = (href: string) => {
    return pathname?.startsWith(href) || false;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo SHAMAR */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-black text-gray-900">SHAMAR</span>
          </Link>
        </div>

        {/* Navigation horizontale canonique */}
        <nav className="flex items-center gap-1 border-t border-gray-100 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors ${
                isActive(item.href) || (item.id === 'b2b-b2c' && (pathname?.startsWith('/marketplace/b2b') || pathname?.startsWith('/marketplace/b2c')))
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
