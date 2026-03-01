import { ai, geminiModel } from './client';
import { createClient } from '@/lib/supabase/server';

const SCAN_PROMPT = `You are analyzing a delivery document photo from a datacenter construction site.
Extract ALL of the following information you can find. Return ONLY valid JSON, no markdown.

{
  "documentType": "CMR" | "TAD" | "DN" | "POD" | "unknown",
  "supplierName": "string or null",
  "deliveryNoteNumber": "string or null",
  "date": "YYYY-MM-DD or null",
  "truckRegistration": "string or null",
  "cmrNumber": "string or null",
  "materials": [{"name": "string", "quantity": "number or null", "unit": "string or null"}],
  "confidence": 0.0-1.0,
  "rawText": "all readable text from the document"
}

Common materials: drainage pipes, manholes, ducts, aggregates, precast concrete, formwork, steel reinforcement, geotextile, cable trays, concrete blocks.
Document types: CMR (international transport), TAD (transport advice), DN (delivery note), POD (proof of delivery).`;

export async function scanDocument(base64: string, mimeType: string) {
    try {
        const response = await ai.models.generateContent({
            model: geminiModel,
            contents: [{
                role: 'user',
                parts: [
                    { text: SCAN_PROMPT },
                    { inlineData: { data: base64, mimeType } },
                ],
            }],
        });

        const text = response.text || '';
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        return JSON.parse(jsonMatch[0]);
    } catch (e) {
        console.error('AI scan error:', e);
        return null;
    }
}

export async function processDeliveryDocuments(deliveryId: string) {
    const supabase = await createClient();

    // Get document photos for this delivery
    const { data: photos } = await supabase
        .from('delivery_photos')
        .select('*')
        .eq('delivery_id', deliveryId)
        .eq('photo_type', 'document');

    if (!photos?.length) return;

    let bestSupplier: string | null = null;
    let bestTruck: string | null = null;
    const allMaterials: { name: string; quantity: number | null; unit: string | null }[] = [];
    const summaryParts: string[] = [];
    const foundDocTypes: string[] = [];

    for (const photo of photos) {
        // Download photo from storage
        const { data: fileData } = await supabase.storage
            .from('delivery-photos')
            .download(photo.storage_path);

        if (!fileData) continue;

        const buffer = await fileData.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = 'image/jpeg';

        const result = await scanDocument(base64, mimeType);
        if (!result) continue;

        // Update photo with extracted text
        await supabase
            .from('delivery_photos')
            .update({ ai_extracted_text: result.rawText || null })
            .eq('id', photo.id);

        // Aggregate results
        if (result.supplierName && !bestSupplier) bestSupplier = result.supplierName;
        if (result.truckRegistration && !bestTruck) bestTruck = result.truckRegistration;
        if (result.documentType && result.documentType !== 'unknown') {
            foundDocTypes.push(result.documentType);
        }
        if (result.materials?.length) {
            allMaterials.push(...result.materials);
        }
        if (result.deliveryNoteNumber) {
            summaryParts.push(`DN#${result.deliveryNoteNumber}`);
        }
    }

    // Update delivery record
    const summary = summaryParts.length
        ? `AI: ${summaryParts.join(', ')}${bestSupplier ? ` from ${bestSupplier}` : ''}`
        : bestSupplier
            ? `AI: Delivery from ${bestSupplier}`
            : 'AI: Document processed';

    await supabase
        .from('deliveries')
        .update({
            supplier: bestSupplier,
            truck_plate: bestTruck,
            ai_summary: summary,
            status: 'complete',
        })
        .eq('id', deliveryId);

    // Insert extracted materials
    if (allMaterials.length) {
        await supabase.from('delivery_items').insert(
            allMaterials.map((m) => ({
                delivery_id: deliveryId,
                material_type: m.name,
                quantity_delivered: m.quantity,
                unit: m.unit,
                condition: 'unknown',
            }))
        );
    }

    // Update document tracking
    for (const docType of foundDocTypes) {
        await supabase
            .from('document_tracking')
            .update({ status: 'received', resolved_at: new Date().toISOString() })
            .eq('delivery_id', deliveryId)
            .eq('doc_type', docType);
    }
}
