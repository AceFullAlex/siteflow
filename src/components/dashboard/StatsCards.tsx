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
                <div className={styles.statIcon}>📦</div>
                <div className={styles.statValue}>{deliveriesToday}/{expectedToday}</div>
                <div className={styles.statLabel}>Deliveries Today</div>
            </div>
            <div className={`${styles.statCard} ${issueCount > 0 ? styles.warning : ''}`}>
                <div className={styles.statIcon}>⚠️</div>
                <div className={styles.statValue}>{issueCount}</div>
                <div className={styles.statLabel}>Issues</div>
            </div>
            <div className={`${styles.statCard} ${missingDocs > 0 ? styles.danger : ''}`}>
                <div className={styles.statIcon}>📄</div>
                <div className={styles.statValue}>{missingDocs}</div>
                <div className={styles.statLabel}>Missing Docs</div>
            </div>
            <div className={`${styles.statCard} ${behindSchedule > 0 ? styles.warning : ''}`}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statValue}>{behindSchedule}</div>
                <div className={styles.statLabel}>Behind Schedule</div>
            </div>
        </div>
    );
}
