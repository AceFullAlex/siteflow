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
        const today = new Date().toISOString().split('T')[0];

        // Today's deliveries count
        const { count: todayCount } = await supabase
            .from('deliveries')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', `${today}T00:00:00`)
            .lte('created_at', `${today}T23:59:59`);

        // Expected today
        const { count: expectedCount } = await supabase
            .from('expected_orders')
            .select('*', { count: 'exact', head: true })
            .eq('expected_date', today);

        // Issues
        const { count: issueCount } = await supabase
            .from('deliveries')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'issue')
            .gte('created_at', `${today}T00:00:00`);

        // Missing docs
        const { count: missingDocs } = await supabase
            .from('document_tracking')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'missing');

        // Behind schedule
        const { count: behindSchedule } = await supabase
            .from('expected_orders')
            .select('*', { count: 'exact', head: true })
            .lt('expected_date', today)
            .is('priority', null); // simplified — no delivered flag

        return NextResponse.json({
            deliveriesToday: todayCount || 0,
            expectedToday: expectedCount || 0,
            issueCount: issueCount || 0,
            missingDocs: missingDocs || 0,
            behindSchedule: behindSchedule || 0,
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
