'use client';

import { useState, useCallback } from 'react';
import PhotoCapture from './PhotoCapture';
import styles from './DeliveryStepper.module.css';

interface PhotoData {
    file: File;
    preview: string;
}

const STEPS = [
    { label: 'Take photo of the truck', icon: '🚛', type: 'truck' as const },
    { label: 'Take photo of materials', icon: '📦', type: 'material' as const },
    { label: 'Take photos of documents', icon: '📄', type: 'document' as const },
    { label: 'Additional details (optional)', icon: '✏️', type: 'details' as const },
];

export default function DeliveryStepper() {
    const [step, setStep] = useState(0);
    const [photos, setPhotos] = useState<Record<string, PhotoData[]>>({
        truck: [],
        material: [],
        document: [],
    });
    const [supplier, setSupplier] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleCapture = useCallback((type: string, file: File, preview: string) => {
        setPhotos((prev) => ({
            ...prev,
            [type]: type === 'document'
                ? [...prev[type], { file, preview }]
                : [{ file, preview }],
        }));
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            if (supplier) formData.append('supplier', supplier);
            if (notes) formData.append('notes', notes);

            Object.entries(photos).forEach(([type, items]) => {
                items.forEach((item, i) => {
                    formData.append(`${type}_${i}`, item.file);
                });
            });

            const res = await fetch('/api/deliveries/create', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed');

            if (navigator.vibrate) navigator.vibrate(100);
            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
                setStep(0);
                setPhotos({ truck: [], material: [], document: [] });
                setSupplier('');
                setNotes('');
            }, 2500);
        } catch {
            alert('Failed to submit delivery. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const canProceed = () => {
        if (step === 0) return photos.truck.length > 0;
        if (step === 1) return photos.material.length > 0;
        if (step === 2) return photos.document.length > 0;
        return true;
    };

    if (success) {
        return (
            <div className={styles.successOverlay}>
                <span className={styles.successIcon}>✅</span>
                <span className={styles.successText}>Delivery Submitted!</span>
                <span className={styles.successSub}>Processing documents...</span>
            </div>
        );
    }

    return (
        <div className={styles.stepperWrapper}>
            <div className={styles.header}>
                <span className={styles.headerTitle}>📦 New Delivery</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Step {step + 1} of {STEPS.length}
                </span>
            </div>

            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
            </div>

            <div className={styles.stepContent}>
                <p className={styles.stepLabel}>{STEPS[step].label}</p>

                {step < 3 && (
                    <PhotoCapture
                        label={STEPS[step].label}
                        icon={STEPS[step].icon}
                        onCapture={(file, preview) => handleCapture(STEPS[step].type, file, preview)}
                        captured={
                            step < 2
                                ? photos[STEPS[step].type]?.[0]?.preview || null
                                : null
                        }
                    />
                )}

                {step === 2 && photos.document.length > 0 && (
                    <div className={styles.docList}>
                        {photos.document.map((doc, i) => (
                            <div key={i} className={styles.docItem}>
                                📄 Document {i + 1} captured
                            </div>
                        ))}
                        <p className={styles.stepHint}>Tap the camera again to add more documents</p>
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.detailsForm}>
                        <div>
                            <label className={styles.formLabel}>Supplier Name</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g. Hanson, Tarmac..."
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={styles.formLabel}>Notes</label>
                            <textarea
                                className="input"
                                placeholder="Any issues, damage, missing items..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.navigation}>
                {step > 0 && (
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setStep(step - 1)}
                    >
                        ← Back
                    </button>
                )}
                {step < 3 ? (
                    <button
                        type="button"
                        className="btn btn-primary btn-large"
                        disabled={!canProceed()}
                        onClick={() => setStep(step + 1)}
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        type="button"
                        className="btn btn-success btn-large"
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? 'Submitting...' : '✓ Submit Delivery'}
                    </button>
                )}
            </div>
        </div>
    );
}
