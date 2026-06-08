import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../css.css';

function Header() {
  const navigate = useNavigate();

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
                <Nav.Link onClick={() => navigate('/')} className='px-3 order-1 order-lg-0'>Inicio</Nav.Link>
                <Nav.Link onClick={() => navigate('/comida')} className='px-3 order-2 order-lg-1'>Comida</Nav.Link>
                <Nav.Link onClick={() => navigate('/postres')} className='px-3 order-3 order-lg-2'>Postres</Nav.Link>
                <Nav.Link onClick={() => navigate('/login')} className='px-3 order-0 order-lg-4'>Iniciar Sesion</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

    </div>
  )
}

export default Header
