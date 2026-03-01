'use client';

import { useState } from 'react';
import styles from './DeliveryFeed.module.css';

interface DeliveryItem {
    id: string;
    created_at: string;
    supplier: string | null;
    truck_plate: string | null;
    status: string;
    ai_summary: string | null;
    items_count: number;
    photos_count: number;
    missing_docs: number;
}

interface DeliveryFeedProps {
    deliveries: DeliveryItem[];
    onFilterChange: (filter: string) => void;
    activeFilter: string;
}

const FILTERS = [
    { key: 'today', label: 'Today' },
    { key: 'complete', label: '✅ Complete' },
    { key: 'issue', label: '⚠️ Issue' },
    { key: 'pending', label: '🔄 Pending' },
];

const statusBadge = (status: string) => {
    switch (status) {
        case 'complete': return <span className="badge badge-green">✅ Complete</span>;
        case 'issue': return <span className="badge badge-orange">⚠️ Issue</span>;
        default: return <span className="badge badge-blue">🔄 Pending</span>;
    }
};

export default function DeliveryFeed({ deliveries, onFilterChange, activeFilter }: DeliveryFeedProps) {
    return (
        <div>
            <div className={styles.filterTabs}>
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        className={`${styles.filterTab} ${activeFilter === f.key ? styles.filterTabActive : ''}`}
                        onClick={() => onFilterChange(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className={styles.feedList}>
                {deliveries.length === 0 ? (
                    <div className={styles.emptyState}>No deliveries found</div>
                ) : (
                    deliveries.map((d) => (
                        <div key={d.id} className={styles.deliveryCard}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTime}>
                                    {new Date(d.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {statusBadge(d.status)}
                            </div>
                            <div className={styles.cardSupplier}>
                                {d.supplier || 'Unknown Supplier'}
                            </div>
                            <div className={styles.cardMeta}>
                                {d.truck_plate && <span>🚛 {d.truck_plate}</span>}
                                <span>📦 {d.items_count} items</span>
                                <span>📷 {d.photos_count} photos</span>
                                {d.missing_docs > 0 && (
                                    <span style={{ color: 'var(--red)' }}>📄 {d.missing_docs} missing</span>
                                )}
                            </div>
                            {d.ai_summary && (
                                <div className={styles.cardSummary}>{d.ai_summary}</div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
