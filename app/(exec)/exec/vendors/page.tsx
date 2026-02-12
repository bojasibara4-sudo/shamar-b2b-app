import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function ExecVendorsPage() {
  return (
    <OwnerPageShell
      title="Vendeurs"
      description="Gestion des vendeurs et validation KYC."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Vendeurs et KYC — Vice-président / Président.</p>
      </div>
    </OwnerPageShell>
  );
}
