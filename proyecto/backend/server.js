const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const reservaContactoRoutes = require("./routes/reservaContactoRoutes");
const pagoRoutes = require("./routes/pagoRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== MIDDLEWARES ====================
app.set('trust proxy', 1);

// Middleware para extraer la IP real del cliente
function getClientIp(req) {
  // Primero intenta obtener la IP del header X-Client-IP (enviado por el frontend)
  const clientIp = req.headers['x-client-ip'];
  if (clientIp) {
    return clientIp;
  }
  // Luego intenta X-Forwarded-For (del proxy)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0];
  }
  // Si no hay nada, intenta obtenerla de la conexión directa
  return req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
}

app.use((req, res, next) => {
  req.clientIp = getClientIp(req);
  next();
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.250.92:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  next();
});

// ==================== UPLOAD DE COMPROBANTES ====================
const uploadDir = path.join(__dirname, 'comprobantes');
const db = require('./db');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const nombre = `comprobante_${timestamp}_${ext}`;
    cb(null, nombre);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WEBP)'));
    }
  }
});

// RUTA: POST /api/comprobante - Recibe el comprobante de pago
app.post('/api/comprobante', upload.single('comprobante'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se recibió ninguna imagen' });
  }
  
  const { nombre, email, telefono, items } = req.body;
  const filePath = req.file.filename;
  
  // Guardar la info del pago en la base de datos
  db.query(
    'INSERT INTO pagos (tipo_pago, monto, estado, nombre, email, telefono, detalles, ruta_comprobante) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      'transferencia',
      0,
      'pendiente',
      nombre || '',
      email || '',
      telefono || '',
      JSON.stringify({ items }),
      filePath
    ],
    (error, result) => {
      if (error) {
        console.error('Error al guardar el pago en DB:', error);
        return res.status(500).json({ mensaje: 'Error al guardar el comprobante en la base de datos' });
      }
      console.log('✅ Comprobante guardado:', filePath);
      res.json({
        mensaje: 'Comprobante guardado correctamente',
        id: result.insertId,
        ruta: `/api/ver-comprobante/${filePath}`
      });
    }
  );
});

// RUTA: GET /api/ver-comprobante/:filename - Sirve las imágenes de comprobantes
app.use('/api/ver-comprobante', express.static(uploadDir));

// ==================== RUTAS ====================</parameter></function></tool_call>](url) 
app.get("/", (req, res) => {
  res.json({
    mensaje: "✅ API de Pastelería de los Sabores funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      auth: "/captcha, /login, /registro, /logout",
      reservas: "/api/reserva (POST), /api/reservas (GET)",
      contactos: "/api/contacto (POST), /api/contactos (GET)",
      pagos: "/api/pago/crear (POST), /api/pagos (GET), /api/pago/manual (POST)",
    },
  });
});

// Rutas de autenticación (públicas)
app.use(authRoutes);

// Rutas de reservas y contacto (reservas: POST público, GET solo admin)
app.use(reservaContactoRoutes);

// Rutas de pago (públicas)
app.use(pagoRoutes);

// ==================== MANEJO DE ERRORES ====================
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  res.status(500).json({
    mensaje: "Error interno del servidor",
  });
});

// ==================== INICIO DEL SERVIDOR ====================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
