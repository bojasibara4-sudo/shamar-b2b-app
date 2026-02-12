import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function ExecUsersPage() {
  return (
    <OwnerPageShell
      title="Utilisateurs"
      description="Gestion des utilisateurs de la plateforme."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Liste et gestion des utilisateurs — Vice-président / Président.</p>
      </div>
    </OwnerPageShell>
  );
}
