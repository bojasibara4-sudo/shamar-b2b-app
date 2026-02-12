import { AuthGuard } from '@/components/AuthGuard';
import { getThemeForSegment } from '@/lib/theme-mapping';

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className={`${getThemeForSegment('business')} app-bg min-h-screen`}>
        <main className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24 lg:py-shamar-40">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
