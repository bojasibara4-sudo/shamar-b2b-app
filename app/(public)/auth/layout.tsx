import { getThemeForSegment } from '@/lib/theme-mapping';

export const dynamic = 'force-dynamic';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className={`${getThemeForSegment('public')} app-bg min-h-screen`}>
      {children}
    </section>
  );
}

