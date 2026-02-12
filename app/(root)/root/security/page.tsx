import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function RootSecurityPage() {
  return (
    <OwnerPageShell
      title="Sécurité système"
      description="Clés API, sanctions globales, paramètres de sécurité profonde."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">
          Accès réservé au Président : clés API, audits, sanctions système, configuration sécurité.
        </p>
      </div>
    </OwnerPageShell>
  );
}
