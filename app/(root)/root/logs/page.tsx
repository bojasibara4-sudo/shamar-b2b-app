import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function RootLogsPage() {
  return (
    <OwnerPageShell
      title="Logs système"
      description="Consultation des logs applicatifs et d’audit."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">
          Logs système et audit — accès Président uniquement.
        </p>
      </div>
    </OwnerPageShell>
  );
}
