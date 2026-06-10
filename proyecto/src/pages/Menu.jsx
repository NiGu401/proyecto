import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css.css';

const API_URL = '';

const CATEGORIES_MAP = {
  pasteles: ['Pasteles', 'Tortas', 'Pasteles de Chocolate', 'Pasteles de Vainilla'],
  reposteria: ['Repostería', 'Cupcakes', 'Galletas', 'Brownies'],
  cafeteria: ['Cafetería', 'Café', 'Té', 'Bebidas'],
  combos: ['Combos', 'Parejas', 'Packs'],
};

function Menu() {
  const [activeTab, setActiveTab] = useState('pasteles');
  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/productos`);
      const data = await response.json();
      if (data.productos) {
        setAllProducts(data.productos);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
    setLoading(false);
  };

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
    toast.success(`${product.nombre} agregado al carrito`);
  };

  const tabLabels = {
    pasteles: 'Pasteles y Tartas',
    reposteria: 'Repostería Individual',
    cafeteria: 'Cafetería y Té',
    combos: 'Combos y Parejas',
  };

  const getFilteredProducts = () => {
    const keywords = CATEGORIES_MAP[activeTab] || [];
    return allProducts.filter((p) => {
      const isActive = p.activo === 1 || p.activo === true;
      const isCategory = keywords.some((k) =>
        p.categoria && p.categoria.toLowerCase().includes(k.toLowerCase())
      );
      return isActive && isCategory;
    });
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="menu-container">
      <ToastContainer />
      <section className="menu-header">
        <Container>
          <h1 className="menu-title">Nuestro Menú</h1>
          <p className="menu-subtitle">Explora nuestra selección de productos artesanales</p>
        </Container>
      </section>

      <Container>
        {/* Tabs de Categorías */}
        <Nav className="menu-tabs" variant="pills" activeKey={activeTab} onSelect={setActiveTab}>
          {Object.keys(tabLabels).map((key) => (
            <Nav.Item key={key}>
              <Nav.Link eventKey={key} onClick={() => setActiveTab(key)}>
                {tabLabels[key]}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* Productos */}
        {loading ? (
          <p className="text-center mt-5">⏳ Cargando productos...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center mt-5">No hay productos disponibles en esta categoría</p>
        ) : (
          <Row className="products-grid mt-4">
            {filteredProducts.map((product) => (
              <Col key={product.id} md={3} sm={6} className="mb-4">
                <Card className="product-card h-100">
                  <Card.Img variant="top" className="product-img" src="/Imagenes/Logo.png" />
                  <Card.Body>
                    <Card.Title>{product.nombre}</Card.Title>
                    <div className="product-price">${parseFloat(product.precio).toFixed(2)}</div>
                    <div className="product-actions">
                      <Button size="sm" variant="danger" onClick={() => addToCart(product)}>
                        Agregar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Menu;