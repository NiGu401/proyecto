import { useState, useEffect } from 'react';

const API_URL = '';

function LogoutButton({ redirect }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    const handler = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleLogout = async () => {
    setShowLogout(true);
    try {
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
      }
    } catch (e) {
      console.error('Error al cerrar sesión');
    }

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);

    // Notificar al Header que cambió el estado de login
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('logout'));

    setTimeout(() => {
      window.location.href = redirect || '/login';
    }, 300);
  };

  if (!token) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
    }}>
      {!showLogout && (
        <button
          onClick={handleLogout}
          style={{
            background: '#C21919',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '700',
            boxShadow: '0 4px 20px rgba(194, 25, 25, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#9b1515';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 25px rgba(194, 25, 25, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#C21919';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 20px rgba(194, 25, 25, 0.4)';
          }}
        >
          <span style={{ fontSize: '18px' }}>Cerrar</span>
          <span>Cerrar Sesión</span>
        </button>
      )}
      {showLogout && (
        <div style={{
          background: '#C21919',
          color: 'white',
          borderRadius: '12px',
          padding: '12px 24px',
          fontSize: '15px',
          fontWeight: '600',
          boxShadow: '0 4px 20px rgba(194, 25, 25, 0.4)',
        }}>
          Cerrando sesión...
        </div>
      )}
    </div>
  );
}

export default LogoutButton;
