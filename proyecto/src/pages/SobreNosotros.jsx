import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { jsPDF } from 'jspdf';
import '../css.css';

function SobreNosotros() {
  const [showPDF, setShowPDF] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(194, 25, 25);
    doc.text('Pastelería de los Sabores - Nuestros Valores', 105, 30, { align: 'center' });
    
    // Línea decorativa
    doc.setLineWidth(0.5);
    doc.setDrawColor(194, 25, 25);
    doc.line(20, 40, 185, 40);
    
    // Historia
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text('Nuestra Historia', 20, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    const historia = [
      'Desde 2024, Pastelería de los Sabores nació del sueño de crear momentos',
      'dulces que conectan a las personas. Cada producto que elaboramos',
      'lleva el amor y la dedicación de nuestro equipo de maestros',
      'pasteleros.',
      '',
      'Comenzamos con una pequeña cocina y un gran sueño: hacer que cada',
      'bocado sea una experiencia inolvidable.',
    ];
    doc.text(historia, 20, 68);
    
    // Misión y Visión
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('Misión', 20, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text('Endulzar los momentos especiales de nuestros clientes con productos', 20, 118);
    doc.text('artesanales de la más alta calidad, utilizando ingredientes naturales', 20, 130);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('Visión', 20, 145);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text('Ser la repostería artesanal preferida de la ciudad, reconocida por', 20, 158);
    doc.text('nuestra calidad, innovación y compromiso con la satisfacción del cliente.', 20, 170);
    
    // Valores
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('Nuestros Valores', 20, 190);
    
    const valores = [
      'Calidad Natural: Ingredientes frescos y sin conservantes',
      'Pasión Artesanal: Cada producto es hecho con amor',
      'Compromiso: Con nuestros clientes y con el medio ambiente',
      'Innovación: Siempre buscando nuevos sabores',
      'Sostenibilidad: Envases biodegradables y procesos ecológicos',
    ];
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(valores, 20, 203);
    
    doc.save('instantes_dulces_nuestros_valores.pdf');
  };

  const team = [
    {
      name: 'Chef María López',
      role: 'Maestra Pastelera Fundadora',
      desc: 'Con 15 años de experiencia, María perfecciona cada receta con técnicas francesas y toques locales.',
      img: '/Imagenes/Logo.png',
    },
    {
      name: 'Carlos Mendoza',
      role: 'Chef de Repostería',
      desc: 'Especialista en tartas personalizadas y diseño de chocolate.',
      img: '/Imagenes/Logo.svg',
    },
    {
      name: 'Ana Torres',
      role: 'Maestra de Chocolatería',
      desc: 'Formada en Bélgica, Ana crea experiencias únicas en chocolate belga.',
      img: '/Imagenes/Comida Rapida.jpg',
    },
  ];

  return (
    <div className="sobre-nosotros-container">
      {/* Hero */}
      <section className="sn-hero">
        <div className="sn-hero-overlay">
          <h1 className="sn-title">Nuestra Historia</h1>
          <p className="sn-subtitle">Endulzando momentos desde 2024</p>
        </div>
      </section>

      <Container className="mt-5">
        {/* Nuestra Historia */}
        <section className="sn-history">
          <h2 className="sn-section-title">Nuestra Historia</h2>
          <p className="sn-text">
            Pastelería de los Sabores comenzó como un pequeño emprendimiento familiar, con la visión de compartir 
            los sabores de la repostería artesanal con toda la comunidad. Lo que comenzó como un sueño 
            en una cocina casera, hoy es una realidad que llena de sabor y alegría miles de hogares.
          </p>
          <p className="sn-text">
            Cada producto que sale de nuestra cocina lleva consigo años de experiencia, recetas perfeccionadas 
            con el paso del tiempo y, sobre todo, mucho amor por lo que hacemos.
          </p>
        </section>

        {/* Misión y Visión */}
        <Row className="sn-mv mt-4">
          <Col md={6}>
            <Card className="sn-card">
              <Card.Body>
                <Card.Title className="sn-card-title">Misión</Card.Title>
                <Card.Text>
                  Endulzar los momentos especiales de nuestros clientes con productos artesanales 
                  de la más alta calidad, utilizando ingredientes naturales y técnicas tradicionales.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="sn-card">
              <Card.Body>
                <Card.Title className="sn-card-title">Visión</Card.Title>
                <Card.Text>
                  Ser la repostería artesanal preferida de la ciudad, reconocida por nuestra 
                  calidad, innovación y compromiso con la satisfacción de cada cliente.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Nuestro Equipo */}
        <section className="sn-team mt-5">
          <h2 className="sn-section-title">Nuestro Equipo</h2>
          <Row className="team-row">
            {team.map((member, i) => (
              <Col key={i} md={4}>
                <Card className="team-card">
                  <Card.Img variant="top" src={member.img} className="team-img" />
                  <Card.Body>
                    <Card.Title>{member.name}</Card.Title>
                    <Card.Text className="team-role">{member.role}</Card.Text>
                    <Card.Text className="team-desc">{member.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Ingredientes */}
        <section className="sn-ingredients mt-5">
          <h2 className="sn-section-title">Ingredientes Naturales</h2>
          <div className="ingredients-grid">
            <div className="ingredient-item">
              <span className="ingredient-icon">Harina</span>
              <span className="ingredient-text">Harina orgánica sin conservantes</span>
            </div>
            <div className="ingredient-item">
              <span className="ingredient-icon">Huevos</span>
              <span className="ingredient-text">Huevos de granja libres</span>
            </div>
            <div className="ingredient-item">
              <span className="ingredient-icon">Mantequilla</span>
              <span className="ingredient-text">Mantequilla 100% natural</span>
            </div>
            <div className="ingredient-item">
              <span className="ingredient-icon">Chocolate</span>
              <span className="ingredient-text">Chocolate belga premium</span>
            </div>
            <div className="ingredient-item">
              <span className="ingredient-icon">Frutas</span>
              <span className="ingredient-text">Frutas frescas de temporada</span>
            </div>
          </div>
        </section>

        {/* Reporte PDF */}
        <section className="sn-pdf-section mt-5 text-center">
          <h2 className="sn-section-title">Reporte PDF - Nuestros Valores</h2>
          <p>Genera un reporte PDF detallado de nuestra historia, misión, visión y valores.</p>
          <Button variant="danger" size="lg" onClick={generatePDF}>
            Descargar Reporte PDF
          </Button>
        </section>
      </Container>
    </div>
  );
}

export default SobreNosotros;
