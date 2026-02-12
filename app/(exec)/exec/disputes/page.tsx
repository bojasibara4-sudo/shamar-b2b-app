import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function ExecDisputesPage() {
  return (
    <OwnerPageShell
      title="Litiges"
      description="Gestion et résolution des litiges."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Litiges — Vice-président / Président.</p>
      </div>
    </OwnerPageShell>
  );
}
