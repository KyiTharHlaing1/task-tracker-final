import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Check for success message from query parameters
  useEffect(() => {
    if (router.query.message) {
      setSuccessMessage(router.query.message);
    }
  }, [router.query.message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error, please try again later');
      console.error('Login exception:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '80px auto', 
      padding: '30px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      backgroundColor: 'white'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        color: '#333',
        fontSize: '28px'
      }}>
        Task Management System
      </h1>
      
      {successMessage && (
        <div style={{ 
          color: '#00b894', 
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#55efc4',
          borderRadius: '6px',
          border: '1px solid #00b894',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        
        <div style={{ marginBottom: '25px' }}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your password"
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
            backgroundColor: loading ? '#b2bec3' : '#0984e3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
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
        <p>Don't have an account? 
          <Link href="/register" style={{ 
            color: '#0984e3', 
            textDecoration: 'none',
            fontWeight: 'bold',
            marginLeft: '8px'
          }}>
            Sign up
          </Link>
        </p>
      </div>

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center', 
        fontSize: '14px', 
        color: '#636e72',
        padding: '20px',
        backgroundColor: '#dfe6e9',
        borderRadius: '6px'
      }}>
        <p style={{ margin: '0 0 15px 0', fontWeight: 'bold', fontSize: '16px' }}>Test Accounts:</p>
        <p style={{ margin: '8px 0' }}>
          <strong>Email:</strong> test@example.com<br />
          <strong>Password:</strong> 123456
        </p>
        <p style={{ margin: '8px 0' }}>
          <strong>Email:</strong> admin@example.com<br />
          <strong>Password:</strong> 123456
        </p>
      </div>
    </div>
  );
}