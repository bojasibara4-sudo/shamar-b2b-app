import { getCurrentUser } from '@/lib/auth';
import SidebarNavClient from '@/components/dashboard/SidebarNavClient';
import {
  LayoutDashboard,
  Package,
  Search,
  ShoppingBag,
  MessageSquare,
  FileText,
  Heart,
  Star
} from 'lucide-react';

export default async function BuyerSidebar() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'buyer') {
    return null;
  }

  const menuItems = [
    { href: '/dashboard/buyer', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/buyer/products', label: 'Produits', icon: Package },
    { href: '/dashboard/buyer/search', label: 'Recherche', icon: Search },
    { href: '/dashboard/buyer/orders', label: 'Mes Commandes', icon: ShoppingBag },
    { href: '/dashboard/buyer/offers', label: 'Offres', icon: FileText },
    { href: '/dashboard/buyer/favorites', label: 'Favoris', icon: Heart },
    { href: '/dashboard/buyer/reviews', label: 'Avis donnés', icon: Star },
    { href: '/dashboard/buyer/messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-shamar-soft z-40">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <span className="text-primary-600 font-bold text-lg">S</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-wide">SHAMAR</h2>
            <div className="flex items-center gap-1.5">
              <span className="block w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
              <p className="text-xs text-primary-600 font-medium tracking-wider uppercase">Espace Acheteur</p>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium">Connecté en tant que</p>
          <p className="text-sm text-gray-900 font-medium truncate mt-0.5" title={user.email}>{user.email}</p>
        </div>
      </div>

      <SidebarNavClient items={menuItems} />
    </aside>
  );
}


