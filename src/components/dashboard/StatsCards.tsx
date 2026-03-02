import styles from './StatsCards.module.css';

interface StatsCardsProps {
    deliveriesToday: number;
    expectedToday: number;
    issueCount: number;
    missingDocs: number;
    behindSchedule: number;
}

export default function StatsCards({
    deliveriesToday, expectedToday, issueCount, missingDocs, behindSchedule
}: StatsCardsProps) {
    return (
        <div className={styles.statsGrid}>
            <div className={styles.statCard}>
                <div className={styles.statIcon}>Deliveries</div>
                <div className={styles.statValue}>{deliveriesToday}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/{expectedToday}</span></div>
                <div className={styles.statLabel}>arrived today</div>
            </div>
            <div className={`${styles.statCard} ${issueCount > 0 ? styles.warning : ''}`}>
                <div className={styles.statIcon}>Issues</div>
                <div className={styles.statValue} style={issueCount > 0 ? { color: 'var(--orange)' } : undefined}>{issueCount}</div>
                <div className={styles.statLabel}>flagged</div>
            </div>
            <div className={`${styles.statCard} ${missingDocs > 0 ? styles.danger : ''}`}>
                <div className={styles.statIcon}>Documents</div>
                <div className={styles.statValue} style={missingDocs > 0 ? { color: 'var(--red)' } : undefined}>{missingDocs}</div>
                <div className={styles.statLabel}>missing</div>
            </div>
            <div className={`${styles.statCard} ${behindSchedule > 0 ? styles.warning : ''}`}>
                <div className={styles.statIcon}>Schedule</div>
                <div className={styles.statValue}>{behindSchedule}</div>
                <div className={styles.statLabel}>behind</div>
            </div>
        </div>
    );
}
