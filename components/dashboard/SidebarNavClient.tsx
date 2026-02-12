'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export default function SidebarNavClient({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden ${active
                ? 'text-primary-600 font-medium bg-primary-50 border-l-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            <Icon
              size={20}
              className={`shrink-0 transition-colors ${active ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'}`}
            />
            <span className="relative z-10">{item.label}</span>

            {active && (
              <div className="absolute inset-0 bg-primary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
