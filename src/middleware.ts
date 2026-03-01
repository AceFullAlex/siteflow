import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes: Record<string, string[]> = {
    '/dashboard': ['admin'],
    '/unloader': ['admin', 'unloader'],
    '/manager': ['admin', 'manager'],
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (
        pathname === '/' ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/icons') ||
        pathname === '/manifest.json' ||
        pathname === '/sw.js' ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Check session
    const sessionCookie = request.cookies.get('siteflow-session');
    if (!sessionCookie?.value) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    let session: { role: string };
    try {
        session = JSON.parse(sessionCookie.value);
    } catch {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Check role access
    for (const [route, roles] of Object.entries(protectedRoutes)) {
        if (pathname.startsWith(route) && !roles.includes(session.role)) {
            // Redirect to their correct page
            const redirectMap: Record<string, string> = {
                admin: '/dashboard',
                unloader: '/unloader',
                manager: '/manager',
            };
            return NextResponse.redirect(
                new URL(redirectMap[session.role] || '/', request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
