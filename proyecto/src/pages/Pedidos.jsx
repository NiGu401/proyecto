import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css.css';

function Pedidos() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('carrito');
  const [cart, setCart] = useState([
    { id: 1, name: 'Cupcake Vainilla', price: 3, quantity: 2 },
    { id: 2, name: 'Espresso Doble', price: 4, quantity: 1 },
  ]);
  const [orderNumber, setOrderNumber] = useState(null);

  const deliveryInfo = {
    address: '',
    date: '',
    time: '',
    paymentMethod: 'efectivo',
  };

  const [errors, setErrors] = useState({});

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    toast.info('Producto eliminado del carrito');
  };

  const updateQuantity = (id, qty) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, qty) } : item)));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!deliveryInfo.address) newErrors.address = 'Dirección requerida';
    if (!deliveryInfo.date) newErrors.date = 'Fecha de entrega requerida';
    if (deliveryInfo.date) {
      const selectedDate = new Date(deliveryInfo.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'No se pueden hacer pedidos para fechas pasadas';
      }
    }
    if (!deliveryInfo.time) newErrors.time = 'Hora de entrega requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor corrige los errores del formulario');
      return;
    }

    const newOrder = {
      id: Math.floor(Math.random() * 100000),
      date: new Date().toLocaleString(),
      items: cart,
      total: total,
      address: deliveryInfo.address,
      deliveryDate: deliveryInfo.date,
      paymentMethod: deliveryInfo.paymentMethod,
    };

    setOrderNumber(newOrder.id);
    toast.success(`¡Pedido #${newOrder.id} confirmado!`);
    setCart([]);
    setActiveTab('confirmacion');
  };

  return (
    <div className="pedidos-container">
      <ToastContainer />
      <section className="pedidos-header">
        <Container>
          <h1 className="pedidos-title">Pedidos Online</h1>
          <p className="pedidos-subtitle">Tu pedido en unos pocos pasos</p>
        </Container>
      </section>

      {/* Tabs del proceso */}
      <Container>
        <div className="pedidos-tabs">
          <Button
            variant={activeTab === 'carrito' ? 'danger' : 'outline-danger'}
            onClick={() => setActiveTab('carrito')}
            disabled={cart.length === 0 && activeTab === 'carrito'}
          >
Carrito ({cart.length})
          </Button>
          <Button
            variant={activeTab === 'checkout' ? 'danger' : 'outline-danger'}
            onClick={() => setActiveTab('checkout')}
            disabled={cart.length === 0}
          >
            💳 Finalizar Compra
          </Button>
          <Button
            variant={activeTab === 'confirmacion' ? 'danger' : 'outline-danger'}
            onClick={() => {
              setActiveTab('carrito');
              setOrderNumber(null);
            }}
            disabled={orderNumber === null}
          >
            Confirmación
          </Button>
        </div>
      </Container>

      <Container className="mt-4">
        {/* Carrito */}
        {activeTab === 'carrito' && (
          <div className="carrito-section">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos desde nuestro menú</p>
                <Button variant="danger" onClick={() => navigate('/menu')}>
                  Ir al Menú
                </Button>
              </div>
            ) : (
              <Card>
                <Card.Body>
                  <h3 className="carrito-title">Tu Carrito</h3>
                  <Table className="cart-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>${item.price}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="mx-2">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </td>
                          <td>${item.price * item.quantity}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => removeItem(item.id)}
                            >
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="cart-total">
                    <h3>Total: ${total.toFixed(2)}</h3>
                    <Button variant="danger" size="lg" onClick={() => setActiveTab('checkout')}>
                      Continuar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        )}

        {/* Checkout */}
        {activeTab === 'checkout' && (
          <Form onSubmit={handleCheckout}>
            <Card>
              <Card.Body>
                <h3 className="checkout-title">💳 Finalizar Compra</h3>

                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Dirección de entrega</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tu dirección completa"
                    value={deliveryInfo.address}
                    onChange={(e) => {
                      deliveryInfo.address = e.target.value;
                      if (errors.address) setErrors({ ...errors, address: '' });
                    }}
                    isInvalid={!!errors.address}
                    required
                  />
                  <Form.Text className="text-danger">{errors.address}</Form.Text>
                </Form.Group>

                <Row>
                  <Form.Group className="mb-3" controlId="deliveryDate">
                    <Form.Label>Fecha de entrega</Form.Label>
                    <Form.Control
                      type="date"
                      value={deliveryInfo.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        deliveryInfo.date = e.target.value;
                        if (errors.date) setErrors({ ...errors, date: '' });
                      }}
                      isInvalid={!!errors.date}
                      required
                    />
                    <Form.Text className="text-danger">{errors.date}</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="deliveryTime">
                    <Form.Label>Hora de entrega</Form.Label>
                    <Form.Control
                      type="time"
                      value={deliveryInfo.time}
                      onChange={(e) => {
                        deliveryInfo.time = e.target.value;
                        if (errors.time) setErrors({ ...errors, time: '' });
                      }}
                      isInvalid={!!errors.time}
                      required
                    />
                    <Form.Text className="text-danger">{errors.time}</Form.Text>
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="paymentMethod">
                  <Form.Label>Método de pago</Form.Label>
                  <Form.Select
                    value={deliveryInfo.paymentMethod}
                    onChange={(e) => (deliveryInfo.paymentMethod = e.target.value)}
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="tarjeta">💳 Tarjeta de Crédito/Débito</option>
                    <option value="transferencia">🏦 Transferencia Bancaria</option>
                  </Form.Select>
                </Form.Group>

                <div className="order-summary">
                  <h4>Resumen del Pedido</h4>
                  {cart.map((item) => (
                    <div key={item.id} className="summary-item">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="summary-total">
                    <strong>Total: ${total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="checkout-actions">
                  <Button variant="secondary" onClick={() => setActiveTab('carrito')} className="me-2">
                    ← Volver al Carrito
                  </Button>
                  <Button variant="danger" type="submit" size="lg">
                    Confirmar Pedido
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        )}

        {/* Confirmación */}
        {activeTab === 'confirmacion' && orderNumber && (
          <div className="confirmacion-section">
            <Card className="text-center">
              <Card.Body>
                <div className="confirmation-icon">Confirmado</div>
                <h3 className="confirmation-title">¡Pedido Confirmado!</h3>
                <p className="confirmation-number">Número de Orden: #{orderNumber}</p>
                <p className="confirmation-date">Fecha: {new Date().toLocaleString()}</p>
                <p className="confirmation-total">Total: ${{ total }}.00</p>
                <p className="confirmation-address">
                  Dirección: {deliveryInfo.address}
                </p>
                <p className="confirmation-delivery">
                  Entrega: {deliveryInfo.date} a las {deliveryInfo.time}
                </p>
                <p className="confirmation-method">
                  Pago: {deliveryInfo.paymentMethod}
                </p>
                <Button variant="danger" onClick={() => {
                  setActiveTab('carrito');
                  setOrderNumber(null);
                }}>
                  Hacer Otro Pedido
                </Button>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Pedidos;
