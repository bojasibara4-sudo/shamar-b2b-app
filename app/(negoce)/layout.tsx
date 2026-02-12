import { AuthGuard } from '@/components/AuthGuard';

import { AuthGuard } from '@/components/AuthGuard';
import { getThemeForSegment } from '@/lib/theme-mapping';

export default function NegoceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className={`${getThemeForSegment('negociation')} app-bg min-h-full`}>
        <main className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
