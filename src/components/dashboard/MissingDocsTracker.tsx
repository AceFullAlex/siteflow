'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import styles from './MissingDocsTracker.module.css';

interface MissingDoc {
    id: string;
    delivery_id: string;
    doc_type: string;
    status: string;
    flagged_at: string;
    supplier?: string;
}

interface MissingDocsTrackerProps {
    documents: MissingDoc[];
    onResolve: (docId: string) => void;
}

export default function MissingDocsTracker({ documents, onResolve }: MissingDocsTrackerProps) {
    const [resolving, setResolving] = useState<string | null>(null);
    const [optimisticRemoved, setOptimisticRemoved] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleResolve = async (docId: string) => {
        if (navigator.vibrate) navigator.vibrate(30);

        // Optimistic UI — remove immediately
        setOptimisticRemoved((prev) => [...prev, docId]);
        setResolving(docId);
        setError(null);

        try {
            const res = await fetch('/api/dashboard/resolve-doc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ documentId: docId }),
            });
            if (res.ok) {
                onResolve(docId);
            } else {
                // Revert optimistic removal
                setOptimisticRemoved((prev) => prev.filter((id) => id !== docId));
                setError('Failed to resolve. Try again.');
            }
        } catch {
            // Revert on network error
            setOptimisticRemoved((prev) => prev.filter((id) => id !== docId));
            setError('Connection error. Try again.');
        } finally {
            setResolving(null);
        }
    };

    const visibleDocs = documents.filter((d) => !optimisticRemoved.includes(d.id));

    return (
        <div className={styles.tracker} id="missing-documents-tracker">
            <h2 className={styles.trackerTitle}>Missing Documents</h2>
            {error && (
                <div className={styles.errorBanner}>
                    <AlertCircle size={14} /> {error}
                </div>
            )}
            {visibleDocs.length === 0 ? (
                <div className={styles.emptyState}>
                    <CheckCircle size={16} /> No missing documents — all clear
                </div>
            ) : (
                <div className={styles.docList}>
                    {visibleDocs.map((doc) => (
                        <div key={doc.id} className={styles.docCard} id={`missing-doc-${doc.id}`}>
                            <div className={styles.docInfo}>
                                <span className="badge badge-red">{doc.doc_type}</span>
                                <span className={styles.docSupplier}>{doc.supplier || 'Unknown'}</span>
                                <span className={styles.docDate}>
                                    Flagged {new Date(doc.flagged_at).toLocaleDateString('en-GB')}
                                </span>
                            </div>
                            <button
                                className={`${styles.resolveBtn} btn btn-success`}
                                onClick={() => handleResolve(doc.id)}
                                disabled={resolving === doc.id}
                                id={`resolve-btn-${doc.id}`}
                            >
                                <CheckCircle size={14} />
                                {resolving === doc.id ? 'Resolving...' : 'Resolve'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
