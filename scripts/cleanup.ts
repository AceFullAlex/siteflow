import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDatabase() {
    console.log('🧹 Starting database cleanup...');

    // 1. Delete all document statuses
    const { error: docsError } = await supabase
        .from('document_tracking')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (docsError) console.error('Error deleting documents:', docsError);
    else console.log('✅ Cleared document_tracking table');

    // 2. Delete all photos
    const { error: photosError } = await supabase
        .from('delivery_photos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (photosError) console.error('Error deleting photos:', photosError);
    else console.log('✅ Cleared delivery_photos table');

    // 3. Delete all delivery items
    const { error: itemsError } = await supabase
        .from('delivery_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (itemsError) console.error('Error deleting delivery_items:', itemsError);
    else console.log('✅ Cleared delivery_items table');

    // 4. Delete all deliveries
    const { error: deliveriesError } = await supabase
        .from('deliveries')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deliveriesError) console.error('Error deleting deliveries:', deliveriesError);
    else console.log('✅ Cleared deliveries table');

    // 5. Delete all expected deliveries
    const { error: expectedError } = await supabase
        .from('expected_orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (expectedError) console.error('Error deleting expected_orders:', expectedError);
    else console.log('✅ Cleared expected_orders table');

    // Note: We deliberately do NOT delete the `users` table so logins still work

    console.log('✨ Database is now a clean slate for testing!');

    // Optionally clear the storage bucket if files exist
    try {
        const { data: files } = await supabase.storage.from('delivery-documents').list('', { limit: 100 });
        if (files && files.length > 0) {
            const fileNames = files.map(f => f.name);
            await supabase.storage.from('delivery-documents').remove(fileNames);
            console.log(`✅ Cleared ${files.length} files from storage bucket`);
        }
    } catch (e) {
        console.log('Storage cleanup skipped or failed (permissions).');
    }
}

cleanDatabase().catch(console.error);
