import { AuthGuard } from '@/components/AuthGuard';
import { getThemeForSegment } from '@/lib/theme-mapping';

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className={`${getThemeForSegment('finance')} app-bg min-h-screen`}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
