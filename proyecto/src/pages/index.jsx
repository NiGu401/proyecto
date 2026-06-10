import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import '../css.css';

function Inicio2() {
  const testimonials = [
    {
      nombre: 'Luis Fabricio Arratia Villa',
      texto: 'Critica dura a esta pagina muy alto los costos iniciales nomas queria entrar al baño y me cobraron mucho no lo recomiendo la verdad, ese pinguino me irrita bastante ojala tenga una buena navidad gracias perdon.',
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

  const galeria = [
    { src: '/Imagenes/brownie.jpg', alt: 'Brownies', desc: 'Brownies caseros' },
    { src: '/Imagenes/pasteldechoco.jpg', alt: 'Pastel de Chocolate', desc: 'Pastel de Chocolate' },
    { src: '/Imagenes/pasteldevaini.jfif', alt: 'Pastel de Vainilla', desc: 'Pastel de Vainilla' },
    { src: '/Imagenes/chessecake.jfif', alt: 'Cheesecake', desc: 'Cheesecake' },
    { src: '/Imagenes/cupcake.jpg', alt: 'Cupcake', desc: 'Cupcake' },
    { src: '/Imagenes/tartadefresas.jfif', alt: 'Tarta de Fresas', desc: 'Tarta de Fresas' },
    { src: '/Imagenes/galletas.jpg', alt: 'Galletas', desc: 'Galletas' },
    { src: '/Imagenes/tartadebodas.jfif', alt: 'Tarta de Bodas', desc: 'Tarta de Bodas' },
    { src: '/Imagenes/pasteles.jfif', alt: 'Pasteles', desc: 'Pasteles' },
  ];

  return (
    <div className="inicio2-container">
      {/* Banner Principal */}
      <section className="hero-banner">
        <Carousel className="hero-carousel" prevLabel="" nextLabel="" pause="hover" interval={3000}>
            <Carousel.Item>
              <img
                src="/Imagenes/carrucel1.jpg"
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
                src="/Imagenes/carrucel2.jpg"
                alt="Café y Bebidas"
                className="carousel-full-width"
              />
              <div className="carousel-caption-hero">
                <h2 className="hero-title">Café y Bebidas</h2>
                <p className="hero-subtitle">Disfruta de nuestro café y bebidas especiales</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <img
                src="/Imagenes/carrucel3.jpg"
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

      {/* Galería */}
      <section className="gallery-section" style={{ padding: '4rem 0', backgroundColor: '#f8f9fa' }}>
        <Container>
          <h2 className="text-center mb-4" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#C21919' }}>Nuestros Productos</h2>
          <Row>
            {galeria.map((img, i) => (
              <Col key={i} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img variant="top" src={img.src} className="product-gallery-img" style={{ height: '200px', objectFit: 'cover' }} />
                  <Card.Body className="text-center">
                    <Card.Title style={{ fontSize: '1.1rem' }}>{img.desc}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
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