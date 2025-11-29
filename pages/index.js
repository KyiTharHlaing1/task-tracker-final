import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem('token');
        if (token) router.replace('/dashboard');
    }, [router]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f6fa',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                maxWidth: '640px',
                textAlign: 'center'
            }}>
                <h1 style={{ margin: 0, fontSize: '28px', color: '#2d3436' }}>Task Management System</h1>
                <p style={{ color: '#636e72', marginTop: '12px' }}>Sign in to manage your tasks or create a new account.</p>

                <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <Link href="/login" style={{
                        padding: '12px 22px',
                        backgroundColor: '#0984e3',
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}>Login</Link>
                    <Link href="/register" style={{
                        padding: '12px 22px',
                        backgroundColor: '#00b894',
                        color: 'white',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: '600'
                    }}>Register</Link>
                </div>
            </div>
        </div>
    );
}