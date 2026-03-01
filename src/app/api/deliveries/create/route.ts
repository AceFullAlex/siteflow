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
        const supabase = await createClient();
        const formData = await request.formData();

        // Create delivery record
        const { data: delivery, error: deliveryError } = await supabase
            .from('deliveries')
            .insert({
                created_by: session.userId,
                supplier: formData.get('supplier') as string || null,
                notes: formData.get('notes') as string || null,
                status: 'pending',
            })
            .select('id')
            .single();

        if (deliveryError || !delivery) {
            return NextResponse.json({ error: 'Failed to create delivery' }, { status: 500 });
        }

        // Upload photos
        const photoTypes = ['truck', 'material', 'document'] as const;
        for (const type of photoTypes) {
            let i = 0;
            while (formData.has(`${type}_${i}`)) {
                const file = formData.get(`${type}_${i}`) as File;
                if (file && file.size > 0) {
                    const timestamp = Date.now();
                    const path = `${delivery.id}/${type}_${timestamp}_${i}.jpg`;

                    const { error: uploadError } = await supabase.storage
                        .from('delivery-photos')
                        .upload(path, file, { contentType: file.type });

                    if (!uploadError) {
                        await supabase.from('delivery_photos').insert({
                            delivery_id: delivery.id,
                            photo_type: type,
                            storage_path: path,
                        });
                    }
                }
                i++;
            }
        }

        // Create initial document tracking entries
        await supabase.from('document_tracking').insert([
            { delivery_id: delivery.id, doc_type: 'DN', status: 'missing' },
            { delivery_id: delivery.id, doc_type: 'CMR', status: 'missing' },
        ]);

        // Trigger AI scan (non-blocking)
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        fetch(`${baseUrl}/api/ai/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `siteflow-session=${sessionCookie.value}`,
            },
            body: JSON.stringify({ deliveryId: delivery.id }),
        }).catch(() => { }); // Fire and forget

        return NextResponse.json({ success: true, deliveryId: delivery.id });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
