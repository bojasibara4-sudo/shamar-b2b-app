import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  // Vérifier la session Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Routes protégées selon la synthèse fonctionnelle officielle
  // Routes publiques : /, /sourcing, /b2b, /international, /sourcing-chine, /airbnb, /negociation, /products, /panier, /parametres
  // Routes protégées : /dashboard, /messages, /orders, /payments, /profile, /settings, /vendor
  const protectedRoutes = [
    '/dashboard',
    '/messages',
    '/orders',
    '/payments',
    '/profile',
    '/settings',
    '/vendor'
  ];
  
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // Routes d'authentification
  const authRoutes = ['/auth/login', '/auth/register', '/login', '/register'];
  const isAuthRoute = authRoutes.some((route) => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Si l'utilisateur est sur une route protégée et n'est pas authentifié
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si l'utilisateur est authentifié et essaie d'accéder aux routes d'auth, rediriger vers /dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
};
