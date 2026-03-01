import { getSession } from '@/lib/utils/session';
import { redirect } from 'next/navigation';
import ManagerClient from './ManagerClient';

export default async function ManagerPage() {
    const session = await getSession();
    if (!session || !['admin', 'manager'].includes(session.role)) redirect('/');

    return <ManagerClient name={session.name} />;
}
