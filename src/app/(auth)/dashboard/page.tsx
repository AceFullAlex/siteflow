import { getSession } from '@/lib/utils/session';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const session = await getSession();
    if (!session || session.role !== 'admin') redirect('/');

    return <DashboardClient name={session.name} />;
}
