import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function ExecSupportPage() {
  return (
    <OwnerPageShell
      title="Support"
      description="Tickets et support client."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Support — Vice-président / Président.</p>
      </div>
    </OwnerPageShell>
  );
}
