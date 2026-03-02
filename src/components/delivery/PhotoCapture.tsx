'use client';

import { useRef } from 'react';
import styles from './PhotoCapture.module.css';

interface PhotoCaptureProps {
    label: string;
    icon: string;
    onCapture: (file: File, preview: string) => void;
    captured?: string | null;
}

export default function PhotoCapture({ label, icon, onCapture, captured }: PhotoCaptureProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        onCapture(file, preview);

        // Reset input so same file can be re-selected
        e.target.value = '';
    };

    const handleClick = () => inputRef.current?.click();

    return (
        <div className={styles.captureWrapper}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleChange}
                className={styles.hiddenInput}
            />

            {captured ? (
                <div className={styles.previewWrapper} onClick={handleClick}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={captured} alt={label} className={styles.previewImage} />
                    <div className={styles.retakeOverlay}>
                        <span className={styles.retakeText}>📷 Tap to retake</span>
                    </div>
                </div>
            ) : (
                <button type="button" className={styles.captureButton} onClick={handleClick}>
                    <span className={styles.captureIcon}>{icon}</span>
                    <span className={styles.captureLabel}>{label}</span>
                    <span className={styles.captureHint}>Tap to take photo</span>
                </button>
            )}
        </div>
    );
}
