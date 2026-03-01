import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hashPin } from '@/lib/utils/hash';

export async function POST(request: Request) {
    try {
        const { pin } = await request.json();

        if (!pin || typeof pin !== 'string' || pin.length !== 4) {
            return NextResponse.json({ error: 'Invalid PIN' }, { status: 400 });
        }

        const pinHash = await hashPin(pin);
        const supabase = await createClient();

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, role')
            .eq('pin_hash', pinHash)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
        }

        const session = JSON.stringify({
            userId: user.id,
            name: user.name,
            role: user.role,
        });

        const response = NextResponse.json({
            success: true,
            name: user.name,
            role: user.role,
        });

        response.cookies.set('siteflow-session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
