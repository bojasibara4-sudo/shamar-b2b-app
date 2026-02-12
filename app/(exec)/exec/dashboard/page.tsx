import { OwnerPageShell } from '@/components/owner/OwnerPageShell';
import { Users, Building2, AlertCircle, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ExecDashboardPage() {
  return (
    <OwnerPageShell
      title="Dashboard Vice-président"
      description="Vue opérationnelle : utilisateurs, vendeurs, litiges, analytics."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/exec/users', label: 'Utilisateurs', icon: Users },
          { href: '/exec/vendors', label: 'Vendeurs', icon: Building2 },
          { href: '/exec/disputes', label: 'Litiges', icon: AlertCircle },
          { href: '/exec/analytics', label: 'Analytics', icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className="inline-flex rounded-xl bg-indigo-100 p-3 text-indigo-600">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-semibold text-slate-900 group-hover:text-indigo-600">{item.label}</h2>
            </a>
          );
        })}
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Accès Vice-président (owner_exec)</h2>
        <p className="mt-2 text-sm text-slate-500">
          Super admin opérationnel : utilisateurs, vendeurs, KYC, boutiques, litiges, paiements business,
          logistique, payouts, support, analytics, admin staff. Pas d’accès aux routes /root ni aux
          paramètres système critiques.
        </p>
      </div>
    </OwnerPageShell>
  );
}
