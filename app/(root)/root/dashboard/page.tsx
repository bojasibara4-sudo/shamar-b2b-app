import { OwnerPageShell } from '@/components/owner/OwnerPageShell';
import { LayoutDashboard, Shield, Database, Key } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function RootDashboardPage() {
  return (
    <OwnerPageShell
      title="Dashboard Président"
      description="Vue d’ensemble et accès rapide au contrôle total."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/root/admins', label: 'Admins & rôles', icon: LayoutDashboard, iconClass: 'bg-indigo-100 text-indigo-600' },
          { href: '/root/security', label: 'Sécurité système', icon: Shield, iconClass: 'bg-red-100 text-red-600' },
          { href: '/root/system-config', label: 'Config globale', icon: Database, iconClass: 'bg-emerald-100 text-emerald-600' },
          { href: '/root/logs', label: 'Logs', icon: Key, iconClass: 'bg-amber-100 text-amber-600' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className={`inline-flex rounded-xl p-3 ${item.iconClass}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-semibold text-slate-900 group-hover:text-indigo-600">{item.label}</h2>
            </a>
          );
        })}
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Accès Président (owner_root)</h2>
        <p className="mt-2 text-sm text-slate-500">
          Contrôle total : admins, sécurité, finance système, config, logs, feature flags. Aucune restriction.
        </p>
      </div>
    </OwnerPageShell>
  );
}
