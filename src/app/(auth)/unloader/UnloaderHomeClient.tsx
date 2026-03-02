'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, CheckCircle, Truck, Zap } from 'lucide-react';
import NavHeader from '@/components/layout/NavHeader';
import DeliveryStepper from '@/components/delivery/DeliveryStepper';
import styles from './UnloaderHome.module.css';

interface RecentDelivery {
    id: string;
    supplier: string | null;
    status: string;
    created_at: string;
}

interface UnloaderStats {
    todayCount: number;
    expectedToday: number;
    weekCount: number;
    streak: number;
}

export default function UnloaderHomeClient({ name, userId }: { name: string; userId: string }) {
    const [showStepper, setShowStepper] = useState(false);
    const [stats, setStats] = useState<UnloaderStats>({ todayCount: 0, expectedToday: 0, weekCount: 0, streak: 1 });
    const [recentDeliveries, setRecentDeliveries] = useState<RecentDelivery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch unloader-specific stats
        Promise.all([
            fetch('/api/dashboard/stats').then(r => r.json()),
            fetch('/api/dashboard/deliveries?filter=today').then(r => r.json()),
        ]).then(([statsData, deliveriesData]) => {
            setStats({
                todayCount: statsData.deliveriesToday || 0,
                expectedToday: statsData.expectedToday || 0,
                weekCount: (deliveriesData.deliveries || []).length,
                streak: 1,
            });
            setRecentDeliveries((deliveriesData.deliveries || []).slice(0, 6));
        }).catch(() => { }).finally(() => setLoading(false));
    }, [userId]);

    if (showStepper) {
        return <DeliveryStepper />;
    }

    const progressPct = stats.expectedToday > 0
        ? Math.min(100, Math.round((stats.todayCount / stats.expectedToday) * 100))
        : 0;

    return (
        <>
            <NavHeader name={name} role="Unloader" />
            <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
                {/* Welcome */}
                <div className={styles.welcome}>
                    <h1 className={styles.greeting}>
                        Welcome, <span className={styles.nameHighlight}>{name}</span>
                    </h1>
                    <p className={styles.subtitle}>Ready to log deliveries</p>
                </div>

                {/* Progress Card */}
                <div className={styles.progressCard}>
                    <div className={styles.progressHeader}>
                        <div>
                            <span className={styles.progressLabel}>Deliveries Today</span>
                            <div className={styles.progressCount}>
                                <span className={styles.countCurrent}>{stats.todayCount}</span>
                                <span className={styles.countDivider}>/</span>
                                <span className={styles.countExpected}>{stats.expectedToday}</span>
                                <span className={styles.countUnit}>deliveries</span>
                            </div>
                        </div>
                        <div className={styles.progressPct}>{progressPct}%</div>
                    </div>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>

                {/* Stats Row */}
                <div className={styles.statsRow}>
                    <div className={styles.miniStat}>
                        <Truck size={18} className={styles.miniIcon} />
                        <span className={styles.miniValue}>{stats.weekCount}</span>
                        <span className={styles.miniLabel}>this week</span>
                    </div>
                    <div className={styles.miniStat}>
                        <Zap size={18} className={styles.miniIcon} />
                        <span className={styles.miniValue}>{stats.streak} day</span>
                        <span className={styles.miniLabel}>streak</span>
                    </div>
                    <div className={styles.miniStat}>
                        <CheckCircle size={18} className={styles.miniIcon} />
                        <span className={styles.miniValue}>{stats.todayCount * 10}</span>
                        <span className={styles.miniLabel}>Points</span>
                    </div>
                </div>

                {/* New Delivery CTA */}
                <button
                    className={styles.ctaButton}
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        setShowStepper(true);
                    }}
                    id="new-delivery-button"
                >
                    <Plus size={22} strokeWidth={2.5} />
                    Log New Delivery
                </button>

                {/* Recent Deliveries — Hall of Fame */}
                {!loading && recentDeliveries.length > 0 && (
                    <div className={styles.recentSection}>
                        <h2 className={styles.sectionTitle}>Recent Deliveries</h2>
                        <div className={styles.recentScroll}>
                            {recentDeliveries.map((d) => (
                                <div key={d.id} className={styles.recentCard}>
                                    <div className={styles.recentSupplier}>
                                        {d.supplier || 'Unknown'}
                                    </div>
                                    <div className={styles.recentTime}>
                                        {new Date(d.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    {d.status === 'complete' && (
                                        <div className={styles.recentBadge}>
                                            <CheckCircle size={12} /> AI Verified
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className={styles.skeletonGroup}>
                        <div className="skeleton skeleton-card" />
                        <div className="skeleton skeleton-card" />
                    </div>
                )}
            </div>
        </>
    );
}
