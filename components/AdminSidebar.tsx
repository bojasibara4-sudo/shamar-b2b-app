import { getCurrentUser } from '@/lib/auth';
import SidebarNavClient from '@/components/dashboard/SidebarNavClient';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  FileText,
  DollarSign,
  Settings,
  UserCheck,
  UserCircle,
  Shield,
  ShieldAlert,
  FileCheck,
  CreditCard,
  BarChart3,
  Wallet,
  Home,
  Globe,
  Scale,
  Truck
} from 'lucide-react';

export default async function AdminSidebar() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    return null;
  }

  const menuItems = [
    { href: '/dashboard/admin', label: 'Accueil', icon: LayoutDashboard },
    { href: '/dashboard/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/dashboard/admin/sellers', label: 'Vendeurs', icon: UserCheck },
    { href: '/dashboard/admin/buyers', label: 'Acheteurs', icon: UserCircle },
    { href: '/dashboard/admin/products', label: 'Produits', icon: Package },
    { href: '/dashboard/admin/offers', label: 'Offres', icon: FileText },
    { href: '/dashboard/admin/orders', label: 'Commandes', icon: ShoppingBag },
    { href: '/admin/logistics', label: 'Logistique', icon: Truck },
    { href: '/dashboard/admin/disputes', label: 'Litiges', icon: ShieldAlert },
    { href: '/dashboard/admin/documents', label: 'Documents', icon: FileCheck },
    { href: '/dashboard/admin/finance', label: 'Finance', icon: Wallet },
    { href: '/dashboard/admin/payments', label: 'Paiements', icon: CreditCard },
    { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/admin/commissions', label: 'Commissions', icon: DollarSign },
    { href: '/dashboard/admin/agents', label: 'Agents', icon: Shield },
    { href: '/dashboard/admin/security', label: 'Sécurité (ASB)', icon: ShieldAlert },
    { href: '/dashboard/admin/host', label: 'Admin Host', icon: Home },
    { href: '/dashboard/admin/international', label: 'Admin International', icon: Globe },
    { href: '/dashboard/admin/negoce', label: 'Admin Négoce', icon: Scale },
    { href: '/dashboard/admin/settings', label: 'Paramètres', icon: Settings },
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
              <p className="text-xs text-primary-600 font-medium tracking-wider uppercase">Administration</p>
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


