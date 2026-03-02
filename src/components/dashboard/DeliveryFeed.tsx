'use client';

import { useRouter } from 'next/navigation';
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
    suppliers?: string[];
    activeSupplier?: string;
    onSupplierChange?: (supplier: string) => void;
}

const FILTERS = [
    { key: 'today', label: 'Today' },
    { key: 'complete', label: 'Complete' },
    { key: 'issue', label: 'Issues' },
    { key: 'open', label: 'Open' },
    { key: 'pending', label: 'Pending' },
];

const statusBadge = (status: string) => {
    switch (status) {
        case 'complete': return <span className="badge badge-green">Complete</span>;
        case 'issue': return <span className="badge badge-orange">Issue</span>;
        default: return <span className="badge badge-blue">Pending</span>;
    }
};

export default function DeliveryFeed({
    deliveries, onFilterChange, activeFilter,
    suppliers, activeSupplier, onSupplierChange,
}: DeliveryFeedProps) {
    const router = useRouter();

    const handleCardClick = (id: string) => {
        router.push(`/delivery/${id}`);
    };

    return (
        <div>
            <div className={styles.filterRow}>
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

                {onSupplierChange && (
                    <select
                        id="supplier-filter"
                        className={styles.supplierSelect}
                        value={activeSupplier || ''}
                        onChange={(e) => onSupplierChange(e.target.value)}
                        aria-label="Supplier Filter"
                    >
                        <option value="">All Suppliers</option>
                        {(suppliers || []).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                )}
            </div>

            <div className={styles.feedList}>
                {deliveries.length === 0 ? (
                    <div className={styles.emptyState}>No deliveries found</div>
                ) : (
                    deliveries.map((d) => (
                        <div
                            key={d.id}
                            className={styles.deliveryCard}
                            onClick={() => handleCardClick(d.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(d.id)}
                            id={`delivery-card-${d.id}`}
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTime}>
                                    {new Date(d.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {statusBadge(d.status)}
                            </div>
                            <div className={styles.cardSupplier}>
                                {d.supplier || 'Unknown supplier'}
                            </div>
                            <div className={styles.cardMeta}>
                                {d.truck_plate && <span>{d.truck_plate}</span>}
                                <span>{d.items_count} items</span>
                                <span>{d.photos_count} photos</span>
                                {d.missing_docs > 0 && (
                                    <span style={{ color: 'var(--red)' }}>{d.missing_docs} docs missing</span>
                                )}
                            </div>
                            {d.ai_summary && (
                                <div className={styles.cardSummary}>{d.ai_summary}</div>
                            )}
                            <div className={styles.cardArrow}>→</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
