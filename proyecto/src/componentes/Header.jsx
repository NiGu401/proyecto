import { React,useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import '../css.css';

function Header() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
        <Navbar data-bs-theme="dark" id='header' expand="lg">
          <Container fluid className="px-3">
            <Navbar.Brand href="#home">
              <img src="/Imagenes/Logo.png" class="logo"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="menu-navegacion" className="ms-auto"/>
            <Navbar.Collapse id="menu-navegacion">  
              <Nav className="ms-auto d-flex flex-colum flex-lg-row">
                <Nav.Link href="#home" className='px-3 order-1 order-lg-0'>Inicio</Nav.Link>
                <Nav.Link href="#features" className='px-3 order-2 order-lg-1'>Comida</Nav.Link>
                <Nav.Link href="#pricing" className='px-3 order-3 order-lg-2'>Postres</Nav.Link>
                <Nav.Link onClick={handleShow} className='px-3 order-0 order-lg-4'>Iniciar Sesion</Nav.Link>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Iniciar Sesion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control type="email" placeholder="Correo Electronico" autoFocus/>
                        </Form.Group>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={handleClose}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
              </Nav>
            </Navbar.Collapse>
          </Container>  
        </Navbar>

    </div>
  )
}

export default Header