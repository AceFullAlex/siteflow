export interface User {
    id: string;
    name: string;
    pin: string;
    role: 'admin' | 'unloader' | 'manager';
    created_at: string;
}

export interface Delivery {
    id: string;
    created_at: string;
    created_by: string;
    supplier: string | null;
    truck_plate: string | null;
    status: 'pending' | 'complete' | 'issue';
    notes: string | null;
    ai_summary: string | null;
}

export interface DeliveryItem {
    id: string;
    delivery_id: string;
    material_type: string | null;
    material_id: string | null;
    quantity_delivered: number | null;
    unit: string | null;
    condition: 'good' | 'damaged' | 'unknown';
    notes: string | null;
}

export interface DeliveryPhoto {
    id: string;
    delivery_id: string;
    photo_type: 'truck' | 'material' | 'document';
    storage_path: string;
    ai_extracted_text: string | null;
    uploaded_at: string;
}

export interface ExpectedOrder {
    id: string;
    material_type: string;
    material_id: string | null;
    quantity_ordered: number;
    supplier: string | null;
    expected_date: string | null;
    priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface DocumentTracking {
    id: string;
    delivery_id: string;
    doc_type: 'CMR' | 'TAD' | 'DN' | 'POD';
    status: 'received' | 'missing' | 'requested';
    flagged_at: string;
    resolved_at: string | null;
}
