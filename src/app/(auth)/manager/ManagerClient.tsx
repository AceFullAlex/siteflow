'use client';

import { useState, useEffect, useCallback } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import NavHeader from '@/components/layout/NavHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import DeliveryFeed from '@/components/dashboard/DeliveryFeed';
import MaterialProgress from '@/components/dashboard/MaterialProgress';
import styles from './Manager.module.css';

interface Stats {
    deliveriesToday: number;
    expectedToday: number;
    issueCount: number;
    missingDocs: number;
    behindSchedule: number;
}

export default function ManagerClient({ name }: { name: string }) {
    const [stats, setStats] = useState<Stats>({ deliveriesToday: 0, expectedToday: 0, issueCount: 0, missingDocs: 0, behindSchedule: 0 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [filter, setFilter] = useState('today');
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const [statsRes, deliveriesRes] = await Promise.all([
            fetch('/api/dashboard/stats'),
            fetch(`/api/dashboard/deliveries?filter=${filter}`),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (deliveriesRes.ok) {
            const data = await deliveriesRes.json();
            setDeliveries(data.deliveries || []);
        }
        setLoading(false);
    }, [filter]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    // AI Diary — generate a 1-line summary
    const diaryLine = stats.deliveriesToday > 0
        ? `${stats.deliveriesToday} ${stats.deliveriesToday === 1 ? 'delivery' : 'deliveries'} today${stats.issueCount > 0 ? `, ${stats.issueCount} flagged` : ''}${stats.missingDocs > 0 ? `, ${stats.missingDocs} docs missing` : ' — all clear'}.`
        : 'No deliveries recorded yet today.';

    return (
        <>
            <NavHeader name={name} role="Manager" />
            <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
                <div className={styles.headerRow}>
                    <div>
                        <h1 className={styles.pageTitle}>Overview</h1>
                        <p className={styles.pageDate}>{today}</p>
                    </div>
                    <span className={styles.readOnlyBadge}>
                        <Shield size={12} /> Read-Only
                    </span>
                </div>

                {/* AI Diary Summary */}
                <div className={styles.diaryCard}>
                    <span className={styles.diaryIcon}>🤖</span>
                    <span className={styles.diaryText}>{diaryLine}</span>
                    {stats.issueCount > 0 && (
                        <AlertTriangle size={14} className={styles.diaryAlert} />
                    )}
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        <div className="skeleton skeleton-card" />
                        <div className="skeleton skeleton-card" />
                        <div className="skeleton skeleton-card" />
                    </div>
                ) : (
                    <>
                        <StatsCards {...stats} />
                        <DeliveryFeed deliveries={deliveries} onFilterChange={setFilter} activeFilter={filter} />
                        <MaterialProgress />
                    </>
                )}
            </div>
        </>
    );
}
