import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

interface RouteContext {
    params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
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

        const { id } = await context.params;
        const supabase = await createClient();

        // Fetch delivery with related data
        const { data: delivery, error } = await supabase
            .from('deliveries')
            .select(`
                *,
                delivery_items(material_type, quantity_delivered, unit, condition),
                delivery_photos(id, photo_type, storage_path, ai_extracted_text),
                document_tracking(doc_type, status)
            `)
            .eq('id', id)
            .single();

        if (error || !delivery) {
            return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
        }

        // Generate signed URLs for photos
        const photosWithUrls = await Promise.all(
            (delivery.delivery_photos || []).map(async (photo: { id: string; photo_type: string; storage_path: string; ai_extracted_text: string | null }) => {
                const { data } = await supabase.storage
                    .from('delivery-photos')
                    .createSignedUrl(photo.storage_path, 3600); // 1 hour

                return {
                    id: photo.id,
                    photo_type: photo.photo_type,
                    storage_path: photo.storage_path,
                    ai_extracted_text: photo.ai_extracted_text,
                    url: data?.signedUrl || null,
                };
            })
        );

        return NextResponse.json({
            id: delivery.id,
            created_at: delivery.created_at,
            supplier: delivery.supplier,
            truck_plate: delivery.truck_plate,
            status: delivery.status,
            ai_summary: delivery.ai_summary,
            notes: delivery.notes,
            items: delivery.delivery_items || [],
            photos: photosWithUrls,
            documents: delivery.document_tracking || [],
        });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(_request: Request, context: RouteContext) {
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

        const { id } = await context.params;
        const supabase = await createClient();

        // Let Supabase handle cascaded deletion if foreign keys are setup,
        // or just delete the main delivery record.
        const { error } = await supabase
            .from('deliveries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            return NextResponse.json({ error: 'Failed to delete delivery' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
