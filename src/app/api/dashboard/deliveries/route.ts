import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('siteflow-session');
        if (!sessionCookie?.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie.value);
        if (!['admin', 'manager'].includes(session.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const supabase = await createClient();
        const url = new URL(request.url);
        const filter = url.searchParams.get('filter') || 'today';

        let query = supabase
            .from('deliveries')
            .select(`
        *,
        delivery_items(id),
        delivery_photos(id),
        document_tracking(id, status)
      `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (filter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            query = query
                .gte('created_at', `${today}T00:00:00`)
                .lte('created_at', `${today}T23:59:59`);
        }

        if (['complete', 'issue', 'pending'].includes(filter)) {
            query = query.eq('status', filter);
        }

        const { data: deliveries, error } = await query;

        if (error) {
            return NextResponse.json({ error: 'Query failed' }, { status: 500 });
        }

        const formatted = (deliveries || []).map((d) => ({
            id: d.id,
            created_at: d.created_at,
            supplier: d.supplier,
            truck_plate: d.truck_plate,
            status: d.status,
            ai_summary: d.ai_summary,
            notes: d.notes,
            items_count: d.delivery_items?.length || 0,
            photos_count: d.delivery_photos?.length || 0,
            missing_docs: d.document_tracking?.filter(
                (dt: { status: string }) => dt.status === 'missing'
            ).length || 0,
        }));

        return NextResponse.json({ deliveries: formatted });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
