import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function ExecAdminStaffPage() {
  return (
    <OwnerPageShell
      title="Admin staff"
      description="Gestion des admins opérationnels (admin_staff)."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Admin staff — Vice-président / Président. Gestion des rôles admin_staff uniquement (pas des owner).</p>
      </div>
    </OwnerPageShell>
  );
}
