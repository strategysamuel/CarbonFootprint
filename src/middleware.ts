import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Route Configuration ──────────────────────────────────────────────────────

const AUTH_ROUTES   = ['/login', '/signup', '/forgot-password'];
const DASHBOARD_PREFIX = '/dashboard';
const ONBOARDING_PATH  = '/onboarding';

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read session cookie set by the Firebase session management
  // (We use a lightweight cookie flag since Firebase SDK is client-only)
  const sessionCookie = request.cookies.get('cm_session')?.value;
  const onboardingCookie = request.cookies.get('cm_onboarded')?.value;

  const isAuthenticated = !!sessionCookie;
  const isOnboarded     = onboardingCookie === 'true';
  const isAuthRoute     = AUTH_ROUTES.includes(pathname);
  const isDashboard     = pathname.startsWith(DASHBOARD_PREFIX);
  const isOnboarding    = pathname === ONBOARDING_PATH;

  // Authenticated user trying to access auth pages → redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Unauthenticated user trying to access protected routes
  if (!isAuthenticated && (isDashboard || isOnboarding)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated but not onboarded → redirect to onboarding
  // (except if already heading there)
  if (isAuthenticated && !isOnboarded && isDashboard) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Authenticated + onboarded + heading to onboarding → redirect to dashboard
  if (isAuthenticated && isOnboarded && isOnboarding) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
