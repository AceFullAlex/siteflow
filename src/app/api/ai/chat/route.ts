import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ai, geminiModel } from '@/lib/gemini/client';
import { createClient } from '@/lib/supabase/server';

const SYSTEM_PROMPT = `You are SiteFlow AI, a helpful assistant for a datacenter construction site logistics team.
You help answer questions about deliveries by generating Supabase query plans.

Available tables:
- deliveries: id, created_at, supplier, truck_plate, status (pending/complete/issue), notes, ai_summary
- delivery_items: id, delivery_id, material_type, material_id, quantity_delivered, unit, condition
- delivery_photos: id, delivery_id, photo_type (truck/material/document), storage_path
- document_tracking: id, delivery_id, doc_type (CMR/TAD/DN/POD), status (received/missing/requested)
- expected_orders: id, material_type, quantity_ordered, supplier, expected_date, priority
- users: id, name, role

Return ONLY valid JSON with this structure:
{
  "query_type": "select" | "count" | "aggregate",
  "table": "table_name",
  "select": "columns or *",
  "filters": [{"column": "col", "operator": "eq|gt|lt|gte|lte|like|is", "value": "val"}],
  "order": {"column": "col", "ascending": false},
  "limit": 10,
  "explanation": "what this query does"
}`;

const FORMAT_PROMPT = `You are SiteFlow AI. Format these database results into a clear, helpful answer.
Be concise. Use numbers and bullet points when helpful. Keep it under 150 words.`;

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

        const { message } = await request.json();
        if (!message) {
            return NextResponse.json({ error: 'No message' }, { status: 400 });
        }

        // Step 1: Get query plan from Gemini
        const planResponse = await ai.models.generateContent({
            model: geminiModel,
            contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nUser question: "${message}"` }] }],
        });

        const planText = planResponse.text || '';
        const jsonMatch = planText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return NextResponse.json({ answer: "I couldn't understand that question. Try asking about deliveries, missing documents, or materials." });
        }

        const plan = JSON.parse(jsonMatch[0]);

        // Step 2: Execute the query
        const supabase = await createClient();
        let query = supabase.from(plan.table).select(plan.select || '*');

        if (plan.filters) {
            for (const f of plan.filters) {
                if (f.operator === 'eq') query = query.eq(f.column, f.value);
                else if (f.operator === 'gt') query = query.gt(f.column, f.value);
                else if (f.operator === 'lt') query = query.lt(f.column, f.value);
                else if (f.operator === 'gte') query = query.gte(f.column, f.value);
                else if (f.operator === 'lte') query = query.lte(f.column, f.value);
                else if (f.operator === 'like') query = query.like(f.column, f.value);
                else if (f.operator === 'is') query = query.is(f.column, f.value === 'null' ? null : f.value);
            }
        }

        if (plan.order) {
            query = query.order(plan.order.column, { ascending: plan.order.ascending ?? false });
        }

        query = query.limit(plan.limit || 20);

        let result;
        if (plan.query_type === 'count') {
            const { count } = await supabase
                .from(plan.table)
                .select('*', { count: 'exact', head: true });
            result = { count };
        } else {
            const { data, error } = await query;
            if (error) {
                return NextResponse.json({ answer: `Query error: ${error.message}` });
            }
            result = data;
        }

        // Step 3: Format the results
        const formatResponse = await ai.models.generateContent({
            model: geminiModel,
            contents: [{
                role: 'user',
                parts: [{ text: `${FORMAT_PROMPT}\n\nUser asked: "${message}"\nQuery: ${plan.explanation}\nResults: ${JSON.stringify(result).slice(0, 3000)}` }],
            }],
        });

        return NextResponse.json({ answer: formatResponse.text || 'No results found.' });
    } catch (e) {
        console.error('Chat error:', e);
        return NextResponse.json({ answer: 'Something went wrong. Please try again.' });
    }
}
