'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import GlobalUserMenu from '@/components/GlobalUserMenu';
import { Menu, X } from 'lucide-react';

export default function GlobalHeaderWithAuth() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; email: string; role: 'admin' | 'seller' | 'buyer' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    // Timeout de sécurité : après 1.5s, arrêter le loading
    timeoutId = setTimeout(() => {
      if (mounted) {
        setLoading(false);
      }
    }, 1500);

    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Error getting session in header:', error);
          clearTimeout(timeoutId);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          // Récupérer le profil utilisateur avec timeout
          try {
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('id, email, role')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error('Error loading profile:', profileError);
              // Utiliser les infos de session même si le profil échoue
              if (mounted) {
                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  role: 'buyer',
                });
              }
            } else if (profile && mounted) {
              setUser({
                id: profile.id,
                email: profile.email,
                role: profile.role,
              });
            }
          } catch (profileErr) {
            console.error('Error in profile fetch:', profileErr);
            // Fallback sur les infos de session
            if (mounted) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: 'buyer',
              });
            }
          }
        }
        
        if (mounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
        if (mounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    }

    checkAuth();

    // Écouter les changements d'auth
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (mounted) {
        checkAuth();
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  // Navigation canonique selon structure UI
  const navItems = [
    { id: 'sourcing', label: 'SOURCING', href: '/sourcing' },
    { id: 'b2b-b2c', label: 'B2B | B2C', href: '/b2b' },
    { id: 'international', label: 'INTERNATIONAL', href: '/international' },
    { id: 'sourcing-chine', label: 'SOURCING EN CHINE', href: '/sourcing-chine' },
    { id: 'airbnb', label: 'AIRBNB', href: '/airbnb' },
    { id: 'negociation', label: 'NÉGOCIATION MATIÈRES PREMIÈRES', href: '/negociation' },
  ];

  const isActive = (href: string) => {
    return pathname?.startsWith(href) || false;
  };

  // Ne pas afficher le header sur les pages /app/* (elles ont leur propre header)
  if (pathname?.startsWith('/app/')) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with logo and auth */}
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-black text-gray-900">SHAMAR</span>
          </Link>

          <div className="flex items-center gap-4">
            {!loading && user ? (
              <GlobalUserMenu user={user} />
            ) : !loading ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMobileNavOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation horizontale canonique */}
        <nav className={`flex items-center gap-1 border-t border-gray-100 overflow-x-auto transition-all ${
          isMobileNavOpen ? 'max-h-96' : 'max-h-0 md:max-h-full'
        } overflow-hidden md:overflow-x-auto`}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors ${
                isActive(item.href) || (item.id === 'b2b-b2c' && (pathname?.startsWith('/b2b') || pathname?.startsWith('/b2c')))
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setIsMobileNavOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
