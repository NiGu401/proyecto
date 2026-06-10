import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css.css';

const API_URL = '';

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pedidos');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [usuario, setUsuario] = useState(null);

  // ====== ESTADO REAL DESDE BD ======
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [logs, setLogs] = useState([]);

  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [loadingContactos, setLoadingContactos] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Datos para gráficos (simulados con datos reales si hay pedidos)
  const getChartData = () => {
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    pedidos.forEach((p) => {
      try {
        const d = new Date(p.fecha);
        if (!isNaN(d.getTime())) counts[d.getDay()] = (counts[d.getDay()] || 0) + 1;
      } catch (e) { }
    });
    return diasSemana.map((dia, i) => ({ dia, ventas: counts[i] }));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }
    setUsuario(JSON.parse(storedUser));

    // Cargar todos los datos desde BD
    fetchPedidos();
    fetchProductos();
    fetchReservas();
    fetchContactos();
    fetchLogs();
  }, [navigate]);

  // ====== FUNCIONES FETCH ======

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pedidos`);
      const data = await response.json();
      if (data.pedidos) {
        setPedidos(data.pedidos);
      }
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
    setLoadingPedidos(false);
  };

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/productos`);
      const data = await response.json();
      if (data.productos) {
        setProductos(data.productos);
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
    setLoadingProductos(false);
  };

  const fetchReservas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reservas`);
      const data = await response.json();
      if (data.reservas) {
        setReservas(data.reservas);
      }
    } catch (error) {
      console.error('Error al obtener reservas:', error);
    }
    setLoadingReservas(false);
  };

  const fetchContactos = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contactos`);
      const data = await response.json();
      if (data.contactos) {
        setContactos(data.contactos);
      }
    } catch (error) {
      console.error('Error al obtener contactos:', error);
    }
    setLoadingContactos(false);
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/logs`);
      const data = await response.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error al obtener logs:', error);
    }
    setLoadingLogs(false);
  };

  // ====== CRUD FUNCIONES ======

  const resetForm = () => {
    setFormData({ nombre: '', correo: '', precio: '', categoria: '', activo: true });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      categoria: product.categoria,
      activo: product.activo === 1 || product.activo === true,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.precio) {
      toast.error('Nombre y precio son requeridos');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        // Actualizar producto existente
        await fetch(`${API_URL}/api/producto/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: token },
          body: JSON.stringify({
            nombre: formData.nombre,
            precio: parseFloat(formData.precio),
            categoria: formData.categoria,
            activo: formData.activo,
          }),
        });
        toast.success('Producto actualizado');
      } else {
        // Crear nuevo producto
        await fetch(`${API_URL}/api/producto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: token },
          body: JSON.stringify({
            nombre: formData.nombre,
            precio: parseFloat(formData.precio),
            categoria: formData.categoria || 'General',
            activo: formData.activo,
          }),
        });
        toast.success('Producto agregado');
      }
      setShowModal(false);
      resetForm();
      fetchProductos();
    } catch (error) {
      toast.error('Error al guardar producto');
    }
  };

  const toggleActivo = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const producto = productos.find((p) => p.id === id);
      const nuevoActivo = producto.activo === 1 ? 0 : 1;

      await fetch(`${API_URL}/api/producto/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ nombre: producto.nombre, precio: producto.precio, categoria: producto.categoria, activo: nuevoActivo }),
      });
      toast.info('Estado del producto actualizado');
      fetchProductos();
    } catch (error) {
      toast.error('Error al cambiar estado');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/producto/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
      toast.info('Producto eliminado');
      fetchProductos();
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/pedido/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ estado: newStatus }),
      });
      toast.success('Estatus actualizado');
      fetchPedidos();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const updateReservaEstado = async (id, estado) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/reserva/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token },
        body: JSON.stringify({ estado }),
      });
      toast.success('Estado de reserva actualizado');
      fetchReservas();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const deleteReserva = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/reserva/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
      toast.success('Reserva eliminada (eliminación lógica)');
      fetchReservas();
    } catch (error) {
      toast.error('Error al eliminar reserva');
    }
  };

  const markContactRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/contacto/${id}`, {
        method: 'PUT',
        headers: { Authorization: token },
      });
      toast.success('Mensaje marcado como leído');
      fetchContactos();
    } catch (error) {
      toast.error('Error al marcar como leído');
    }
  };

  const deleteContact = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/contacto/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
      toast.success('Mensaje eliminado (eliminación lógica)');
      fetchContactos();
    } catch (error) {
      toast.error('Error al eliminar mensaje');
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(194, 25, 25);
    doc.text('Pastelería de los Sabores - Reporte', 105, 30, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 105, 40, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text('Resumen', 20, 60);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(`Pedidos: ${pedidos.length}`, 25, 72);
    doc.text(`Productos activos: ${productos.filter((p) => p.activo === 1 || p.activo === true).length}`, 25, 82);
    doc.text(`Reservas pendientes: ${reservas.filter((r) => r.estado === 'pendiente').length}`, 25, 92);
    doc.text(`Mensajes sin leer: ${contactos.filter((c) => c.leido === 0).length}`, 25, 102);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Reporte generado automáticamente por Pastelería de los Sabores', 105, 250, { align: 'center' });
    doc.save('reporte_admin.pdf');
    toast.success('PDF generado y descargado');
  };

  const downloadCSV = () => {
    const headers = ['ID', 'Cliente', 'Productos', 'Total', 'Estado', 'Fecha'];
    const rows = pedidos.map((p) => [p.id, p.cliente, p.productos, p.total, p.estado, p.fecha]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pedidos.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV descargado');
  };

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    precio: '',
    categoria: '',
    activo: true,
  });

  if (!usuario) return null;

  const statusLabels = {
    pendiente: 'Pendiente',
    preparando: 'Preparando',
    enviado: 'Enviando',
    completado: 'Completado',
  };

  const reservaStatusLabels = {
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    completada: 'Completada',
    cancelada: 'Cancelada',
    eliminada: 'Eliminada',
  };

  // ====== RENDER ======
  return (
    <div className="admin-panel">
      <ToastContainer />
      <section className="admin-header">
        <Container>
          <h1 className="admin-title">Panel de Administración</h1>
          <p className="admin-subtitle">Bienvenido, {usuario.nombre} ({usuario.rol_id === 1 ? 'Administrador' : 'Empleado'})</p>
        </Container>
      </section>

      <Container className="mt-4">
        {/* Tabs */}
        <div className="admin-tabs">
          <Button variant={activeTab === 'pedidos' ? 'danger' : 'outline-danger'} onClick={() => setActiveTab('pedidos')}>
            Pedidos ({pedidos.length})
          </Button>
          <Button variant={activeTab === 'productos' ? 'danger' : 'outline-danger'} onClick={() => setActiveTab('productos')}>
            Productos ({productos.length})
          </Button>
          <Button variant={activeTab === 'reservas' ? 'danger' : 'outline-danger'} onClick={() => setActiveTab('reservas')}>
            Reservas ({reservas.length})
          </Button>
          <Button variant={activeTab === 'contactos' ? 'danger' : 'outline-danger'} onClick={() => setActiveTab('contactos')}>
            Contactos ({contactos.length})
          </Button>
          <Button variant={activeTab === 'reportes' ? 'danger' : 'outline-danger'} onClick={() => setActiveTab('reportes')}>
            Reportes
          </Button>
          <Button variant={activeTab === 'logs' ? 'danger' : 'outline-danger'} onClick={() => { setActiveTab('logs'); fetchLogs(); }}>
            Logs ({logs.length})
          </Button>
        </div>

        {/* ====== PEDIDOS ====== */}
        {activeTab === 'pedidos' && (
          <Card className="mt-4">
            <Card.Body>
              <div className="admin-section-header">
                <h3 className="admin-section-title">Gestión de Pedidos (BD)</h3>
                <div>
                  <Button variant="danger" size="sm" onClick={fetchPedidos} className="me-1">
                    Actualizar
                  </Button>
                  <Button variant="danger" size="sm" onClick={downloadCSV}>
                    CSV
                  </Button>
                </div>
              </div>
              {loadingPedidos ? (
                <p>Cargando pedidos...</p>
              ) : pedidos.length === 0 ? (
                <p className="text-center text-muted">No hay pedidos registrados</p>
              ) : (
                <Table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Productos</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>#{pedido.id}</td>
                        <td>{pedido.cliente}</td>
                        <td>{pedido.productos}</td>
                        <td>${parseFloat(pedido.total).toFixed(2)}</td>
                        <td>
                          <span className={`status-badge status-${pedido.estado}`}>
                            {statusLabels[pedido.estado] || pedido.estado}
                          </span>
                        </td>
                        <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={pedido.estado}
                            onChange={(e) => updateOrderStatus(pedido.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="preparando">Preparando</option>
                            <option value="enviado">Enviado</option>
                            <option value="completado">Completado</option>
                          </Form.Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        )}

        {/* ====== PRODUCTOS ====== */}
        {activeTab === 'productos' && (
          <Card className="mt-4">
            <Card.Body>
              <div className="admin-section-header">
                <h3 className="admin-section-title">Gestión de Productos (BD)</h3>
                <div>
                  <Button variant="danger" size="sm" onClick={() => { resetForm(); setShowModal(true); }}>
                    Agregar Producto
                  </Button>
                  <Button variant="danger" size="sm" onClick={fetchProductos} className="ms-1">
                    Actualizar
                  </Button>
                </div>
              </div>
              {loadingProductos ? (
                <p>Cargando productos...</p>
              ) : productos.length === 0 ? (
                <p className="text-center text-muted">No hay productos registrados</p>
              ) : (
                <Table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((product) => (
                      <tr key={product.id} style={{ opacity: (product.activo === 1 || product.activo === true) ? 1 : 0.5 }}>
                        <td>#{product.id}</td>
                        <td>{product.nombre}</td>
                        <td>${parseFloat(product.precio).toFixed(2)}</td>
                        <td>{product.categoria}</td>
                        <td>
                          <span className={`status-badge ${(product.activo === 1 || product.activo === true) ? 'status-active' : 'status-inactive'}`}>
                            {(product.activo === 1 || product.activo === true) ? 'Activo' : 'Desactivado'}
                          </span>
                        </td>
                        <td>
                          <Button size="sm" variant="warning" onClick={() => handleEdit(product)} className="me-1">
                            ✏️
                          </Button>
                          <Button size="sm" variant="outline-secondary" onClick={() => toggleActivo(product.id)} title={(product.activo === 1 || product.activo === true) ? 'Desactivar' : 'Activar'}>
                            {(product.activo === 1 || product.activo === true) ? '🟡' : '🟢'}
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => deleteProduct(product.id)}>
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        )}

        {/* ====== RESERVAS ====== */}
        {activeTab === 'reservas' && (
          <Card className="mt-4">
            <Card.Body>
              <div className="admin-section-header">
                <h3 className="admin-section-title">Gestión de Reservas (BD)</h3>
                <Button variant="danger" size="sm" onClick={fetchReservas}>
                  Actualizar
                </Button>
              </div>
              {loadingReservas ? (
                <p>Cargando reservas...</p>
              ) : reservas.length === 0 ? (
                <p className="text-center text-muted">No hay reservas registradas</p>
              ) : (
                <Table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tipo de Torta</th>
                      <th>Sabor</th>
                      <th>Diseño</th>
                      <th>Fecha Entrega</th>
                      <th>Personas</th>
                      <th>Teléfono</th>
                      <th>Email</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservas.map((reserva) => (
                      <tr key={reserva.id} style={{ opacity: reserva.estado === 'eliminada' ? 0.5 : 1 }}>
                        <td>#{reserva.id}</td>
                        <td>{reserva.tipo_torta}</td>
                        <td>{reserva.sabor}</td>
                        <td>{reserva.diseño?.substring(0, 50) || 'N/A'}</td>
                        <td>{new Date(reserva.fecha_entrega).toLocaleDateString()}</td>
                        <td>{reserva.personas}</td>
                        <td>{reserva.telefono}</td>
                        <td>{reserva.email}</td>
                        <td>
                          <span className={`status-badge status-${reserva.estado}`}>
                            {reservaStatusLabels[reserva.estado] || reserva.estado}
                          </span>
                        </td>
                        <td>
                          <Form.Select
                            size="sm"
                            value={reserva.estado}
                            onChange={(e) => updateReservaEstado(reserva.id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmada">Confirmada</option>
                            <option value="completada">Completada</option>
                            <option value="cancelada">Cancelada</option>
                          </Form.Select>
                          <Button size="sm" variant="danger" onClick={() => deleteReserva(reserva.id)} className="ms-1">
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        )}

        {/* ====== CONTACTOS ====== */}
        {activeTab === 'contactos' && (
          <Card className="mt-4">
            <Card.Body>
              <div className="admin-section-header">
                <h3 className="admin-section-title">Mensaje de Contacto (BD)</h3>
                <Button variant="danger" size="sm" onClick={fetchContactos}>
                  Actualizar
                </Button>
              </div>
              {loadingContactos ? (
                <p>Cargando mensajes...</p>
              ) : contactos.length === 0 ? (
                <p className="text-center text-muted">No hay mensajes de contacto</p>
              ) : (
                <Table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Mensaje</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactos.map((contacto) => (
                      <tr key={contacto.id} style={{ opacity: contacto.leido === 1 ? 0.7 : 1 }}>
                        <td>#{contacto.id}</td>
                        <td>{contacto.nombre}</td>
                        <td>{contacto.email}</td>
                        <td title={contacto.mensaje}>{contacto.mensaje?.substring(0, 50) || 'N/A'}...</td>
                        <td>{new Date(contacto.fecha_registro).toLocaleDateString()}</td>
                        <td>
                          <Button size="sm" variant="info" onClick={() => markContactRead(contacto.id)} className="me-1">
                            {contacto.leido === 1 ? 'Leído' : 'Marcar leido'}
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => deleteContact(contacto.id)}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        )}

        {/* ====== REPORTES ====== */}
        {activeTab === 'reportes' && (
          <div className="mt-4">
            <Row>
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <h4 className="report-title">Pedidos por Día de la Semana</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ventas" fill="#C21919" name="Pedidos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Body>
                    <h4 className="report-title">Resumen General</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { name: 'Pedidos', value: pedidos.length },
                        { name: 'Productos', value: productos.length },
                        { name: 'Reservas', value: reservas.length },
                        { name: 'Contactos', value: contactos.length },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#198754" name="Cantidad" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="report-actions mt-4 text-center">
              <Button variant="danger" size="lg" onClick={generatePDFReport}>
                Descargar Reporte PDF
              </Button>
              <Button variant="outline-danger" size="lg" onClick={downloadCSV} className="ms-2">
                Descargar CSV Pedidos
              </Button>
            </div>
          </div>
        )}

        {/* ====== LOGS ====== */}
        {activeTab === 'logs' && (
          <div className="mt-4">
            <Card>
              <Card.Body>
                <div className="admin-section-header">
                  <h3 className="admin-section-title">Registro de Acceso (BD)</h3>
                  <Button variant="danger" size="sm" onClick={fetchLogs}>
                    Actualizar
                  </Button>
                </div>
                {loadingLogs ? (
                  <p>Cargando logs...</p>
                ) : logs.length === 0 ? (
                  <p className="text-center text-muted">No hay logs de acceso registrados aún. Inicia sesión para crear uno.</p>
                ) : (
                  <Table className="admin-table">
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>IP</th>
                        <th>Evento</th>
                        <th>Navegador</th>
                        <th>Fecha y Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.usuario || 'N/A'}</td>
                          <td><code>{log.ip}</code></td>
                          <td>
                            <span className={`status-badge ${log.evento === 'ingreso' ? 'status-active' : 'status-inactive'}`}>
                              {log.evento === 'ingreso' ? '🟢 Ingreso' : '🔴 Salida'}
                            </span>
                          </td>
                          <td>{log.browser || log.navegador || 'N/A'}</td>
                          <td>{new Date(log.fecha).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </div>
        )}
      </Container>

      {/* ====== MODAL PRODUCTOS ====== */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? '✏️ Editar Producto' : '➕ Agregar Producto'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productPrice">
              <Form.Label>Precio ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productCategory">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                placeholder="Pasteles, Repostería, etc."
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productActive">
              <Form.Check
                label="Producto Activo"
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
  </div>
  );
}

export default AdminPanel;
