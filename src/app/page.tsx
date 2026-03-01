export default function Home() {
    return (
        <main
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100dvh',
                gap: '12px',
                textAlign: 'center',
            }}
        >
            <span style={{ fontSize: '3rem' }}>🏗️</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                SiteFlow
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Coming Soon
            </p>
        </main>
    );
}
