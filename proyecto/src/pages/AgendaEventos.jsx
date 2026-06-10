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

function AgendaEventos() {
  const [formData, setFormData] = useState({
    tipoTorta: '',
    sabor: '',
    diseño: '',
    fechaEntrega: '',
    personas: '',
    telefono: '',
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
    if (!formData.tipoTorta) newErrors.tipoTorta = 'Selecciona un tipo de torta';
    if (!formData.sabor) newErrors.sabor = 'Selecciona un sabor';
    if (!formData.diseño) newErrors.diseño = 'Describe tu diseño deseado';
    if (!formData.fechaEntrega) newErrors.fechaEntrega = 'Ingresa una fecha de entrega';
    
    // Validar que la fecha sea futura
    if (formData.fechaEntrega) {
      const selectedDate = new Date(formData.fechaEntrega);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.fechaEntrega = 'No puedes reservar para una fecha pasada o de ayer';
      }
      
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 60);
      if (selectedDate > maxDate) {
        newErrors.fechaEntrega = 'Solo puedes reservar hasta 60 días adelante';
      }
    }
    
    if (!formData.personas) newErrors.personas = 'Indica el número de personas';
    if (!formData.telefono) newErrors.telefono = 'Ingresa un teléfono';
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Ingresa un email válido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor corrige los errores del formulario');
      return;
    }
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/reserva`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoTorta: formData.tipoTorta,
          sabor: formData.sabor,
          diseño: formData.diseño,
          fechaEntrega: formData.fechaEntrega,
          personas: parseInt(formData.personas),
          telefono: formData.telefono,
          email: formData.email,
          mensaje: formData.mensaje,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al registrar la reserva');
      }

      toast.success(`Reserva #${data.id} registrada con éxito. Te contactaremos pronto.`);
      setSubmitting(false);
      setFormData({
        tipoTorta: '',
        sabor: '',
        diseño: '',
        fechaEntrega: '',
        personas: '',
        telefono: '',
        email: '',
        mensaje: '',
      });
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setSubmitting(false);
    }
  };

  const tipos = [
    'Pastel de Cumpleaños',
    'Tarta de Bodas',
    'Tarta de Quinceañera',
    'Tarta Infantil',
    'Tarta Corporativa',
    'Tarta de Aniversario',
    'Tarta de X años',
    'Otro',
  ];

  const sabores = [
    'Chocolate',
    'Vainilla',
    'Red Velvet',
    'Fresas con Crema',
    'Tres Leches',
    'Mousse de Chocolate',
    'Manzanas',
    'Café',
    'Matcha',
    'Otro',
  ];

  return (
    <div className="agenda-container">
      <ToastContainer />
      <section className="agenda-header">
        <div className="agenda-hero-overlay">
          <h1 className="agenda-title">Agenda y Eventos</h1>
          <p className="agenda-subtitle">Reserva tu tarta personalizada y haz de tu evento algo inolvidable</p>
        </div>
      </section>

      <Container className="mt-5">
        <Row>
          <Col md={8}>
            <Form onSubmit={handleSubmit}>
              <Card>
                <Card.Body>
                  <h3 className="agenda-form-title">Reserva tu Tarta Personalizada</h3>
                  
                  <Row>
                    <Form.Group className="mb-3" controlId="tipoTorta">
                      <Form.Label>Tipo de Torta *</Form.Label>
                      <Form.Select
                        name="tipoTorta"
                        value={formData.tipoTorta}
                        onChange={handleChange}
                        isInvalid={!!errors.tipoTorta}
                        required
                      >
                        <option value="">Selecciona un tipo</option>
                        {tipos.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-danger">{errors.tipoTorta}</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="sabor">
                      <Form.Label>Sabor *</Form.Label>
                      <Form.Select
                        name="sabor"
                        value={formData.sabor}
                        onChange={handleChange}
                        isInvalid={!!errors.sabor}
                        required
                      >
                        <option value="">Selecciona un sabor</option>
                        {sabores.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-danger">{errors.sabor}</Form.Text>
                    </Form.Group>
                  </Row>

                  <Form.Group className="mb-3" controlId="diseño">
                    <Form.Label>Diseño Deseado *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="diseño"
                      value={formData.diseño}
                      onChange={handleChange}
                      isInvalid={!!errors.diseño}
                      placeholder="Describe el diseño, colores, temática que deseas para tu torta..."
                      required
                    />
                    <Form.Text className="text-danger">{errors.diseño}</Form.Text>
                  </Form.Group>

                  <Row>
                    <Form.Group className="mb-3" controlId="fechaEntrega">
                      <Form.Label>Fecha de Entrega *</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaEntrega"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.fechaEntrega}
                        onChange={handleChange}
                        isInvalid={!!errors.fechaEntrega}
                        required
                      />
                      <Form.Text className="text-danger">{errors.fechaEntrega}</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="personas">
                      <Form.Label>Número de Personas (Porciones) *</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="100"
                        name="personas"
                        value={formData.personas}
                        onChange={handleChange}
                        isInvalid={!!errors.personas}
                        required
                      />
                      <Form.Text className="text-danger">{errors.personas}</Form.Text>
                    </Form.Group>
                  </Row>

                  <Row>
                    <Form.Group className="mb-3" controlId="telefono">
                      <Form.Label>Teléfono *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        isInvalid={!!errors.telefono}
                        required
                      />
                      <Form.Text className="text-danger">{errors.telefono}</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Correo Electrónico *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        required
                      />
                      <Form.Text className="text-danger">{errors.email}</Form.Text>
                    </Form.Group>
                  </Row>

                  <Form.Group className="mb-3" controlId="mensaje">
                    <Form.Label>Mensaje Adicional</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder="¿Alguna instrucción especial? ¿Alergias? ¿Decoraciones específicas?"
                    />
                  </Form.Group>

                  <div className="agenda-actions">
                    <Button variant="danger" size="lg" type="submit" disabled={submitting}>
                      {submitting ? 'Enviando...' : 'Reservar Ahora'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Form>
          </Col>

          <Col md={4}>
            <Card className="agenda-info sticky-info">
              <Card.Body>
                <h4 className="agenda-info-title">ℹ️ Información Importante</h4>
                <ul className="agenda-info-list">
                  <li>Reservas con mínimo 48 horas de anticipación</li>
                  <li>Diseño personalizado sujeto a disponibilidad</li>
                  <li>Se requiere 50% de anticipo para confirmar</li>
                  <li>Envío disponible en la zona metropolitana</li>
                  <li>Te contactaremos para confirmar detalles</li>
                  <li>Garantía de frescura y calidad</li>
                </ul>
                <div className="agenda-contact">
                  <p>Teléfono: (04) 222-3333</p>
                  <p>Email: reservas@instantesdulces.com</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AgendaEventos;
