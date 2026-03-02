'use client';

import { useEffect, useState } from 'react';
import styles from './MaterialProgress.module.css';

interface MaterialItem {
    material_type: string;
    quantity_ordered: number;
    quantity_delivered: number;
}

export default function MaterialProgress() {
    const [materials, setMaterials] = useState<MaterialItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dashboard/material-progress')
            .then((res) => res.json())
            .then((data) => setMaterials(data.materials || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className={styles.section}>
                <h2 className={styles.title}>Material Progress</h2>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    if (materials.length === 0) {
        return (
            <div className={styles.section}>
                <h2 className={styles.title}>Material Progress</h2>
                <div className={styles.empty}>No expected orders configured</div>
            </div>
        );
    }

    return (
        <div className={styles.section} id="material-progress">
            <h2 className={styles.title}>Material Progress</h2>
            <div className={styles.list}>
                {materials.map((m, i) => {
                    const pct = m.quantity_ordered > 0
                        ? Math.min(100, Math.round((m.quantity_delivered / m.quantity_ordered) * 100))
                        : 0;
                    const overDelivery = m.quantity_delivered > m.quantity_ordered;

                    return (
                        <div key={i} className={styles.item}>
                            <div className={styles.itemHeader}>
                                <span className={styles.itemName}>{m.material_type}</span>
                                <span className={styles.itemCount}>
                                    {m.quantity_delivered} / {m.quantity_ordered}
                                </span>
                            </div>
                            <div className={styles.barTrack}>
                                <div
                                    className={`${styles.barFill} ${overDelivery ? styles.barOver : ''}`}
                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                    role="progressbar"
                                    aria-valuenow={pct}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                />
                            </div>
                            <div className={styles.itemPct}>
                                {pct}%
                                {overDelivery && <span className={styles.overLabel}>Over-delivery</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
