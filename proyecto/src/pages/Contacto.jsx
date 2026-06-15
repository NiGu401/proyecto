import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const API_URL = '';

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'Nombre requerido';
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Email válido requerido';
    if (!formData.mensaje) newErrors.mensaje = 'Mensaje requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor corrige los errores');
      return;
    }
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          mensaje: formData.mensaje,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al enviar el mensaje');
      }

      toast.success(`Te responderemos pronto!`);
      setSubmitting(false);
      setFormData({ nombre: '', email: '', mensaje: '' });
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { label: 'Ubicación', value: '98 C. Juan Mendoza, La Paz' },
    { label: 'Teléfono', value: '73719256' },
    { label: 'Email', value: 'info@instantesdulces.com' },
    { label: 'Horario', value: 'Lun-Sáb: 8am-8pm | Dom: 9am-5pm' },
  ];

  return (
    <div className="contacto-container">
      <ToastContainer />
      <section className="contacto-header">
        <div className="contacto-hero-overlay">
          <h1 className="contacto-title">Contacto</h1>
          <p className="contacto-subtitle">¿Tienes una pregunta? Estamos aquí para ayudarte</p>
        </div>
      </section>

      <Container className="mt-5">
        <Row>
          {/* Info de contacto */}
          <Col md={6}>
            <Card className="contacto-info-card">
              <Card.Body>
                <h3 className="contacto-info-title">📍 Nuestra Ubicación</h3>
                <div className="contacto-details">
                  {contactInfo.map((item, i) => (
                    <div key={i} className="contacto-detail-item">
                      <span className="contacto-detail-icon">{item.icon}</span>
                      <div>
                        <span className="contacto-detail-label">{item.label}</span>
                        <span className="contacto-detail-value">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mapa de Google Maps */}
                <div className="map-embed">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!4v1781099726623!6m8!1m7!1sDIPNM78KfF_xpA6noX8CjQ!2m2!1d-16.49103445451797!2d-68.16475771238056!3f324.2813441352296!4f-22.953761112764184!5f0.7820865974627469"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa de ubicación"
                  ></iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Formulario */}
          <Col md={6}>
            <Card className="contacto-form-card">
              <Card.Body>
                <h3 className="contacto-form-title">¿Tienes una Duda?</h3>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="contactName">
                    <Form.Label>Nombre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      isInvalid={!!errors.nombre}
                      placeholder="Tu nombre completo"
                      required
                    />
                    <Form.Text className="text-danger">{errors.nombre}</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="contactEmail">
                    <Form.Label>Correo Electrónico *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      placeholder="tu@email.com"
                      required
                    />
                    <Form.Text className="text-danger">{errors.email}</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="contactMessage">
                    <Form.Label>Mensaje *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      isInvalid={!!errors.mensaje}
                      placeholder="¿En qué podemos ayudarte?"
                      required
                    />
                    <Form.Text className="text-danger">{errors.mensaje}</Form.Text>
                  </Form.Group>

                  <div className="contacto-submit">
                    <Button variant="danger" size="lg" type="submit" disabled={submitting}>
                      {submitting ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Contacto;
