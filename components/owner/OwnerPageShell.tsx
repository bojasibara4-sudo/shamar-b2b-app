'use client';

type OwnerPageShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function OwnerPageShell({ title, description, children }: OwnerPageShellProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
