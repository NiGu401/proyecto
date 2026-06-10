import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../css.css';

const API_URL = '';

function Header() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('usuario');
    setToken(storedToken);
    if (storedUser) {
      try { setUsuario(JSON.parse(storedUser)); } catch(e) {}
    }

    // Escuchar cambios en localStorage para actualizar el Header
    const handler = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('usuario');
      setToken(storedToken);
      if (storedUser) {
        try { setUsuario(JSON.parse(storedUser)); } catch(e) {}
      }
    };
    window.addEventListener('storage', handler);
    window.addEventListener('login', handler);
    window.addEventListener('logout', handler);

    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('login', handler);
      window.removeEventListener('logout', handler);
    };
  }, []);

  const isAdmin = usuario && usuario.rol_id === 1;

  const handleLogout = async () => {
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
    setUsuario(null);
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <div>
        <Navbar data-bs-theme="dark" id='header' expand="lg">
          <Container fluid className="px-3">
            <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <img src="/Imagenes/Logo.png" className="logo"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="menu-navegacion" className="ms-auto"/>
            <Navbar.Collapse id="menu-navegacion">
              <Nav className="ms-auto d-flex flex-colum flex-lg-row">
                <Nav.Link onClick={() => navigate('/')} className='px-3'>Inicio</Nav.Link>
                <Nav.Link onClick={() => navigate('/menu')} className='px-3'>Menú</Nav.Link>
                <Nav.Link onClick={() => navigate('/pedidos')} className='px-3'>Pedir Online</Nav.Link>

                <Nav.Link onClick={() => navigate('/agenda-eventos')} className='px-3'>Agenda y Eventos</Nav.Link>

                <Nav.Link onClick={() => navigate('/contacto')} className='px-3'>Contacto</Nav.Link>
                {usuario && (
                  <>
                    <Nav.Item className="dropdown position-relative">
                      <Nav.Link className='px-3' onClick={() => setShowDropdown(!showDropdown)}>
                        {usuario.nombre}{' '}
                        <span className="dropdown-arrow">▼</span>
                      </Nav.Link>
                      {showDropdown && (
                        <div className="dropdown-menu">
                          <div className="dropdown-item" onClick={() => { navigate('/dashboard'); setShowDropdown(false); }}>
                            Dashboard
                          </div>
                          {isAdmin && (
                            <div className="dropdown-item" onClick={() => { navigate('/admin-panel'); setShowDropdown(false); }}>
                              Panel Admin
                            </div>
                          )}
                          <div className="dropdown-item" onClick={() => { handleLogout(); }}>
                            Cerrar Sesión
                          </div>
                        </div>
                      )}
                    </Nav.Item>
                    {isAdmin && (
                      <Nav.Item className="ms-2">
                        <button
                          onClick={() => { navigate('/admin-panel'); }}
                          className="btn btn-primary btn-sm admin-btn"
                          style={{
                            background: '#0D6EFD',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#0b5abf'}
                          onMouseLeave={(e) => e.target.style.background = '#0D6EFD'}
                        >
                          Dashboard
                        </button>
                      </Nav.Item>
                    )}
                    <Nav.Item className="ms-2">
                      <button
                        onClick={handleLogout}
                        className="btn btn-danger btn-sm logout-btn"
                        style={{
                          background: '#C21919',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#9b1515'}
                        onMouseLeave={(e) => e.target.style.background = '#C21919'}
                      >
                        Cerrar Sesión
                      </button>
                    </Nav.Item>
                  </>
                )}
                {!usuario && (
                  <Nav.Link onClick={() => navigate('/login')} className='px-3'>Iniciar Sesión</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    </div>
  )
}

export default Header
