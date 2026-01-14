import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // La protection des routes est gérée côté client par AuthGuard
  // Ce middleware peut être utilisé pour des redirections basiques si nécessaire
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
