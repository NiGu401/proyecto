import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = '';

function Panel() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    productos: 0,
    reservas: 0,
    contactos: 0,
    contactosSinLeer: 0,
    reservasPendientes: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("usuario");

    if (!token) {
      navigate("/login");
      return;
    }

    setUsuario(JSON.parse(user));
    loadStats();
  }, [navigate]);

  const loadStats = async () => {
    try {
      // Cargar todas las métricas en paralelo
      const [productosRes, reservasRes, contactosRes] =
        await Promise.all([
          fetch(`${API_URL}/api/productos`),
          fetch(`${API_URL}/api/reservas`),
          fetch(`${API_URL}/api/contactos`),
        ]);

      const productos = await productosRes.json();
      const reservas = await reservasRes.json();
      const contactos = await contactosRes.json();

      setStats({
        productos: productos.productos?.length || 0,
        reservas: reservas.reservas?.length || 0,
        contactos: contactos.contactos?.length || 0,
        contactosSinLeer:
          contactos.contactos?.filter((c) => c.leido === 0).length || 0,
        reservasPendientes:
          reservas.reservas?.filter((r) => r.estado === "pendiente").length || 0,
      });
    } catch (error) {
      console.error("Error al cargar métricas:", error);
    }
    setLoading(false);
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
    } catch (e) {
      console.error("Error al cerrar sesión");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    // Notificar al Header que cambió el estado de login
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('logout'));

    navigate("/login");
  };

  // Botón de logout con estilo visible
  const logoutBtnStyle = {
    background: '#C21919',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background 0.2s',
  };

  if (!usuario) {
    return null;
  }

  const isAdmin = usuario.rol_id === 1;

  return (
    <div className="panel-container">
      <ToastContainer />
      <Container className="mt-4">
        <h1 className="mb-3">
          Bienvenido, {usuario.nombre}
        </h1>
        <p>
          Correo: {usuario.correo} | Rol:{" "}
          <span className={isAdmin ? "text-danger fw-bold" : ""}>
            {isAdmin ? "Administrador" : "Usuario"}
          </span>
        </p>

        {loading ? (
          <p>Cargando métricas...</p>
        ) : (
          <>
            {/* Tarjetas de métricas */}
            <Row className="mb-4">
              <Col md={4}>
                <Card className="h-100 text-center border-warning">
                  <Card.Body>
                    <Card.Title className="text-warning">Reservas</Card.Title>
                    <h2 className="text-warning">{stats.reservas}</h2>
                    <Card.Text>Reservas totales</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="h-100 text-center border-info">
                  <Card.Body>
                    <Card.Title className="text-info">Contactos</Card.Title>
                    <h2 className="text-info">{stats.contactos}</h2>
                    <Card.Text>Mensajes recibidos</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Alertas */}
            {(stats.contactosSinLeer > 0 || stats.reservasPendientes > 0) && (
              <div className="alert alert-warning" role="alert">
                <strong>Alertas:</strong>{" "}
                {stats.contactosSinLeer > 0 && (
                  <>
                    Hay <b>{stats.contactosSinLeer}</b> mensaje(s) sin leer. |{" "}
                  </>
                )}
                {stats.reservasPendientes > 0 && (
                  <>
                    Hay <b>{stats.reservasPendientes}</b> reserva(s) pendiente(s).
                  </>
                )}
              </div>
            )}

            {/* Acciones rápidas */}
            <Row className="mt-4">
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <h4 className="admin-section-title">Acciones Rápidas</h4>
                    <ListGroup variant="flush">
                      {isAdmin && (
                        <>
                          <ListGroup.Item
                            action
                            className="list-group-item-action"
                            onClick={() => navigate("/admin-panel")}
                            style={{ cursor: "pointer" }}
                          >
                            Ir al Panel de Administración
                          </ListGroup.Item>
                        </>
                      )}
                      <ListGroup.Item
                        action
                        className="list-group-item-action"
                        onClick={() => navigate("/menu")}
                        style={{ cursor: "pointer" }}
                      >
                        Ir al Menú
                      </ListGroup.Item>

                      <ListGroup.Item
                        action
                        className="list-group-item-action"
                        onClick={() => navigate("/agenda-eventos")}
                        style={{ cursor: "pointer" }}
                      >
                        Agendar Evento
                      </ListGroup.Item>
                      <ListGroup.Item
                        action
                        className="list-group-item-action"
                        onClick={() => navigate("/contacto")}
                        style={{ cursor: "pointer" }}
                      >
                        Enviar Contacto
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <h4 className="admin-section-title">Resumen</h4>
                    <ListGroup variant="flush">

                      <ListGroup.Item>
                        <div className="d-flex justify-content-between">
                          <span>Reservas pendientes:</span>
                          <span className="fw-bold text-warning">{stats.reservasPendientes}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between">
                          <span>Contactos sin leer:</span>
                          <span className="fw-bold text-danger">{stats.contactosSinLeer}</span>
                        </div>
                      </ListGroup.Item>

                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Botón de logout */}
            <div className="mt-4 text-center">
              <button
                onClick={logout}
                style={logoutBtnStyle}
                onMouseEnter={(e) => e.target.style.background = '#9b1515'}
                onMouseLeave={(e) => e.target.style.background = '#C21919'}
              >
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default Panel;
