import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('siteflow-session');
        if (!sessionCookie?.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const session = JSON.parse(sessionCookie.value);
        if (session.role !== 'admin') {
            return NextResponse.json({ error: 'Admin only' }, { status: 403 });
        }

        const { documentId } = await request.json();
        if (!documentId) {
            return NextResponse.json({ error: 'Missing documentId' }, { status: 400 });
        }

        const supabase = await createClient();

        const { error } = await supabase
            .from('document_tracking')
            .update({
                status: 'received',
                resolved_at: new Date().toISOString(),
            })
            .eq('id', documentId);

        if (error) {
            return NextResponse.json({ error: 'Update failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
