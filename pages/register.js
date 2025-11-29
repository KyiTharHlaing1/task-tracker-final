// 文件: pages/register.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Frontend validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful, redirect to login
                router.push('/login?message=Registration successful, please login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('Network error, please try again later');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            maxWidth: '450px', 
            margin: '80px auto', 
            padding: '35px',
            border: '1px solid #ddd',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backgroundColor: 'white'
        }}>
            <h1 style={{ 
                textAlign: 'center', 
                marginBottom: '30px', 
                color: '#333',
                fontSize: '28px'
            }}>
                User Registration
            </h1>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: 'bold',
                        color: '#555'
                    }}>
                        Name:
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Enter your name"
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: 'bold',
                        color: '#555'
                    }}>
                        Email:
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Enter your email"
                    />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: 'bold',
                        color: '#555'
                    }}>
                        Password:
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Enter password (at least 6 characters)"
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: 'bold',
                        color: '#555'
                    }}>
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength="6"
                        style={{ 
                            width: '100%', 
                            padding: '12px', 
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '16px',
                            boxSizing: 'border-box'
                        }}
                        placeholder="Confirm your password"
                    />
                </div>
                
                {error && (
                    <div style={{ 
                        color: '#d63031', 
                        marginBottom: '20px',
                        padding: '12px',
                        backgroundColor: '#ffeaa7',
                        borderRadius: '6px',
                        border: '1px solid #fab1a0',
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>
                        {error}
                    </div>
                )}
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: loading ? '#b2bec3' : '#00b894',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                    }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <div style={{ 
                marginTop: '25px', 
                textAlign: 'center', 
                fontSize: '16px', 
                color: '#636e72',
                paddingTop: '20px',
                borderTop: '1px solid #eee'
            }}>
                <p>Already have an account? 
                    <Link href="/login" style={{ 
                        color: '#0984e3', 
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        marginLeft: '8px'
                    }}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}