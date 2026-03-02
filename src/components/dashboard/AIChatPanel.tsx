'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import styles from './AIChatPanel.module.css';

interface Message {
    role: 'user' | 'ai';
    text: string;
}

export default function AIChatPanel() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', text: 'Hi! Ask me anything about your deliveries. Try: "How many deliveries today?" or "What CMRs are missing?"' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;

        if (navigator.vibrate) navigator.vibrate(30);
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text }]);
        setLoading(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { role: 'ai', text: data.answer || 'Sorry, I could not process that.' }]);
        } catch {
            setMessages((prev) => [...prev, { role: 'ai', text: 'Connection error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className={styles.chatToggle}
                onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(30);
                    setOpen(!open);
                }}
                aria-label={open ? 'Close AI chat' : 'Open AI chat'}
                id="ai-chat-toggle"
            >
                {open ? <X size={20} /> : <Bot size={20} />}
            </button>

            {open && (
                <div className={styles.chatPanel}>
                    <div className={styles.chatHeader}>
                        <Bot size={16} />
                        <span>AI Assistant</span>
                    </div>

                    <div className={styles.chatMessages}>
                        {messages.map((msg, i) => (
                            <div key={i} className={msg.role === 'user' ? styles.msgUser : styles.msgAi}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && (
                            <div className={styles.thinking}>
                                <span className={styles.thinkingDot} />
                                <span className={styles.thinkingDot} />
                                <span className={styles.thinkingDot} />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.chatInputRow}>
                        <input
                            className={styles.chatInput}
                            placeholder="Ask about deliveries..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={loading}
                            id="ai-chat-input"
                        />
                        <button
                            className={styles.chatSend}
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            id="ai-chat-send"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
