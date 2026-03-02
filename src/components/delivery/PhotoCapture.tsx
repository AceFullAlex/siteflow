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

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200; // Resize to max width 1200px
                    let scaleSize = 1;

                    if (img.width > MAX_WIDTH) {
                        scaleSize = MAX_WIDTH / img.width;
                    }

                    canvas.width = img.width * scaleSize;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            resolve(file); // Fallback to original
                        }
                    }, 'image/jpeg', 0.6); // 60% quality JPEG
                };
            };
        });
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Compress the image so it doesn't hit Vercel's 4.5MB payload limit
        const compressedFile = await compressImage(file);

        const preview = URL.createObjectURL(compressedFile);
        onCapture(compressedFile, preview);

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
