'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, X, Shield, Trash2 } from 'lucide-react';
import styles from './DeliveryDetail.module.css';

interface Photo {
    id: string;
    photo_type: string;
    storage_path: string;
    ai_extracted_text: string | null;
    url?: string;
}

interface DeliveryData {
    id: string;
    created_at: string;
    supplier: string | null;
    truck_plate: string | null;
    status: string;
    ai_summary: string | null;
    notes: string | null;
    items: { material_type: string; quantity_delivered: number; unit: string | null }[];
    photos: Photo[];
    documents: { doc_type: string; status: string }[];
}

interface Props {
    deliveryId: string;
    role: string;
}

export default function DeliveryDetailClient({ deliveryId, role }: Props) {
    const router = useRouter();
    const [delivery, setDelivery] = useState<DeliveryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

    const fetchDelivery = useCallback(async () => {
        try {
            const res = await fetch(`/api/deliveries/${deliveryId}`);
            if (res.ok) {
                const data = await res.json();
                setDelivery(data);
            }
        } catch {
            // Silently fail
        } finally {
            setLoading(false);
        }
    }, [deliveryId]);

    useEffect(() => {
        fetchDelivery();
    }, [fetchDelivery]);

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await fetch('/api/deliveries/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deliveryId }),
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `delivery-${deliveryId.slice(0, 8)}.zip`;
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch {
            // Silently fail
        } finally {
            setExporting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to permanently delete this delivery?')) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/deliveries/${deliveryId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.replace('/dashboard');
            } else {
                alert('Failed to delete delivery');
            }
        } catch {
            alert('Error deleting delivery');
        } finally {
            setDeleting(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.loadingState}>Loading delivery details...</div>
            </div>
        );
    }

    if (!delivery) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.loadingState}>Delivery not found</div>
                <button className="btn btn-ghost" onClick={handleBack}>Go Back</button>
            </div>
        );
    }

    const statusClass = delivery.status === 'complete' ? 'badge-green'
        : delivery.status === 'issue' ? 'badge-orange' : 'badge-blue';
    const statusLabel = delivery.status === 'complete' ? 'Complete'
        : delivery.status === 'issue' ? 'Issue' : 'Pending';

    // Group photos by type
    const photoGroups = {
        truck: delivery.photos.filter((p) => p.photo_type === 'truck'),
        material: delivery.photos.filter((p) => p.photo_type === 'material'),
        document: delivery.photos.filter((p) => p.photo_type === 'document'),
    };

    return (
        <div className={styles.wrapper}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <button className={`btn btn-ghost ${styles.backBtn}`} onClick={handleBack} id="back-button">
                    <ArrowLeft size={16} /> Back
                </button>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{ color: 'var(--red-500)', borderColor: 'var(--red-500)' }}
                    >
                        <Trash2 size={16} />
                        {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                        className={`btn btn-primary ${styles.exportBtn}`}
                        onClick={handleExport}
                        disabled={exporting}
                        id="export-zip-button"
                    >
                        <Download size={16} />
                        {exporting ? 'Exporting...' : 'Export Delivery'}
                    </button>
                </div>
            </div>

            <div className="container" style={{ padding: '0 var(--space-md) var(--space-2xl)' }}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>
                            {delivery.supplier || 'Unknown Supplier'}
                        </h1>
                        <p className={styles.subtitle}>
                            {new Date(delivery.created_at).toLocaleDateString('en-GB', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                            })}
                            {' · '}
                            {new Date(delivery.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <span className={`badge ${statusClass}`}>{statusLabel}</span>
                </div>

                {/* AI Summary */}
                {delivery.ai_summary && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>AI Summary</h2>
                        <div className={styles.summaryCard}>
                            {delivery.ai_summary}
                        </div>
                    </div>
                )}

                {/* Meta Info */}
                <div className={styles.metaRow}>
                    {delivery.truck_plate && (
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Truck</span>
                            <span className={styles.metaValue}>{delivery.truck_plate}</span>
                        </div>
                    )}
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Items</span>
                        <span className={styles.metaValue}>{delivery.items.length}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Photos</span>
                        <span className={styles.metaValue}>{delivery.photos.length}</span>
                    </div>
                    {role === 'manager' && (
                        <div className={styles.readOnlyBadge}>
                            <Shield size={12} /> Read-only
                        </div>
                    )}
                </div>

                {/* Photo Gallery */}
                {delivery.photos.length > 0 && (
                    <div className={styles.section} id="photos-section">
                        <h2 className={styles.sectionTitle}>Photos</h2>
                        {Object.entries(photoGroups).map(([type, photos]) =>
                            photos.length > 0 && (
                                <div key={type} className={styles.photoGroup}>
                                    <h3 className={styles.photoGroupLabel}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </h3>
                                    <div className={styles.photoGrid}>
                                        {photos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className={styles.photoCard}
                                                onClick={() => setExpandedPhoto(
                                                    expandedPhoto === photo.id ? null : photo.id
                                                )}
                                            >
                                                {photo.url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={photo.url}
                                                        alt={`${type} photo`}
                                                        className={styles.photoImg}
                                                    />
                                                ) : (
                                                    <div className={styles.photoPlaceholder}>
                                                        📷 {type}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* Expanded Photo Lightbox */}
                {expandedPhoto && (
                    <div className={styles.lightbox} onClick={() => setExpandedPhoto(null)}>
                        <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                            {(() => {
                                const photo = delivery.photos.find((p) => p.id === expandedPhoto);
                                return photo?.url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={photo.url} alt="Full size" className={styles.lightboxImg} />
                                ) : (
                                    <div className={styles.photoPlaceholder}>Photo not available</div>
                                );
                            })()}
                            <button className={styles.lightboxClose} onClick={() => setExpandedPhoto(null)}>
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Materials List */}
                {delivery.items.length > 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Materials</h2>
                        <div className={styles.itemsList}>
                            {delivery.items.map((item, i) => (
                                <div key={i} className={styles.itemRow}>
                                    <span>{item.material_type || 'Unknown'}</span>
                                    <span className={styles.itemQty}>
                                        {item.quantity_delivered}{item.unit ? ` ${item.unit}` : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Document Status */}
                {delivery.documents.length > 0 && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Documents</h2>
                        <div className={styles.docStatusList}>
                            {delivery.documents.map((doc, i) => (
                                <div key={i} className={styles.docStatusRow}>
                                    <span className={`badge ${doc.status === 'received' ? 'badge-green' : doc.status === 'missing' ? 'badge-red' : 'badge-blue'}`}>
                                        {doc.doc_type}
                                    </span>
                                    <span className={styles.docStatusText}>{doc.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Raw Extracted Text */}
                {delivery.photos.some((p) => p.ai_extracted_text) && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Extracted Text (Raw)</h2>
                        {delivery.photos
                            .filter((p) => p.ai_extracted_text)
                            .map((photo) => (
                                <div key={photo.id} className={styles.rawTextCard}>
                                    <p className={styles.rawTextLabel}>{photo.photo_type} photo</p>
                                    <pre className={styles.rawText}>{photo.ai_extracted_text}</pre>
                                </div>
                            ))}
                    </div>
                )}

                {/* Notes */}
                {delivery.notes && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Notes</h2>
                        <div className={styles.summaryCard}>{delivery.notes}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
