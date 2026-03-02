'use client';

import { useState, useEffect, useCallback } from 'react';
import { LayoutGrid, Truck, Package } from 'lucide-react';
import NavHeader from '@/components/layout/NavHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import DeliveryFeed from '@/components/dashboard/DeliveryFeed';
import MissingDocsTracker from '@/components/dashboard/MissingDocsTracker';
import MaterialProgress from '@/components/dashboard/MaterialProgress';
import AIChatPanel from '@/components/dashboard/AIChatPanel';
import styles from './Dashboard.module.css';

interface Stats {
    deliveriesToday: number;
    expectedToday: number;
    issueCount: number;
    missingDocs: number;
    behindSchedule: number;
}

interface MissingDoc {
    id: string;
    delivery_id: string;
    doc_type: string;
    status: string;
    flagged_at: string;
    supplier?: string;
}

const TABS = [
    { key: 'action', label: 'Action Center', icon: LayoutGrid },
    { key: 'deliveries', label: 'Deliveries', icon: Truck },
    { key: 'materials', label: 'Materials', icon: Package },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function DashboardClient({ name }: { name: string }) {
    const [activeTab, setActiveTab] = useState<TabKey>('action');
    const [stats, setStats] = useState<Stats>({ deliveriesToday: 0, expectedToday: 0, issueCount: 0, missingDocs: 0, behindSchedule: 0 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [filter, setFilter] = useState('today');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [suppliers, setSuppliers] = useState<string[]>([]);
    const [missingDocsList, setMissingDocsList] = useState<MissingDoc[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const params = new URLSearchParams({ filter });
        if (supplierFilter) params.set('supplier', supplierFilter);

        const [statsRes, deliveriesRes, docsRes] = await Promise.all([
            fetch('/api/dashboard/stats'),
            fetch(`/api/dashboard/deliveries?${params}`),
            fetch('/api/dashboard/deliveries?filter=missing_docs'),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (deliveriesRes.ok) {
            const data = await deliveriesRes.json();
            const delivs = data.deliveries || [];
            setDeliveries(delivs);

            const uniqueSuppliers = [...new Set(
                delivs.map((d: { supplier: string | null }) => d.supplier).filter(Boolean)
            )] as string[];
            setSuppliers((prev) => {
                const merged = [...new Set([...prev, ...uniqueSuppliers])];
                return merged.sort();
            });
        }
        if (docsRes.ok) {
            const data = await docsRes.json();
            setMissingDocsList(data.missingDocs || []);
        }
        setLoading(false);
    }, [filter, supplierFilter]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleResolve = (docId: string) => {
        setMissingDocsList((prev) => prev.filter((d) => d.id !== docId));
        fetch('/api/dashboard/stats').then((r) => r.json()).then(setStats).catch(() => { });
    };

    const handleTabSwitch = (tab: TabKey) => {
        if (navigator.vibrate) navigator.vibrate(30);
        setActiveTab(tab);
    };

    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <>
            <NavHeader name={name} role="Admin" />
            <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <p className={styles.pageDate}>{today}</p>
                </div>

                {/* Tab Bar */}
                <div className={styles.tabBar}>
                    {TABS.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
                            onClick={() => handleTabSwitch(key)}
                            id={`tab-${key}`}
                        >
                            <Icon size={16} strokeWidth={2} />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className={styles.tabContent}>
                    {loading ? (
                        <div className={styles.skeletonGroup}>
                            <div className="skeleton skeleton-card" />
                            <div className="skeleton skeleton-card" />
                            <div className="skeleton skeleton-card" />
                        </div>
                    ) : (
                        <>
                            {activeTab === 'action' && (
                                <>
                                    <StatsCards {...stats} />
                                    <MissingDocsTracker documents={missingDocsList} onResolve={handleResolve} />
                                </>
                            )}
                            {activeTab === 'deliveries' && (
                                <DeliveryFeed
                                    deliveries={deliveries}
                                    onFilterChange={setFilter}
                                    activeFilter={filter}
                                    suppliers={suppliers}
                                    activeSupplier={supplierFilter}
                                    onSupplierChange={setSupplierFilter}
                                />
                            )}
                            {activeTab === 'materials' && (
                                <MaterialProgress />
                            )}
                        </>
                    )}
                </div>
            </div>
            <AIChatPanel />
        </>
    );
}
