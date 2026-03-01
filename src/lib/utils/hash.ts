export async function hashPin(pin: string): Promise<string> {
    const data = new TextEncoder().encode(pin + '_siteflow_salt_2026');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}
