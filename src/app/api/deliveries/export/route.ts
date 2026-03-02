import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import archiver from 'archiver';

async function getAuthSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('siteflow-session');
    if (!sessionCookie?.value) return null;
    const session = JSON.parse(sessionCookie.value);
    if (!['admin', 'manager'].includes(session.role)) return null;
    return session;
}

async function exportDelivery(deliveryId: string) {
    const session = await getAuthSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!deliveryId) {
        return NextResponse.json({ error: 'Missing deliveryId' }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch delivery details
    const { data: delivery } = await supabase
        .from('deliveries')
        .select('*, delivery_photos(id, photo_type, storage_path, ai_extracted_text)')
        .eq('id', deliveryId)
        .single();

    if (!delivery) {
        return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Create ZIP archive in memory
    const archive = archiver('zip', { zlib: { level: 5 } });
    const chunks: Uint8Array[] = [];

    archive.on('data', (chunk: Uint8Array) => chunks.push(chunk));

    // Add AI summary text file
    const summaryText = [
        `SiteFlow Delivery Export`,
        `========================`,
        `Delivery ID: ${delivery.id}`,
        `Date: ${new Date(delivery.created_at).toLocaleString('en-GB')}`,
        `Supplier: ${delivery.supplier || 'Unknown'}`,
        `Truck: ${delivery.truck_plate || 'N/A'}`,
        `Status: ${delivery.status}`,
        ``,
        `AI Summary:`,
        delivery.ai_summary || 'No summary available',
        ``,
        `Notes:`,
        delivery.notes || 'None',
    ].join('\n');

    archive.append(summaryText, { name: 'delivery-summary.txt' });

    // Download and add photos
    const photos = delivery.delivery_photos || [];
    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        try {
            const { data: fileData } = await supabase.storage
                .from('delivery-photos')
                .download(photo.storage_path);

            if (fileData) {
                const buffer = Buffer.from(await fileData.arrayBuffer());
                const ext = photo.storage_path.split('.').pop() || 'jpg';
                archive.append(buffer, { name: `${photo.photo_type}_${i + 1}.${ext}` });
            }
        } catch {
            // Skip failed downloads
        }
    }

    // Finalize the archive
    await archive.finalize();

    // Wait for all data to be collected
    await new Promise<void>((resolve) => archive.on('end', resolve));

    const zipBuffer = Buffer.concat(chunks);

    return new NextResponse(zipBuffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="delivery-${deliveryId.slice(0, 8)}.zip"`,
        },
    });
}

export async function POST(request: Request) {
    try {
        const { deliveryId } = await request.json();
        return await exportDelivery(deliveryId);
    } catch (e) {
        console.error('Export error:', e);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const deliveryId = request.nextUrl.searchParams.get('deliveryId') || '';
        return await exportDelivery(deliveryId);
    } catch (e) {
        console.error('Export error:', e);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}
