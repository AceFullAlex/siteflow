import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Seeds the database with test data for development/testing.
 * POST /api/seed — Creates sample deliveries, items, photos, and document tracking records.
 * Safe to call multiple times — adds data alongside existing records.
 */
export async function POST() {
    try {
        const supabase = await createClient();
        const now = new Date();
        const today = now.toISOString();

        // Ensure a manager user exists (PIN 9999)
        const { data: existingManager } = await supabase
            .from('users')
            .select('id, pin, role')
            .eq('pin', '9999')
            .limit(1);

        if (!existingManager || existingManager.length === 0) {
            const { error: userError } = await supabase.from('users').insert({
                name: 'Site Manager',
                role: 'manager',
                pin: '9999',
            });
            if (userError) {
                console.error('[SEED] Failed to create manager user:', userError.message);
            } else {
                console.log('[SEED] Created manager user with PIN 9999');
            }
        } else {
            console.log('[SEED] Manager user already exists:', existingManager[0]);
        }

        // Create sample deliveries (today's date so they show on dashboard)
        const deliveries = [
            {
                supplier: 'Aggregate Industries',
                truck_plate: 'AB12 CDE',
                status: 'complete',
                ai_summary: 'AI: DN#4521 from Aggregate Industries — 20 tonnes Type 1 aggregate',
                notes: 'Delivered to Bay 3',
                created_at: today,
            },
            {
                supplier: 'Hanson Concrete',
                truck_plate: 'FG34 HIJ',
                status: 'issue',
                ai_summary: 'AI: DN#7832 from Hanson Concrete — short delivery, 15 of 20 units received',
                notes: 'Driver reported partial load',
                created_at: today,
            },
            {
                supplier: 'Naylor Drainage',
                truck_plate: 'KL56 MNO',
                status: 'pending',
                ai_summary: null,
                notes: 'Awaiting document scan',
                created_at: today,
            },
            {
                supplier: 'Polypipe',
                truck_plate: 'UV90 WXY',
                status: 'complete',
                ai_summary: 'AI: DN#9001 from Polypipe — drainage pipes 300mm x 50',
                notes: null,
                created_at: today,
            },
        ];

        const { data: insertedDeliveries, error: delError } = await supabase
            .from('deliveries')
            .insert(deliveries)
            .select();

        if (delError || !insertedDeliveries) {
            return NextResponse.json({ error: 'Failed to insert deliveries', details: delError?.message }, { status: 500 });
        }

        // Create delivery items
        const items = [
            { delivery_id: insertedDeliveries[0].id, material_type: 'Type 1 Aggregate', quantity_delivered: 20, unit: 'tonnes', condition: 'good' },
            { delivery_id: insertedDeliveries[0].id, material_type: 'Sand', quantity_delivered: 5, unit: 'tonnes', condition: 'good' },
            { delivery_id: insertedDeliveries[1].id, material_type: 'Concrete Blocks', quantity_delivered: 15, unit: 'pallets', condition: 'damaged' },
            { delivery_id: insertedDeliveries[2].id, material_type: 'Cable Trays', quantity_delivered: 30, unit: 'units', condition: 'unknown' },
            { delivery_id: insertedDeliveries[3].id, material_type: 'Drainage Pipes 300mm', quantity_delivered: 50, unit: 'units', condition: 'good' },
        ];

        await supabase.from('delivery_items').insert(items);

        // Create document tracking (some missing, some received)
        const docTracking = [
            { delivery_id: insertedDeliveries[0].id, doc_type: 'CMR', status: 'received', flagged_at: today },
            { delivery_id: insertedDeliveries[0].id, doc_type: 'DN', status: 'received', flagged_at: today },
            { delivery_id: insertedDeliveries[1].id, doc_type: 'CMR', status: 'missing', flagged_at: today },
            { delivery_id: insertedDeliveries[1].id, doc_type: 'TAD', status: 'missing', flagged_at: today },
            { delivery_id: insertedDeliveries[2].id, doc_type: 'CMR', status: 'missing', flagged_at: today },
            { delivery_id: insertedDeliveries[2].id, doc_type: 'DN', status: 'missing', flagged_at: today },
            { delivery_id: insertedDeliveries[3].id, doc_type: 'DN', status: 'received', flagged_at: today },
        ];

        await supabase.from('document_tracking').insert(docTracking);

        // Create expected orders (for Material Progress bars)
        // Check if expected orders already exist
        const { count: existingOrders } = await supabase
            .from('expected_orders')
            .select('*', { count: 'exact', head: true });

        if (!existingOrders || existingOrders === 0) {
            const expectedOrders = [
                { material_type: 'Type 1 Aggregate', quantity_ordered: 100, supplier: 'Aggregate Industries', expected_date: today },
                { material_type: 'Concrete Blocks', quantity_ordered: 50, supplier: 'Hanson Concrete', expected_date: today },
                { material_type: 'Cable Trays', quantity_ordered: 60, supplier: 'Various', expected_date: today },
                { material_type: 'Drainage Pipes 300mm', quantity_ordered: 80, supplier: 'Polypipe', expected_date: today },
                { material_type: 'Sand', quantity_ordered: 50, supplier: 'Aggregate Industries', expected_date: today },
            ];
            await supabase.from('expected_orders').insert(expectedOrders);
        }

        return NextResponse.json({
            message: 'Database seeded successfully',
            seeded: true,
            deliveries: insertedDeliveries.length,
            items: items.length,
            documents: docTracking.length,
        });
    } catch (e) {
        console.error('Seed error:', e);
        return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
    }
}
