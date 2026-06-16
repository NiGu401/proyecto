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
  const [activeTab, setActiveTab] = useState('productos');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [usuario, setUsuario] = useState(null);

  // ====== ESTADO REAL DESDE BD ======
  const [productos, setProductos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [logs, setLogs] = useState([]);

  const [loadingProductos, setLoadingProductos] = useState(true);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [loadingContactos, setLoadingContactos] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Datos para gráficos (simulados con datos reales si hay reservas)
  const getChartData = () => {
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    reservas.forEach((r) => {
      try {
        const d = new Date(r.fecha_entrega);
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
    fetchProductos();
    fetchReservas();
    fetchContactos();
    fetchLogs();
  }, [navigate]);

  // ====== FUNCIONES FETCH ======

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
    doc.text(`Productos activos: ${productos.filter((p) => p.activo === 1 || p.activo === true).length}`, 25, 72);
    doc.text(`Reservas pendientes: ${reservas.filter((r) => r.estado === 'pendiente').length}`, 25, 82);
    doc.text(`Mensajes sin leer: ${contactos.filter((c) => c.leido === 0).length}`, 25, 92);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Reporte generado automáticamente por Pastelería de los Sabores', 105, 250, { align: 'center' });
    doc.save('reporte_admin.pdf');
    toast.success('PDF generado y descargado');
  };

  const downloadReservaCSV = () => {
    const headers = ['ID', 'Tipo', 'Sabor', 'Fecha Entrega', 'Estado'];
    const rows = reservas.map((r) => [r.id, r.tipo_torta, r.sabor, new Date(r.fecha_entrega).toLocaleDateString(), r.estado]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservas.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV de reservas descargado');
  };

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    precio: '',
    categoria: 'Pasteles',
    activo: true,
  });

  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenSeleccionada(file);
    }
  };

  const handleImageUpload = async () => {
    const file = imagenSeleccionada;
    if (!file || !editingId) {
      toast.warning('Selecciona una imagen primero');
      return;
    }

    setSubiendoImagen(true);
    const formDataImg = new FormData();
    formDataImg.append('imagen', file);

    try {
      const response = await fetch(`/api/producto-imagen/${editingId}`, {
        method: 'POST',
        body: formDataImg,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al subir imagen');
      }

      toast.success('✅ Imagen actualizada correctamente');
      setImagenSeleccionada(null);
      fetchProductos();
    } catch (error) {
      toast.error('❌ Error al subir imagen: ' + error.message);
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleImageRemove = async () => {
    if (!editingId) return;

    try {
      const response = await fetch(`/api/producto-imagen/${editingId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al eliminar imagen');
      }

      toast.success('✅ Imagen eliminada correctamente');
      fetchProductos();
    } catch (error) {
      toast.error('❌ Error al eliminar imagen: ' + error.message);
    }
  };

  const getProductImage = () => {
    if (!editingId) return null;
    const product = productos.find(p => p.id === editingId);
    return product?.imagen || null;
  };

  const getProductNombre = () => {
    if (!editingId) return formData.nombre;
    const product = productos.find(p => p.id === editingId);
    return product?.nombre || '';
  };

  const getProductPrecio = () => {
    if (!editingId) return formData.precio;
    const product = productos.find(p => p.id === editingId);
    return product?.precio.toString() || '';
  };

  const getProductCategoria = () => {
    if (!editingId) return formData.categoria || 'Pasteles';
    const product = productos.find(p => p.id === editingId);
    return product?.categoria || 'Pasteles';
  };

  const getProductActivo = () => {
    if (!editingId) return formData.activo;
    const product = productos.find(p => p.id === editingId);
    return product?.activo === 1 || product?.activo === true;
  };

  if (!usuario) return null;

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
          <p className="admin-subtitle">Bienvenido, {usuario.nombre} ({usuario.rol_id === 1 ? 'Administrador' : 'Usuario'})</p>
        </Container>
      </section>

      <Container className="mt-4">
        {/* Tabs */}
        <div className="admin-tabs">
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
                      <th>Imagen</th>
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
                        <td>
                          {product.imagen ? (
                            <span style={{ fontSize: '12px', color: '#555' }}>📷 {product.imagen}</span>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#999' }}>Sin imagen</span>
                          )}
                        </td>
                        <td>#{product.id}</td>
                        <td>{product.nombre}</td>
                        <td>Bs {parseFloat(product.precio).toFixed(2)}</td>
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
          <div className="mt-4 text-center">
            <div>
              <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
                <Card.Body>
                    <h4 className="report-title">Reservas por Día de la Semana</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ventas" fill="#C21919" name="Reservas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
            </div>

            <div className="report-actions mt-4 text-center">
              <Button variant="danger" size="lg" onClick={generatePDFReport}>
                Descargar Reporte PDF
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
                value={getProductNombre()}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productPrice">
              <Form.Label>Precio (Bs)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={getProductPrecio()}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productCategory">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                value={getProductCategoria()}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              >
                <option value="Pasteles">Pasteles</option>
                <option value="Repostería">Repostería</option>
                <option value="Cafetería">Cafetería</option>
                <option value="Combos">Combos</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="productActive">
              <Form.Check
                label="Producto Activo"
                type="checkbox"
                checked={getProductActivo()}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productImage">
              <Form.Label>Imagen del Producto</Form.Label>
              <div className="mb-2">
                {getProductImage() && (
                  <div className="mb-2">
                    <img
                      src={`/uploads/productos/${getProductImage()}`}
                      alt="Imagen actual"
                      onError={() => {}}
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #ddd'
                      }}
                    />
                    <br />
                    <small className="text-muted">Archivo actual: {getProductImage()}</small>
                    <Button variant="danger" size="sm" onClick={handleImageRemove} className="ms-2" disabled={subiendoImagen}>
                      🗑️ Eliminar imagen
                    </Button>
                  </div>
                )}
                {imagenSeleccionada && (
                  <div className="mb-2">
                    <img
                      src={URL.createObjectURL(imagenSeleccionada)}
                      alt="Preview nueva imagen"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #007bff'
                      }}
                    />
                    <br />
                    <small className="text-primary">Nueva imagen: {imagenSeleccionada.name}</small>
                  </div>
                )}
                <div className="d-flex gap-2 mt-2">
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/jpeg, image/png, image/jpg, image/webp"
                    onChange={handleImageSelect}
                    style={{ display: 'none' }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => document.getElementById('fileInput').click()}
                    disabled={subiendoImagen}
                  >
                    📁 Seleccionar Imagen
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleImageUpload}
                    disabled={!imagenSeleccionada || subiendoImagen}
                  >
                    {subiendoImagen ? '⏳ Subiendo...' : '📤 Subir Imagen'}
                  </Button>
                </div>
                <Form.Text className="text-muted d-block mt-1">JPG, PNG, WEBP (max 5MB)</Form.Text>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowModal(false);
            setImagenSeleccionada(null);
          }}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminPanel;
