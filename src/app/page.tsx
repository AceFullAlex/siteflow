'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shaking, setShaking] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    const submitPin = useCallback(async (fullPin: string) => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: fullPin }),
            });

            const data = await res.json();

            if (!res.ok) {
                setShaking(true);
                setError('Invalid PIN');
                setPin(['', '', '', '']);
                if (navigator.vibrate) navigator.vibrate(200);
                setTimeout(() => {
                    setShaking(false);
                    inputRefs.current[0]?.focus();
                }, 400);
                setLoading(false);
                return;
            }

            if (navigator.vibrate) navigator.vibrate(50);

            const redirectMap: Record<string, string> = {
                admin: '/dashboard',
                unloader: '/unloader',
                manager: '/manager',
            };
            router.push(redirectMap[data.role] || '/dashboard');
        } catch {
            setError('Connection error');
            setLoading(false);
        }
    }, [router]);

    const handleChange = (index: number, value: string) => {
        if (loading) return;

        const digit = value.replace(/\D/g, '').slice(-1);
        const newPin = [...pin];
        newPin[index] = digit;
        setPin(newPin);
        setError('');

        if (digit && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        if (digit && index === 3) {
            const fullPin = newPin.join('');
            if (fullPin.length === 4) {
                submitPin(fullPin);
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <div className={`${styles.loginCard} ${shaking ? styles.shake : ''}`}>
                <div className={styles.logo}>🏗️</div>
                <h1 className={styles.title}>SiteFlow</h1>
                <p className={styles.subtitle}>Enter your 4-digit PIN</p>

                <div className={styles.pinContainer}>
                    {pin.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputRefs.current[i] = el; }}
                            type="tel"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className={`${styles.pinInput} ${error ? styles.pinInputError : ''}`}
                            disabled={loading}
                            autoFocus={i === 0}
                            aria-label={`PIN digit ${i + 1}`}
                        />
                    ))}
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {loading && (
                    <div className={styles.loading}>
                        <span className={styles.spinner} />
                        Authenticating...
                    </div>
                )}
            </div>
        </div>
    );
}
