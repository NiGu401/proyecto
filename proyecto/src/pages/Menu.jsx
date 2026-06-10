import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css.css';

function Menu() {
  const [activeTab, setActiveTab] = useState('pasteles');
  const [cart, setCart] = useState([]);

  const products = {
    pasteles: [
      { id: 1, name: 'Pastel de Chocolate', price: 35, desc: 'Exquisito pastel de chocolate con ganache', img: '/Imagenes/Comida Rapida.jpg' },
      { id: 2, name: 'Tarta de Fresas', price: 40, desc: 'Tarta con fresas naturales y crema chantilly', img: '/Imagenes/verduras.jpg' },
      { id: 3, name: 'Tarta de Bodas (3 pisos)', price: 150, desc: 'Perfecta para momentos especiales', img: '/Imagenes/Bebidas.png' },
      { id: 4, name: 'Pastel de Vainilla', price: 30, desc: 'Clásico pastel de vainilla con frosting', img: '/Imagenes/Logo.png' },
    ],
    reposteria: [
      { id: 5, name: 'Cupcake Vainilla', price: 3, desc: 'Cupcake con frosting de vainilla', img: '/Imagenes/Logo.svg' },
      { id: 6, name: 'Cheesecake Arándanos', price: 5, desc: 'Cheesecake cremoso con arándanos', img: '/Imagenes/Logo.png' },
      { id: 7, name: 'Galletas de Chocolate', price: 2, desc: 'Galletas crujientes con chips de chocolate', img: '/Imagenes/Comida Rapida.jpg' },
      { id: 8, name: 'Brownies', price: 2, desc: 'Brownies densos de chocolate', img: '/Imagenes/verduras.jpg' },
    ],
    cafeteria: [
      { id: 9, name: 'Espresso Doble', price: 4, desc: 'Café espresso intenso y aromático', img: '/Imagenes/Bebidas.png' },
      { id: 10, name: 'Café de Grano', price: 5, desc: 'Café premium de grano selecto', img: '/Imagenes/Logo.png' },
      { id: 11, name: 'Té Matcha Latte', price: 6, desc: 'Matcha japonés con leche cremosa', img: '/Imagenes/Bebidas.png' },
      { id: 12, name: 'Té Infusionado', price: 4, desc: 'Selección de tés orgánicos', img: '/Imagenes/verduras.jpg' },
    ],
    combos: [
      { id: 13, name: 'Café + Cookie', price: 6, desc: 'Espresso doble con galleta de chocolate', img: '/Imagenes/Bebidas.png' },
      { id: 14, name: 'Sándwich + Té', price: 8, desc: 'Sándwich artesanal con té infusionado', img: '/Imagenes/Comida Rapida.jpg' },
      { id: 15, name: 'Cupcake + Cappuccino', price: 8, desc: 'Cupcake de chocolate con cappuccino', img: '/Imagenes/Logo.svg' },
      { id: 16, name: 'Combo Familiar', price: 45, desc: 'Pastel individual para 4 personas + bebidas', img: '/Imagenes/verduras.jpg' },
    ],
  };

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
    toast.success(`${product.name} agregado al carrito`);
  };

  const tabLabels = {
    pasteles: 'Pasteles y Tartas',
    reposteria: 'Repostería Individual',
    cafeteria: 'Cafetería y Té',
    combos: 'Combos y Parejas',
  };

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
          {Object.keys(products).map((key) => (
            <Nav.Item key={key}>
              <Nav.Link eventKey={key} onClick={() => setActiveTab(key)}>
                {tabLabels[key]}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* Productos */}
        <Row className="products-grid mt-4">
          {products[activeTab].map((product) => (
            <Col key={product.id} md={3} sm={6} className="mb-4">
              <Card className="product-card h-100">
                <Card.Img variant="top" className="product-img" src={product.img} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.desc}</Card.Text>
                  <div className="product-price">${product.price}</div>
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
      </Container>
    </div>
  );
}

export default Menu;
