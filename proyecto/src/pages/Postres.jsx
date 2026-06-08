import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import '../css.css';

function Postres() {
  return (
    <div className="page-content">
      <h1 className="titulo">Postres</h1>
      <Container className="mt-4">
        <CardGroup>
          <Card>
            <Card.Img variant="top" src="/Imagenes/Logo.png" />
            <Card.Body>
              <Card.Title>Pasteles</Card.Title>
              <Card.Text>Los mejores pasteles caseros.</Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src="/Imagenes/Logo.svg" />
            <Card.Body>
              <Card.Title>Galletas</Card.Title>
              <Card.Text>Galletas recién horneadas.</Card.Text>
            </Card.Body>
          </Card>
          <Card>
            <Card.Img variant="top" src="/Imagenes/Logo.png" />
            <Card.Body>
              <Card.Title>Empanadas</Card.Title>
              <Card.Text>Empanadas deliciosas de varios sabores.</Card.Text>
            </Card.Body>
          </Card>
        </CardGroup>
      </Container>
    </div>
  );
}

export default Postres;
