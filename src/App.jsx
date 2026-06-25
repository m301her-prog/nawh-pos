import React from 'react';

export default function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#f8fafc',
      fontFamily: 'sans-serif',
      color: '#1e293b'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>نظام نواة AI</h1>
      <p style={{ fontSize: '1.25rem' }}>تم الاتصال بنجاح! النظام يعمل الآن.</p>
    </div>
  );
}
