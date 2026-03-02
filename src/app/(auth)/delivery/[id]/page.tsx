import { getSession } from '@/lib/utils/session';
import { redirect } from 'next/navigation';
import DeliveryDetailClient from './DeliveryDetailClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function DeliveryDetailPage({ params }: PageProps) {
    const session = await getSession();
    if (!session || !['admin', 'manager'].includes(session.role)) {
        redirect('/');
    }

    const { id } = await params;

    return <DeliveryDetailClient deliveryId={id} role={session.role} />;
}
