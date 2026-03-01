import { redirect } from 'next/navigation';
import { getSession, getRoleRedirectPath } from '@/lib/utils/session';

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect('/');
    }

    return <>{children}</>;
}
