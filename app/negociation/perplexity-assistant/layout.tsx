import { requireAuth } from '@/lib/auth-guard';

export default function PerplexityAssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  requireAuth();
  return <>{children}</>;
}

