import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that should always be accessible
const PUBLIC_PATHS = ['/api', '/admin', '/login', '/maintenance'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to public paths
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Allow access to static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.')) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
