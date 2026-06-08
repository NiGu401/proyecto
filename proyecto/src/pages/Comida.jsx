import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../css.css';

function Comida() {
  return (
    <div className="page-content">
      <h1 className="titulo">Comida</h1>
      <Container className="mt-4">
        <CardGroup>
          <Card>
            <Card.Img variant="top" src="Imagenes/Comida Rapida.jpg" />
            <Card.Body>
              <Card.Title>Comida Rápida</Card.Title>
              <Card.Text>Deliciosas opciones para comer rápido.</Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src="Imagenes/verduras.jpg" />
            <Card.Body>
              <Card.Title>Verduras Frescas</Card.Title>
              <Card.Text>Las mejores verduras del mercado.</Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src="/Imagenes/Bebidas.png" />
            <Card.Body>
              <Card.Title>Bebidas</Card.Title>
              <Card.Text>Refrescantes bebidas para acompañar.</Card.Text>
            </Card.Body>
          </Card>
        </CardGroup>
      </Container>
    </div>
  );
}

export default Comida;
