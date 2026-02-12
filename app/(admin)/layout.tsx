import { getThemeForSegment } from '@/lib/theme-mapping';

export const dynamic = 'force-dynamic';

/**
 * Layout zone admin : pas de requireAdmin ici pour permettre /admin/login.
 * La protection rôle admin est dans admin/(dashboard)/layout.tsx.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${getThemeForSegment('admin')} app-bg min-h-screen`}>
      {children}
    </div>
  );
}
