import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
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

        // Get all expected orders
        const { data: orders } = await supabase
            .from('expected_orders')
            .select('material_type, quantity_ordered');

        if (!orders || orders.length === 0) {
            return NextResponse.json({ materials: [] });
        }

        // Aggregate expected quantities per material type
        const expectedMap: Record<string, number> = {};
        for (const o of orders) {
            const key = o.material_type || 'Unknown';
            expectedMap[key] = (expectedMap[key] || 0) + (o.quantity_ordered || 0);
        }

        // Get delivered quantities per material type
        const { data: items } = await supabase
            .from('delivery_items')
            .select('material_type, quantity_delivered');

        const deliveredMap: Record<string, number> = {};
        if (items) {
            for (const item of items) {
                const key = item.material_type || 'Unknown';
                deliveredMap[key] = (deliveredMap[key] || 0) + (item.quantity_delivered || 0);
            }
        }

        // Merge into array
        const materials = Object.entries(expectedMap).map(([material_type, quantity_ordered]) => ({
            material_type,
            quantity_ordered,
            quantity_delivered: deliveredMap[material_type] || 0,
        }));

        return NextResponse.json({ materials });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
