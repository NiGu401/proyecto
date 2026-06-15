import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../css.css';

const API_URL = '';

// Imágenes según categoría
const categoryImages = {
  'Pasteles': '/Imagenes/pasteles.jfif',
  'Tartas': '/Imagenes/tartadefresas.jfif',
  'Repostería Individual': '/Imagenes/brownie.jpg',
  'Galletas': '/Imagenes/galletas.jpg',
  'Cupcakes': '/Imagenes/cupcake.jpg',
  'Cafetería y Té': '/Imagenes/carrucel2.jpg',
  'Combos': '/Imagenes/pasteldechoco.jpg',
  'Sándwiches': '/Imagenes/sandwich.jfif',
  'Bebidas': '/Imagenes/bebida.jfif',
  'Postres': '/Imagenes/postre.jfif',
  'Panadería': '/Imagenes/pan.jfif',
};

function Menu() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carrito, setCarrito] = useState([]);
  const [categorias, setCategorias] = useState({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/productos`);
      const data = await response.json();
      const activos = (data.productos || []).filter(p => p.activo === 1);
      setProductos(activos);

      // Agrupar por categoría
      const agrupados = {};
      activos.forEach((producto) => {
        const cat = producto.categoria || 'General';
        if (!agrupados[cat]) {
          agrupados[cat] = [];
        }
        agrupados[cat].push(producto);
      });
      setCategorias(agrupados);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
    setLoading(false);
  };

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

  const removeFromCart = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
    toast.info('Producto eliminado del carrito');
  };

  const updateCartQuantity = (id, cantidad) => {
    if (cantidad === 0) {
      removeFromCart(id);
      return;
    }
    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad: cantidad } : item
    ));
  };

  // Helper para convertir precio string a numero
  const precioNum = (p) => {
    if (typeof p === 'number') return p;
    const n = parseFloat(p);
    return isNaN(n) ? 0 : n;
  };
  const formatPrecio = (p) => `$${precioNum(p).toFixed(2)}`;

  const totalCarrito = carrito.reduce((total, item) => total + precioNum(item.precio) * item.cantidad, 0);

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h2>Cargando menú...</h2>
        </div>
      </Container>
    );
  }

  if (Object.keys(categorias).length === 0) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h2 className="text-danger">No hay productos disponibles</h2>
          <p className="text-muted">Vuelve a intentar más tarde</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="menu-container">
      <Container className="mt-4">
        <h1 className="mb-4 text-center">Nuestro Menú</h1>
        <p className="text-center text-muted mb-5">Explora todos nuestros deliciosos productos organizados por categoría</p>

        {/* Categorías con productos */}
        {Object.entries(categorias).map(([categoria, productosCat]) => (
          <div key={categoria} className="mb-5 pb-4">
            {/* Título de la categoría */}
            <div className="text-center mb-4">
              <h2 className="menu-category-title" style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#C21919',
                borderBottom: '3px solid #C21919',
                display: 'inline-block',
                padding: '10px 30px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f8f8f8, #fff)',
              }}>
                {categoria}
              </h2>
            </div>

            <Row>
              {productosCat.map((producto) => (
                <Col key={producto.id} md={4} className="mb-4">
                  <Card className="h-100 shadow-sm menu-card" style={{
                    border: '2px solid #f0f0f0',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Imagen del producto */}
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <Card.Img
                        variant="top"
                        src={categoryImages[categoria] || '/Imagenes/default.jpg'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      />
                      {/* Badge de categoría */}
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(194, 25, 25, 0.9)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}>
                        {categoria}
                      </span>
                    </div>

                    <Card.Body className="text-center">
                      <Card.Title style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '8px' }}>
                        {producto.nombre}
                      </Card.Title>
                      <div className="mt-2">
                        <span className="text-danger fw-bold fs-5">${formatPrecio(producto.precio)}</span>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="mt-3"
                        style={{
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          padding: '6px 20px',
                        }}
                        onClick={() => addToCart(producto)}
                      >
                            <span style={{ marginRight: '5px' }}>🛒</span> Agregar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}

        {/* Carrito flotante */}
        {carrito.length > 0 && (
          <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
            <Card className="shadow-lg" style={{ width: '350px' }}>
              <Card.Header className="bg-danger text-white">
                <h5 className="mb-0">🛒 Carrito ({carrito.length} items)</h5>
              </Card.Header>
              <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {carrito.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: '500' }}>{item.nombre}</span>
                      <span className="text-muted ms-2">${formatPrecio(item.precio)}</span>
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
                        style={{ width: '45px' }}
                      />
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => updateCartQuantity(item.id, item.cantidad + 1)}
                      >+</Button>
                      <span className="ms-2 fw-bold">${(precioNum(item.precio) * item.cantidad).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong className="text-danger fs-5">${totalCarrito.toFixed(2)}</strong>
                  </div>
                  <Button className="mt-2 w-100" onClick={() => toast.info('¡Gracias por tu compra!')}>
                    Comprar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Menu;
