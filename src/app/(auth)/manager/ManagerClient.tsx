'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StatsCards from '@/components/dashboard/StatsCards';
import DeliveryFeed from '@/components/dashboard/DeliveryFeed';

interface Stats {
    deliveriesToday: number;
    expectedToday: number;
    issueCount: number;
    missingDocs: number;
    behindSchedule: number;
}

export default function ManagerClient({ name }: { name: string }) {
    const [stats, setStats] = useState<Stats>({ deliveriesToday: 0, expectedToday: 0, issueCount: 0, missingDocs: 0, behindSchedule: 0 });
    const [deliveries, setDeliveries] = useState([]);
    const [filter, setFilter] = useState('today');
    const router = useRouter();

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
    }, [filter]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{greeting}, {name} 👋</h1>
                        <span className="badge badge-blue">📊 Manager View</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{today}</p>
                </div>
                <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
            </div>

            <StatsCards {...stats} />
            <DeliveryFeed deliveries={deliveries} onFilterChange={setFilter} activeFilter={filter} />

            <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Read-only view • Data refreshes every 30 seconds
            </div>
        </div>
    );
}
