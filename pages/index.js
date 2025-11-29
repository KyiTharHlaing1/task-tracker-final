import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      // Let user choose to login or register
    }
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f6fa',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '500px', 
        width: '100%',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '36px',
          color: '#2d3436',
          marginBottom: '10px'
        }}>
          Task Management System
        </h1>
        <p style={{ 
          fontSize: '18px',
          color: '#636e72',
          marginBottom: '40px'
        }}>
          Efficiently manage your daily tasks
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            onClick={() => router.push('/login')}
            style={{
              padding: '15px',
              backgroundColor: '#0984e3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0770c4'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#0984e3'}
          >
            Login
          </button>
          
          <button
            onClick={() => router.push('/register')}
            style={{
              padding: '15px',
              backgroundColor: '#00b894',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#00a085'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00b894'}
          >
            Register
          </button>
        </div>

        <div style={{ 
          marginTop: '40px', 
          padding: '20px',
          backgroundColor: '#dfe6e9',
          borderRadius: '8px'
        }}>
          <p style={{ 
            margin: '0 0 15px 0', 
            fontWeight: 'bold',
            color: '#2d3436'
          }}>
            Test Accounts
          </p>
          <div style={{ textAlign: 'left', fontSize: '14px', color: '#636e72' }}>
            <p><strong>Email:</strong> test@example.com</p>
            <p><strong>Password:</strong> 123456</p>
            <p style={{ marginTop: '10px' }}><strong>Email:</strong> admin@example.com</p>
            <p><strong>Password:</strong> 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}