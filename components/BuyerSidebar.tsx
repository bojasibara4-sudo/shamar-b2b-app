import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { 
  LayoutDashboard, 
  Package, 
  Search, 
  ShoppingBag, 
  MessageSquare
} from 'lucide-react';

export default function BuyerSidebar() {
  const user = getCurrentUser();

  if (!user || user.role !== 'buyer') {
    return null;
  }

  const menuItems = [
    { href: '/dashboard/buyer', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/buyer/products', label: 'Produits', icon: Package },
    { href: '/dashboard/buyer/search', label: 'Recherche', icon: Search },
    { href: '/dashboard/buyer/orders', label: 'Mes Commandes', icon: ShoppingBag },
    { href: '/dashboard/buyer/messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">SHAMAR B2B</h2>
            <p className="text-xs text-gray-500">Espace Acheteur</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3 truncate">{user.email}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <Icon size={20} className="text-gray-500" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}


