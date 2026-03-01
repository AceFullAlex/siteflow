import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { processDeliveryDocuments } from '@/lib/gemini/scanner';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('siteflow-session');
        if (!sessionCookie?.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { deliveryId } = await request.json();
        if (!deliveryId) {
            return NextResponse.json({ error: 'Missing deliveryId' }, { status: 400 });
        }

        await processDeliveryDocuments(deliveryId);

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error('AI scan error:', e);
        return NextResponse.json({ error: 'Scan failed' }, { status: 500 });
    }
}
