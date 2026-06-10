import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css.css';

function BlogRecetas() {
  const [activeTab, setActiveTab] = useState('blog');
  const [comments, setComments] = useState([
    { id: 1, name: 'María García', text: '¡Qué buena receta! La hice este fin de semana y quedó increíble.', date: '2024-11-15' },
    { id: 2, name: 'Carlos López', text: '¿Puedo usar chocolate oscuro en lugar del chocolate con leche?', date: '2024-11-10' },
  ]);
  const [newComment, setNewComment] = useState({ name: '', text: '' });
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: '5 Tips para Conservar tus Pasteles Frescos',
      excerpt: 'Aprende cómo mantener tus pasteles frescos y deliciosos por más tiempo con estos consejos de nuestros expertos.',
      image: '/Imagenes/Comida Rapida.jpg',
      date: '2024-11-20',
      category: 'Tips',
      content: `
        <p>1. <strong>Refrigera correctamente:</strong> Guarda tu pastel en el refrigerador a una temperatura entre 2-4°C.</p>
        <p>2. <strong>Evita la humedad:</strong> Usa envoltorios de plástico y coloca un plato húmedo cerca del pastel para mantener la humedad.</p>
        <p>3. <strong>Congeler para largos plazos:</strong> Si no lo vas a consumir pronto, congela porciones individuales.</p>
        <p>4. <strong>Evita la luz directa:</strong> La luz puede afectar la calidad y el sabor del pastel.</p>
        <p>5. <strong>Revisa regularmente:</strong> Inspecciona tu pastel semanalmente para detectar cualquier signo de deterioro.</p>
      `,
    },
    {
      id: 2,
      title: 'Receta: Café de Grano Perfecto',
      excerpt: 'Descubre cómo preparar el café perfecto con granos selectos. Desde la molienda hasta la extracción.',
      image: '/Imagenes/Bebidas.png',
      date: '2024-11-18',
      category: 'Recetas',
      content: `
        <p><strong>Ingredientes:</strong></p>
        <ul>
          <li>2 cucharadas de café de grano molido</li>
          <li>250ml de agua filtrada</li>
          <li>1/4 cucharadita de azúcar (opcional)</li>
        </ul>
        <p><strong>Preparación:</strong></p>
        <p>1. Muele el café justo antes de prepararlo. Un molido medio es ideal.</p>
        <p>2. Hierve el agua y deja reposar 30 segundos.</p>
        <p>3. Vierte sobre el café y deja reposar 4 minutos.</p>
        <p>4. Sirve y disfruta.</p>
      `,
    },
    {
      id: 3,
      title: 'Historia Detrás de Nuestro Matcha Latte',
      excerpt: 'Conoce el origen de nuestro matcha premium y cómo lo seleccionamos para ofrecerte la mejor experiencia.',
      image: '/Imagenes/verduras.jpg',
      date: '2024-11-15',
      category: 'Historias',
      content: `
        <p>Nuestro matcha proviene de granjas orgánicas en Uji, Japón. Cada hoja es seleccionada a mano y procesada en un laboratorio certificado.</p>
        <p>El proceso incluye:</p>
        <ul>
          <li>Cosecha en primavera (el momento óptimo de las hojas)</li>
          <li>Secado en sombra para preservar los nutrientes</li>
          <li>Molienda en piedra para obtener un polvo ultra fino</li>
          <li>Test de calidad en cada lote</li>
        </ul>
        <p>El resultado: un matcha vibrante, suave y lleno de antioxidantes.</p>
      `,
    },
  ];

  const addComment = (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.text) {
      toast.error('Nombre y mensaje son requeridos');
      return;
    }
    setComments([...comments, { id: Date.now(), ...newComment, date: new Date().toISOString().split('T')[0] }]);
    setNewComment({ name: '', text: '' });
    toast.success('Comentario agregado');
  };

  const startEdit = (comment) => {
    setEditing(comment.id);
    setEditText(comment.text);
  };

  const saveEdit = () => {
    setComments(comments.map((c) => (c.id === editing ? { ...c, text: editText } : c)));
    setEditing(null);
    setEditText('');
    toast.success('Comentario actualizado');
  };

  const deleteComment = (id) => {
    setComments(comments.filter((c) => c.id !== id));
    toast.info('Comentario eliminado');
  };

  return (
    <div className="blog-container">
      <ToastContainer />
      <section className="blog-header">
        <div className="blog-hero-overlay">
          <h1 className="blog-title">Blog & Recetas</h1>
          <p className="blog-subtitle">Tips, recetas y historias detrás de los sabores</p>
        </div>
      </section>

      <Container className="mt-5">
        {/* Tabs */}
        <div className="blog-tabs">
          <Button
            variant={activeTab === 'blog' ? 'danger' : 'outline-danger'}
            onClick={() => setActiveTab('blog')}
          >
            Artículos
          </Button>
          <Button
            variant={activeTab === 'comentarios' ? 'danger' : 'outline-danger'}
            onClick={() => setActiveTab('comentarios')}
          >
            Comentarios ({comments.length})
          </Button>
        </div>

        {/* Artículos */}
        {activeTab === 'blog' && (
          <Row className="blog-posts mt-4">
            {blogPosts.map((post) => (
              <Col key={post.id} md={4} className="mb-4">
                <Card className="blog-card h-100">
                  <Card.Img variant="top" className="blog-img" src={post.image} />
                  <Card.Body>
                    <span className="blog-category">{post.category}</span>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.excerpt}</Card.Text>
                    <div className="blog-footer">
                      <span className="blog-date">{new Date(post.date).toLocaleDateString()}</span>
                      <Button size="sm" variant="link">Leer más →</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Comentarios */}
        {activeTab === 'comentarios' && (
          <div className="comments-section mt-4">
            {/* Formulario para agregar comentario */}
            <Form className="add-comment-form" onSubmit={addComment}>
              <h3>Agregar Comentario</h3>
              <Row>
                <Form.Group className="mb-3" controlId="commentName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={newComment.name}
                    onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3" controlId="commentText">
                <Form.Label>Tu Comentario</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="danger" type="submit">
            Enviar Comentario
            </Button>
            </Form>

            {/* Lista de comentarios */}
            <div className="comments-list">
              {comments.map((comment) => (
                <Card key={comment.id} className="comment-card mb-3">
                  <Card.Body>
                    <div className="comment-header">
                      <h5>{comment.name}</h5>
                      <span className="comment-date">{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    {editing === comment.id ? (
                      <>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="comment-actions">
                          <Button size="sm" variant="success" onClick={saveEdit}>Guardar</Button>
                          <Button size="sm" variant="secondary" onClick={() => setEditing(null)}>Cancelar</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="comment-text">{comment.text}</p>
                        <div className="comment-actions">
                          <Button size="sm" variant="link" onClick={() => startEdit(comment)}>Editar</Button>
                          <Button size="sm" variant="link" onClick={() => deleteComment(comment.id)}>Eliminar</Button>
                        </div>
                      </>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default BlogRecetas;
