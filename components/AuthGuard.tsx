'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'seller' | 'buyer';
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (requiredRole && profile?.role !== requiredRole) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, profile, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}

