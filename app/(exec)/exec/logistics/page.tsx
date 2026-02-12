import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function ExecLogisticsPage() {
  return (
    <OwnerPageShell
      title="Logistique"
      description="Gestion des livraisons et opérateurs."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Logistique — Vice-président / Président.</p>
      </div>
    </OwnerPageShell>
  );
}
