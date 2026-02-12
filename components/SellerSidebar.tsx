import { getCurrentUser } from '@/lib/auth';
import SidebarNavClient from '@/components/dashboard/SidebarNavClient';
import {
  LayoutDashboard,
  Package,
  Target,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Store,
  Wallet,
  Truck,
  Star,
  Award,
  FileText,
  ShieldAlert
} from 'lucide-react';

export default async function SellerSidebar() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'seller') {
    return null;
  }

  const menuItems = [
    { href: '/dashboard/seller', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/seller/products', label: 'Mes Produits', icon: Package },
    { href: '/dashboard/seller/products/new', label: 'Nouveau produit', icon: Package },
    { href: '/dashboard/onboarding-vendeur', label: 'Ma boutique', icon: Store },
    { href: '/dashboard/seller/kyc', label: 'KYC / Documents', icon: FileText },
    { href: '/dashboard/seller/leads', label: 'Leads', icon: Target },
    { href: '/dashboard/seller/orders', label: 'Commandes', icon: ShoppingBag },
    { href: '/dashboard/seller/disputes', label: 'Litiges', icon: ShieldAlert },
    { href: '/dashboard/seller/rfqs', label: 'Demandes de devis', icon: FileText },
    { href: '/dashboard/seller/deliveries', label: 'Livraisons', icon: Truck },
    { href: '/dashboard/seller/payouts', label: 'Paiements', icon: Wallet },
    { href: '/dashboard/seller/reviews', label: 'Avis', icon: Star },
    { href: '/dashboard/seller/badge', label: 'Mon badge', icon: Award },
    { href: '/dashboard/seller/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/seller/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/dashboard/seller/commissions', label: 'Commissions', icon: DollarSign },
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
              <p className="text-xs text-primary-600 font-medium tracking-wider uppercase">Espace Vendeur</p>
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


