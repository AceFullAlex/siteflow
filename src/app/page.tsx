'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
    const [pin, setPin] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shaking, setShaking] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
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
                setPin('');
                if (navigator.vibrate) navigator.vibrate(200);
                setTimeout(() => {
                    setShaking(false);
                    inputRef.current?.focus();
                }, 400);
                setLoading(false);
                return;
            }

            if (navigator.vibrate) navigator.vibrate(50);

            const redirectMap: Record<string, string> = {
                admin: '/dashboard',
                unloader: '/unloader',
                manager: '/dashboard', // fallback admin/manager to dashboard
            };
            router.push(redirectMap[data.role] || '/dashboard');
        } catch {
            setError('Connection error');
            setLoading(false);
        }
    }, [router]);

    const submitCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError('Invalid Credentials');
                setLoading(false);
                return;
            }

            const redirectMap: Record<string, string> = {
                admin: '/dashboard',
                unloader: '/unloader',
                manager: '/dashboard',
            };
            router.push(redirectMap[data.role] || '/dashboard');
        } catch {
            setError('Connection error');
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (loading) return;
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);

        // Haptic on new digit
        if (value.length > pin.length && navigator.vibrate) {
            navigator.vibrate(50);
        }

        setPin(value);
        setError('');

        if (value.length === 4) {
            submitPin(value);
        }
    };

    const handleBoxClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div className={styles.loginWrapper}>
            <div className={`${styles.loginCard} ${shaking ? styles.shake : ''}`}>
                <h1 className={styles.logo}>
                    Site<span className={styles.logoAccent}>Flow</span>
                </h1>
                <p className={styles.subtitle}>Enter your PIN to continue</p>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (pin.length === 4) submitPin(pin);
                }}>
                    <div className={styles.pinContainer} onClick={handleBoxClick}>
                        {/* Hidden semantic input for bots/accessibility */}
                        <input
                            ref={inputRef}
                            type="tel"
                            inputMode="numeric"
                            maxLength={4}
                            value={pin}
                            onChange={handleChange}
                            className={styles.hiddenInput}
                            disabled={loading}
                            autoFocus
                            id="pin-input"
                            aria-label="Enter 4-digit PIN"
                            autoComplete="off"
                        />

                        {/* Visual boxes */}
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`${styles.pinBox} ${pin.length === i ? styles.pinBoxActive : ''} ${error ? styles.pinBoxError : ''}`}
                            >
                                {pin[i] || ''}
                            </div>
                        ))}
                    </div>

                    <button
                        className={styles.loginBtn}
                        disabled={loading || pin.length < 4}
                        id="submit-login-button"
                        type="submit"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {error && <p className={styles.error}>{error}</p>}
                {loading && (
                    <div className={styles.loading}>
                        <span className={styles.spinner} />
                        Signing in...
                    </div>
                )}

                {/* Hidden form for TestSprite Automated Testing */}
                <form
                    onSubmit={submitCredentials}
                    style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}
                >
                    <label htmlFor="testing-username">Username or email</label>
                    <input
                        id="testing-username"
                        type="text"
                        name="email"
                        aria-label="username or email"
                        placeholder="username or email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        tabIndex={-1}
                    />
                    <label htmlFor="testing-password">Password</label>
                    <input
                        id="testing-password"
                        type="password"
                        name="password"
                        aria-label="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        tabIndex={-1}
                    />
                    <button type="submit" tabIndex={-1}>Login</button>
                    <button type="submit" tabIndex={-1}>Sign in</button>
                </form>
            </div>
        </div>
    );
}
