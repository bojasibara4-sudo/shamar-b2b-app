import { getCurrentUser } from '@/lib/auth';
import SidebarNavClient from '@/components/dashboard/SidebarNavClient';
import { LayoutDashboard, Home, Calendar, DollarSign, Star, Palmtree, ShieldAlert } from 'lucide-react';

export default async function HostSidebar() {
  const user = await getCurrentUser();
  if (!user) return null;

  const menuItems = [
    { href: '/dashboard/host', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/dashboard/host/properties', label: 'Mes logements', icon: Home },
    { href: '/dashboard/host/properties/new', label: 'Ajouter un logement', icon: Palmtree },
    { href: '/dashboard/host/bookings', label: 'Réservations', icon: Calendar },
    { href: '/dashboard/host/finance', label: 'Revenus', icon: DollarSign },
    { href: '/dashboard/host/reviews', label: 'Avis', icon: Star },
    { href: '/dashboard/disputes', label: 'Litiges', icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-brand-noir-profond border-r border-brand-anthracite/50 min-h-screen flex flex-col shadow-2xl z-40">
      <div className="p-6 border-b border-brand-anthracite/50 bg-gradient-to-r from-brand-noir to-brand-noir-profond">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-lg flex items-center justify-center shadow-lg">
            <Palmtree className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">SHAMAR Host</h2>
            <p className="text-xs text-rose-400 font-medium tracking-wider uppercase">Espace Hôte</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-brand-anthracite/30">
          <p className="text-xs text-gray-400 font-medium">Connecté</p>
          <p className="text-sm text-white font-medium truncate mt-0.5" title={user.email}>{user.email}</p>
        </div>
      </div>
      <SidebarNavClient items={menuItems} />
    </aside>
  );
}
