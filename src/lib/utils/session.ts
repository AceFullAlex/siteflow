import { cookies } from 'next/headers';

export interface Session {
    userId: string;
    name: string;
    role: 'admin' | 'unloader' | 'manager';
}

const COOKIE_NAME = 'siteflow-session';

export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie?.value) return null;

    try {
        return JSON.parse(cookie.value) as Session;
    } catch {
        return null;
    }
}

export function getRoleRedirectPath(role: string): string {
    switch (role) {
        case 'admin': return '/dashboard';
        case 'unloader': return '/unloader';
        case 'manager': return '/manager';
        default: return '/';
    }
}
