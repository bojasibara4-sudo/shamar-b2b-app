import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function RootSystemConfigPage() {
  return (
    <OwnerPageShell
      title="Config globale"
      description="Configuration critique, maintenance mode, migrations."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">
          Configuration système, mode maintenance et paramètres critiques — réservé au Président.
        </p>
      </div>
    </OwnerPageShell>
  );
}
