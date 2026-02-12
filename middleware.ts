import { NextRequest, NextResponse } from 'next/server';

/** Détecte une session : cookie shamar_user (login API) ou cookies Supabase (OTP/magic link). */
function hasValidSession(request: NextRequest): boolean {
  if (request.cookies.get('shamar_user')?.value) return true;
  const all = request.cookies.getAll();
  return all.some((c) => c.name.startsWith('sb-') && (c.name.includes('auth') || c.name.includes('token')));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = hasValidSession(request);

  // ——— Routes toujours publiques (vitrine, auth, marketplace) ———
  if (pathname === '/') return NextResponse.next();
  if (pathname.startsWith('/auth')) return NextResponse.next();
  if (pathname.startsWith('/public') || pathname === '/aide' || pathname === '/airbnb' || pathname === '/negociation') return NextResponse.next();
  if (pathname.startsWith('/marketplace') || pathname === '/sourcing' || pathname.startsWith('/sourcing/')) return NextResponse.next();
  if (pathname === '/b2b' || pathname === '/b2c') return NextResponse.next();
  if (pathname.startsWith('/products') || pathname.startsWith('/shop') || pathname === '/cart' || pathname.startsWith('/international')) return NextResponse.next();
  if (pathname.startsWith('/china') || pathname.startsWith('/checkout')) return NextResponse.next();
  if (pathname.startsWith('/rfq') && !pathname.startsWith('/dashboard')) return NextResponse.next();
  if (pathname.startsWith('/negoce') && !pathname.startsWith('/dashboard')) return NextResponse.next();
  if (pathname === '/parametres') return NextResponse.next();

  // /host catalogue public ; /host/payments et /host/booking restent protégés plus bas
  if (pathname === '/host') return NextResponse.next();
  if (pathname.startsWith('/host/')) {
    const isPaymentsOrBooking = pathname.startsWith('/host/payments') || pathname.startsWith('/host/booking');
    if (!isPaymentsOrBooking) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length === 2 && parts[0] === 'host') return NextResponse.next();
    }
  }

  // /account = alias → /profile
  if (pathname === '/account' || pathname.startsWith('/account/')) {
    const rest = pathname === '/account' ? '' : pathname.slice('/account'.length);
    return NextResponse.redirect(new URL('/profile' + rest, request.url));
  }

  // Admin : /admin/* (sauf /admin/login) → session requise → /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!hasSession) return NextResponse.redirect(new URL('/admin/login', request.url));
    return NextResponse.next();
  }

  // Protéger uniquement : /dashboard, /profile, /admin, /root, /exec, /disputes, /payments (+ host/payments, host/booking, properties, reservations)
  const protectedPrefixes = [
    '/dashboard',
    '/profile',
    '/root',
    '/exec',
    '/disputes',
    '/payments',
    '/host/payments',
    '/host/booking',
    '/properties',
    '/reservations',
  ];
  const isProtected = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  if (isProtected && !hasSession) {
    const isAdminArea = pathname.startsWith('/admin');
    const loginUrl = isAdminArea ? '/admin/login' : '/auth/login';
    const url = new URL(loginUrl, request.url);
    const requested = request.nextUrl.pathname + request.nextUrl.search;
    if (!isAdminArea && requested && requested !== '/') url.searchParams.set('next', requested);
    return NextResponse.redirect(url);
  }

  // Dashboard : éviter cache navigateur pour toujours servir la dernière UI
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
  if (isDashboard) {
    const res = NextResponse.next();
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.headers.set('Pragma', 'no-cache');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  // Ne faire tourner le middleware que sur les chemins à protéger ou à rediriger
  // /dashboard en premier pour matcher la route exacte (/:path* peut exclure /dashboard selon la config)
  matcher: [
    '/account',
    '/account/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/admin',
    '/admin/:path*',
    '/profile',
    '/profile/:path*',
    '/disputes',
    '/disputes/:path*',
    '/payments',
    '/payments/:path*',
    '/root',
    '/root/:path*',
    '/exec',
    '/exec/:path*',
    '/host/:path*',
    '/properties',
    '/properties/:path*',
    '/reservations',
    '/reservations/:path*',
  ],
};
