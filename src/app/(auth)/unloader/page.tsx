import { getSession } from '@/lib/utils/session';
import { redirect } from 'next/navigation';
import UnloaderHomeClient from './UnloaderHomeClient';

export default async function UnloaderPage() {
    const session = await getSession();
    if (!session || !['admin', 'unloader'].includes(session.role)) redirect('/');

    return <UnloaderHomeClient name={session.name} userId={session.userId} />;
}
