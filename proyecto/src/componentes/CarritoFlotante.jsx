import { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

const API_URL = '';

function CarritoFlotante({ productosDisponibles }) {
  const [carrito, setCarrito] = useState([]);
  const [showCartForm, setShowCartForm] = useState(false);
  const [cartVisible, setCartVisible] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    metodoPago: 'mercado_pago',
  });
  const [paymentErrors, setPaymentErrors] = useState({
    nombre: false,
    email: false,
  });

  // Cargar carrito del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('carrito');
    if (saved) {
      setCarrito(JSON.parse(saved));
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  // Agregar producto al carrito
  const addToCart = (producto) => {
    const existente = carrito.find(item => item.id === producto.id);
    if (existente) {
      setCarrito(carrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  // Remover del carrito
  const removeFromCart = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
    toast.info('Producto eliminado del carrito');
  };

  // Actualizar cantidad
  const updateCartQuantity = (id, cantidad) => {
    if (cantidad === 0) {
      removeFromCart(id);
      return;
    }
    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad: cantidad } : item
    ));
  };

  // Validar campos
  const validateFields = () => {
    let errors = { nombre: false, email: false };
    let valid = true;

    if (!paymentData.nombre || paymentData.nombre.trim() === '') {
      errors.nombre = true;
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!paymentData.email || !emailRegex.test(paymentData.email.trim())) {
      errors.email = true;
      valid = false;
    }

    setPaymentErrors(errors);
    return valid;
  };

  // Iniciar checkout
  const iniciarCheckout = () => {
    if (carrito.length === 0) {
      toast.warning('El carrito está vacío');
      return;
    }
    setShowCheckout(true);
    setCheckoutStep(1);
    setPaymentErrors({ nombre: false, email: false });
  };

  // Procesar pago MercadoPago
  const procesarPago = async () => {
    if (!paymentData.nombre || !paymentData.email) {
      toast.error('❌ Completá todos los campos');
      return;
    }

    setLoadingPayment(true);

    try {
      const response = await fetch(`${API_URL}/api/pago/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: carrito.map(item => ({
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
          })),
          nombre: paymentData.nombre,
          email: paymentData.email,
          telefono: paymentData.telefono,
        }),
      });

      const data = await response.json();

      if (data.urlPago) {
        setShowCheckout(false);
        setShowPayment(true);
        window.open(data.urlPago, '_blank');
        toast.success('✅ Redirigiendo al pago...');
      } else {
        throw new Error('No se recibió la URL de pago');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast.error('❌ Error al crear el pago: ' + error.message);
    } finally {
      setLoadingPayment(false);
    }
  };

  // Procesar pago manual
  const procesarPagoManual = async () => {
    if (!paymentData.nombre || !paymentData.email) {
      toast.error('❌ Completá todos los campos');
      return;
    }

    setLoadingPayment(true);

    try {
      const response = await fetch(`${API_URL}/api/pago/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: carrito.map(item => ({
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
          })),
          nombre: paymentData.nombre,
          email: paymentData.email,
          telefono: paymentData.telefono,
          metodo_pago: paymentData.metodoPago,
          total: totalCarrito.toFixed(2),
        }),
      });

      const data = await response.json();

      if (data.id) {
        setShowCheckout(false);
        toast.success('✅ ' + data.mensaje);
        setCarrito([]);
      } else {
        throw new Error(data.mensaje || 'Error al registrar el pago');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      toast.error('❌ Error: ' + error.message);
    } finally {
      setLoadingPayment(false);
    }
  };

  // Helper precio
  const precioNum = (p) => {
    if (typeof p === 'number') return p;
    const n = parseFloat(p);
    return isNaN(n) ? 0 : n;
  };
  const formatPrecio = (p) => `${precioNum(p).toFixed(2)}Bs`;

  const totalCarrito = carrito.reduce((total, item) => total + precioNum(item.precio) * item.cantidad, 0);

  if (carrito.length === 0) return null;

  return (
    <>
      {/* Botón flotante */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <div className="d-flex justify-content-end mb-2">
          <Button
            size="sm"
            variant="danger"
            onClick={() => setCartVisible(!cartVisible)}
            style={{
              borderRadius: '50%',
              width: '45px',
              height: '45px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {cartVisible ? '🛒' : '🛍️'}
          </Button>
        </div>

        <Card
          className="shadow-lg"
          style={{
            width: '550px',
            opacity: cartVisible ? 1 : 0,
            maxHeight: cartVisible ? '70vh' : 0,
            transform: cartVisible ? 'translateX(0)' : 'translateX(120%)',
            transition: 'all 0.3s ease',
          }}
        >
          <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">🛒 Carrito ({carrito.length} items)</h5>
            <Button
              size="sm"
              variant="light"
              onClick={() => setShowCartForm(!showCartForm)}
              style={{ fontSize: '0.8rem', borderRadius: '6px', padding: '2px 10px' }}
            >
              {showCartForm ? '📦 Items' : '📝 Datos'}
            </Button>
          </Card.Header>
          <Card.Body style={{ maxHeight: '500px', overflowY: 'auto', padding: '1.25rem' }}>
            {showCartForm ? (
              <>
                <h6 className="mb-3">Datos del pedido</h6>
                <div className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Juan Pérez"
                    value={paymentData.nombre}
                    onChange={(e) => setPaymentData({ ...paymentData, nombre: e.target.value })}
                    isInvalid={paymentErrors?.nombre}
                    required
                  />
                  {paymentErrors?.nombre && <Form.Text className="text-danger">El nombre es obligatorio</Form.Text>}
                </div>
                <div className="mb-3">
                  <Form.Label>Correo electrónico *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="juan@ejemplo.com"
                    value={paymentData.email}
                    onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                    isInvalid={paymentErrors?.email}
                    required
                  />
                  {paymentErrors?.email && <Form.Text className="text-danger">Ingresá un correo válido</Form.Text>}
                </div>
                <div className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="(011) 1234-5678"
                    value={paymentData.telefono}
                    onChange={(e) => setPaymentData({ ...paymentData, telefono: e.target.value })}
                  />
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-danger fs-5">{formatPrecio(totalCarrito)}</strong>
                </div>
                <Button
                  className="mt-2 w-100"
                  style={{ background: '#C21919', border: 'none' }}
                  onClick={() => {
                    if (!paymentData.nombre || !paymentData.email) {
                      toast.error('❌ Completá todos los campos');
                      return;
                    }
                    iniciarCheckout();
                  }}
                >
                  🛍️ Comprar Ahora
                </Button>
              </>
            ) : (
              <>
                {carrito.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: '500' }}>{item.nombre}</span>
                      <span className="text-muted ms-2">{formatPrecio(item.precio)}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => updateCartQuantity(item.id, item.cantidad - 1)}
                      >-</Button>
                      <Form.Control
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value))}
                        style={{ width: '60px', fontSize: '1.1rem', textAlign: 'center', padding: '6px' }}
                      />
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => updateCartQuantity(item.id, item.cantidad + 1)}
                      >+</Button>
                      <span className="ms-2 fw-bold">{formatPrecio(precioNum(item.precio) * item.cantidad)}</span>
                    </div>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-danger fs-5">{formatPrecio(totalCarrito)}</strong>
                </div>
                <Button
                  className="mt-2 w-100"
                  style={{ background: '#C21919', border: 'none' }}
                  onClick={iniciarCheckout}
                >
                  🛍️ Comprar Ahora
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Modal Checkout */}
      <Modal show={showCheckout} onHide={() => setShowCheckout(false)} size="lg" centered className="shadow-lg">
        <Modal.Header closeButton style={{ background: '#C21919', color: 'white' }}>
          <Modal.Title>{checkoutStep === 1 ? '🛍️ Finalizar Compra' : '💳 Pago'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {checkoutStep === 1 ? (
            <>
              <h5 className="mb-3">Resumen del pedido</h5>
              <div className="table-responsive mb-3">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nombre}</td>
                        <td>{item.cantidad}</td>
                        <td>{formatPrecio(precioNum(item.precio))}</td>
                        <td>{formatPrecio(precioNum(item.precio) * item.cantidad)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-end">
                <h4 className="text-danger">Total: {formatPrecio(totalCarrito)}</h4>
              </div>
              <hr />
              <h5 className="mb-3">Datos personales</h5>
              <div className="mb-3">
                <Form.Label>Nombre completo *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Juan Pérez"
                  value={paymentData.nombre}
                  onChange={(e) => {
                    setPaymentData({ ...paymentData, nombre: e.target.value });
                    if (paymentErrors.nombre) setPaymentErrors({ ...paymentErrors, nombre: false });
                  }}
                  isInvalid={paymentErrors.nombre}
                  required
                />
                {paymentErrors.nombre && <Form.Text className="text-danger">El nombre es obligatorio</Form.Text>}
              </div>
              <div className="mb-3">
                <Form.Label>Correo electrónico *</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="juan@ejemplo.com"
                  value={paymentData.email}
                  onChange={(e) => {
                    setPaymentData({ ...paymentData, email: e.target.value });
                    if (paymentErrors.email) setPaymentErrors({ ...paymentErrors, email: false });
                  }}
                  isInvalid={paymentErrors.email}
                  required
                />
                {paymentErrors.email && <Form.Text className="text-danger">Ingresá un correo válido</Form.Text>}
              </div>
              <div className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="(011) 1234-5678"
                  value={paymentData.telefono}
                  onChange={(e) => setPaymentData({ ...paymentData, telefono: e.target.value })}
                />
                <Form.Text className="text-muted">Opcional pero útil para coordinar tu pedido</Form.Text>
              </div>
            </>
          ) : (
            <>
              <Alert variant="success">
                ✅ Redirigiendo a MercadoPago para completar el pago.
              </Alert>
              <p className="text-muted">
                Serás redirigido a MercadoPago para finalizar la compra. Una vez completado el pago, recibirás un correo con los datos.
              </p>
              <div className="text-center">
                <img
                  src="https://www.mercadopago.com.ar/assets/images/checkout/checkout-logo.png"
                  alt="MercadoPago"
                  style={{ maxWidth: '200px' }}
                />
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {checkoutStep === 1 ? (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCheckout(false);
                  setCheckoutStep(1);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (!validateFields()) {
                    toast.error('❌ Completá los campos obligatorios');
                    return;
                  }
                  setCheckoutStep(2);
                  setTimeout(() => {
                    if (paymentData.metodoPago === 'mercado_pago') {
                      procesarPago();
                    } else {
                      procesarPagoManual();
                    }
                  }, 100);
                }}
                disabled={loadingPayment}
              >
                {loadingPayment ? '⏳ Procesando...' : 'Continuar al Pago'}
              </Button>
            </>
          ) : (
            <div className="w-100 text-center">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCheckout(false);
                  setCheckoutStep(1);
                  setPaymentData({ nombre: '', email: '', telefono: '', metodoPago: 'mercado_pago' });
                }}
              >
                Volver
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación */}
      <Modal show={showPayment} onHide={() => setShowPayment(false)} size="md" centered>
        <Modal.Header closeButton style={{ background: '#28a745', color: 'white' }}>
          <Modal.Title>✅ Procesando Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Cargando</span>
          </div>
          <h5 className="mt-3">Redirigiendo a MercadoPago...</h5>
          <p className="text-muted">Completá el pago y vuelve para confirmar tu pedido.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              setShowPayment(false);
              setCarrito([]);
              setPaymentData({ nombre: '', email: '', telefono: '', metodoPago: 'mercado_pago' });
              toast.success('🎉 ¡Gracias por tu compra! Recibirás un correo con los detalles.');
            }}
          >
            ✅ Pagué y volveré
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CarritoFlotante;
