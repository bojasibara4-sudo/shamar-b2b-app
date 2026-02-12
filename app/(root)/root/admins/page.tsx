import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function RootAdminsPage() {
  return (
    <OwnerPageShell
      title="Admins & rôles"
      description="Créer, modifier et supprimer les comptes admin. Gestion des rôles système."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">
          Interface de gestion des admins (owner_root, owner_exec, admin_staff) et attribution des rôles.
          Réservé au Président.
        </p>
      </div>
    </OwnerPageShell>
  );
}
