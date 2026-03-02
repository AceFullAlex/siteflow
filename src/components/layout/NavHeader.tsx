'use client';

import { useRouter } from 'next/navigation';
import { Home, LogOut } from 'lucide-react';
import styles from './NavHeader.module.css';

interface NavHeaderProps {
    name: string;
    role: string;
}

const ROLE_HOME: Record<string, string> = {
    admin: '/dashboard',
    manager: '/dashboard',
    unloader: '/unloader',
};

export default function NavHeader({ name, role }: NavHeaderProps) {
    const router = useRouter();

    const handleHome = () => {
        if (navigator.vibrate) navigator.vibrate(30);
        router.push(ROLE_HOME[role] || '/');
    };

    const handleLogout = async () => {
        if (navigator.vibrate) navigator.vibrate(50);
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.navLeft}>
                <button
                    className={styles.homeBtn}
                    onClick={handleHome}
                    aria-label="Home"
                    id="home-button"
                >
                    <Home size={18} strokeWidth={2.2} />
                </button>
                <span className={styles.navBrand}>
                    Site<span className={styles.navAccent}>Flow</span>
                </span>
            </div>
            <div className={styles.navRight}>
                <span className={styles.navUser}>
                    {name} · <span className={styles.navRole}>{role}</span>
                </span>
                <button
                    className={styles.navBtn}
                    onClick={handleLogout}
                    aria-label="Sign out"
                    id="signout-button"
                >
                    <LogOut size={16} strokeWidth={2} />
                </button>
            </div>
        </nav>
    );
}
