import { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const API_URL = '';

function CarritoFlotante({ productosDisponibles }) {
  const [carrito, setCarrito] = useState([]);
  const [showCartForm, setShowCartForm] = useState(false);
  const [cartVisible, setCartVisible] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentData, setPaymentData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });
  const [paymentErrors, setPaymentErrors] = useState({
    nombre: false,
    email: false,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const carritoRef = useRef(carrito);

  useEffect(() => {
    carritoRef.current = carrito;
  }, [carrito]);

  // Cargar carrito del localStorage al montar
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

  // Escuchar cambios en el carrito desde otras pestañas o componentes
  useEffect(() => {
    const handleCartUpdate = () => {
      const saved = localStorage.getItem('carrito');
      if (saved) {
        setCarrito(JSON.parse(saved));
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

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

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Iniciar checkout
  const iniciarCheckout = () => {
    if (carrito.length === 0) {
      toast.warning('El carrito está vacío');
      return;
    }
    setShowCheckout(true);
    setCheckoutStep(1);
    setPaymentDone(false);
    setPaymentErrors({ nombre: false, email: false });
    setFile(null);
    setPreview(null);
  };

  // Subir comprobante y confirmar pago
  const confirmarPago = async () => {
    if (!file) {
      toast.error('❌ Debés subir una imagen del comprobante');
      return;
    }

    setLoadingUpload(true);

    try {
      const formData = new FormData();
      formData.append('comprobante', file);
      formData.append('nombre', paymentData.nombre);
      formData.append('email', paymentData.email);
      formData.append('telefono', paymentData.telefono);
      formData.append('items', JSON.stringify(carrito.map(item => ({
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      }))));

      const response = await fetch(`${API_URL}/api/comprobante`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentDone(true);
        setCarrito([]);
        localStorage.removeItem('carrito');
        setShowCheckout(false);
        toast.success('🎉 ¡Gracias por tu compra! Recibirás un correo con los detalles.');
      } else {
        toast.error('❌ Error al subir el comprobante: ' + data.mensaje);
      }
    } catch (error) {
      console.error('Error al confirmar pago:', error);
      toast.error('❌ Error de conexión');
    } finally {
      setLoadingUpload(false);
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
      <Modal show={showCheckout} onHide={() => { setShowCheckout(false); setCheckoutStep(1); setPaymentDone(false); }} size="lg" centered className="shadow-lg">
        <Modal.Header closeButton style={{ background: '#C21919', color: 'white' }}>
          <Modal.Title>{
            paymentDone ? '✅ Pago Confirmado' : 
            checkoutStep === 1 ? '🛍️ Finalizar Compra' : '💳 Pagar con QR'
          }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentDone ? (
            <>
              <div className="text-center py-4">
                <div className="mb-3">
                  <span style={{ fontSize: '3rem' }}>✅</span>
                </div>
                <h4 className="text-success mb-3">¡Gracias por tu compra!</h4>
                <p className="text-muted">Recibirás un correo con los detalles de tu pedido.</p>
                <Button
                  variant="danger"
                  onClick={() => { setShowCheckout(false); setCheckoutStep(1); setPaymentDone(false); }}
                  className="mt-3"
                >
                  Volver al inicio
                </Button>
              </div>
            </>
          ) : checkoutStep === 1 ? (
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
              <h5 className="mb-3">📱 Pagá con QR</h5>
              <p className="text-muted mb-3">Escaneá el QR y subí el comprobante de pago:</p>
              
              <div className="text-center mb-4">
                <div className="p-3 border rounded mb-3" style={{ background: '#fff', maxWidth: '300px', margin: '0 auto' }}>
                  <img src="/Imagenes/qr-pago.png" alt="QR para pagar" className="img-fluid" style={{ maxWidth: '250px' }} />
                </div>
              </div>
              
              <div className="text-center mb-3">
                <p className="text-danger fw-bold fs-5">Total a pagar: {formatPrecio(totalCarrito)}</p>
              </div>
              
              <div className="mb-3">
                <Form.Label>Subir comprobante de pago *</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <Form.Text className="text-muted">Formatos: JPG, PNG, WEBP. Max 5MB.</Form.Text>
              </div>
              
              {preview && (
                <div className="text-center mb-3">
                  <p className="text-muted">Vista previa:</p>
                  <img src={preview} alt="Comprobante" className="img-fluid rounded border" style={{ maxWidth: '200px' }} />
                </div>
              )}
              
              <p className="text-muted text-center mt-3">Una vez realizado el pago, subí el comprobante y hacé clic en «Confirmar».</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {paymentDone ? (
            <Button
              variant="danger"
              onClick={() => { setShowCheckout(false); setCheckoutStep(1); setPaymentDone(false); }}
            >
              Volver al inicio
            </Button>
          ) : checkoutStep === 1 ? (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCheckout(false);
                  setCheckoutStep(1);
                  setPaymentDone(false);
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
                }}
              >
                Continuar al Pago
              </Button>
            </>
          ) : (
            <Button
              variant="success"
              onClick={confirmarPago}
              disabled={loadingUpload}
            >
              {loadingUpload ? '⏳ Subiendo...' : '✅ Confirmar Pago'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CarritoFlotante;