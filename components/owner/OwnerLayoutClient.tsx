'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  Users,
  Building2,
  AlertCircle,
  Truck,
  Wallet,
  HeadphonesIcon,
  BarChart3,
  UserCog,
  DollarSign,
  Settings,
  FileText,
  Flag,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export type OwnerNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type OwnerLayoutClientProps = {
  mode: 'root' | 'exec';
  userEmail?: string;
  children: React.ReactNode;
};

const ROOT_NAV: OwnerNavItem[] = [
  { href: '/root/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/root/admins', label: 'Admins & rôles', icon: Users },
  { href: '/root/security', label: 'Sécurité système', icon: Shield },
  { href: '/root/finance-system', label: 'Finance système', icon: DollarSign },
  { href: '/root/system-config', label: 'Config globale', icon: Settings },
  { href: '/root/logs', label: 'Logs système', icon: FileText },
  { href: '/root/feature-flags', label: 'Feature flags', icon: Flag },
];

const EXEC_NAV: OwnerNavItem[] = [
  { href: '/exec/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/exec/users', label: 'Utilisateurs', icon: Users },
  { href: '/exec/vendors', label: 'Vendeurs', icon: Building2 },
  { href: '/exec/disputes', label: 'Litiges', icon: AlertCircle },
  { href: '/exec/logistics', label: 'Logistique', icon: Truck },
  { href: '/exec/payouts', label: 'Payouts', icon: Wallet },
  { href: '/exec/support', label: 'Support', icon: HeadphonesIcon },
  { href: '/exec/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/exec/admin-staff', label: 'Admin staff', icon: UserCog },
];

export function OwnerLayoutClient({ mode, userEmail, children }: OwnerLayoutClientProps) {
  const pathname = usePathname();
  const nav = mode === 'root' ? ROOT_NAV : EXEC_NAV;
  const title = mode === 'root' ? 'Président' : 'Vice-président';

  return (
    <div className="flex min-h-screen bg-slate-50/80">
      {/* Sidebar fixe — premium */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white shadow-sm">
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-6">
          <Shield className="h-8 w-8 text-indigo-600" />
          <div>
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="text-xs text-slate-500">Super administration</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-4">
          {nav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-slate-100 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
            Retour app
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-8 backdrop-blur">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-slate-900">
              {mode === 'root' ? 'Président' : 'Vice-président'}
            </h1>
          </div>
          {userEmail && (
            <p className="text-sm text-slate-500 truncate max-w-[200px]">{userEmail}</p>
          )}
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
