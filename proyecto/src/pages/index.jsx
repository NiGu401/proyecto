import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../css.css';

function Inicio2() {
  const [chartData, setChartData] = useState([
    { producto: 'Pastel Chocolate', ventas: 45 },
    { producto: 'Cupcake Vainilla', ventas: 38 },
    { producto: 'Cheesecake', ventas: 32 },
    { producto: 'Galletas', ventas: 28 },
    { producto: 'Tarta Fresas', ventas: 22 },
  ]);

  const testimonials = [
    {
      nombre: 'Luis Fabricio Arratia Villa 🤬🤬🤬🤬',
      texto: 'Critica dura a esta pagina 😒muy alto los costos iniciales nomas queria entrar al baño y me cobraron mucho no lo recomiendo la verdad, ese pinguino me irrita bastante ojala tenga una buena navidad gracias perdon .',
      rating: 5,
    },
    {
      nombre: 'Carlos López',
      texto: 'Siempre pido aquí para las reuniones de oficina. La calidad es consistente y el servicio excelente.',
      rating: 4,
    },
    {
      nombre: 'Ana Martínez',
      texto: 'Mi boda fue perfecta con las tartas de Pastelería de los Sabores. ¡Superaron todas mis expectativas!',
      rating: 5,
    },
  ];

  return (
    <div className="inicio2-container">
      {/* Banner Principal */}
      <section className="hero-banner">
        <Carousel className="hero-carousel" prevLabel="" nextLabel="" pause="hover" interval={3000}>
            <Carousel.Item>
              <img
                src="/Imagenes/pasteles.jpg"
                alt="Tortas Personalizadas"
                className="carousel-full-width"
              />
              <div className="carousel-caption-hero">
                <h2 className="hero-title">Tortas Personalizadas</h2>
                <p className="hero-subtitle">Diseñamos la torta de tus sueños</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <img
                src="/Imagenes/delivery.jpg"
                alt="Envío a Domicilio"
                className="carousel-full-width"
              />
              <div className="carousel-caption-hero">
                <h2 className="hero-title">Envío a Domicilio</h2>
                <p className="hero-subtitle">Recibe tus postres frescos en casa</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <img
                src="/Imagenes/ingredientes.jpg"
                alt="Ingredientes Naturales"
                className="carousel-full-width"
              />
              <div className="carousel-caption-hero">
                <h2 className="hero-title">Ingredientes Naturales</h2>
                <p className="hero-subtitle">Lo mejor y más fresco para tus postres</p>
              </div>
            </Carousel.Item>
          </Carousel>
      </section>

      {/* Quiénes Somos */}
      <section className="about-section">
        <Container>
          <Row className="about-row">
            <Col md={6}>
              <h2 className="about-title">Quiénes Somos</h2>
              <p className="about-text">
                Desde 2024, Pastelería de los Sabores ha sido sinónimo de calidad artesanal y pasión por la repostería. 
                Nuestros maestros pasteleros combinan técnicas tradicionales con sabores innovadores para crear 
                momentos dulces que duran en la memoria de quienes los prueban.
              </p>
              <p className="about-text">
                Utilizamos ingredientes naturales, locales y de la más alta calidad. Cada producto es elaborado 
                con amor y dedicación, porque creemos que lo mejor debe venir de lo natural.
              </p>
            </Col>
            <Col md={6}>
              <div className="about-image-placeholder">
                <img src="/Imagenes/Logo.png" alt="Pastelería de los Sabores" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pedir Ahora */}
      <section className="pedir-section">
        <Container>
          <h2 className="pedir-title">¿Listo para endulzar tu día?</h2>
          <p className="pedir-subtitle">Haz tu pedido ahora y recibe tus postres favoritos en minutos</p>
          <div className="pedir-buttons">
            <Button variant="danger" size="lg" onClick={() => window.location.href = '/menu'}>
            Ir al Menú
            </Button>
            <Button variant="outline-danger" size="lg" onClick={() => window.location.href = '/pedidos'}>
            Pedir Ahora
            </Button>
          </div>
        </Container>
      </section>

      {/* Gráfico Estadístico */}
      <section className="chart-section">
        <Container>
          <h2 className="chart-title">Postres Más Vendidos Este Mes</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="producto" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" fill="#C21919" name="Ventas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Container>
      </section>

      {/* Testimonios */}
      <section className="testimonials-section">
        <Container>
          <h2 className="testimonials-title">Lo Que Dicen Nuestros Clientes</h2>
          <Row className="testimonials-row">
            {testimonials.map((t, i) => (
              <Col key={i} md={4}>
                <Card className="testimonial-card">
                  <Card.Body>
                    <div className="testimonial-stars">
                      {[...Array(t.rating)].map((_, j) => (
                        <span key={j} className="star">⭐</span>
                      ))}
                    </div>
                    <p className="testimonial-text">"{t.texto}"</p>
                    <p className="testimonial-author">{t.nombre}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Inicio2;
