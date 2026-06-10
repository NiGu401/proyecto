const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const reservaContactoRoutes = require("./routes/reservaContactoRoutes");

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

// ==================== RUTAS ===================="}]</parameter></function></tool_call>](url) 
app.get("/", (req, res) => {
  res.json({
    mensaje: "✅ API de Pastelería de los Sabores funcionando correctamente",
    version: "1.0.0",
    endpoints: {
      auth: "/captcha, /login, /registro, /logout",
      reservas: "/api/reserva (POST), /api/reservas (GET)",
      contactos: "/api/contacto (POST), /api/contactos (GET)",
    },
  });
});

// Rutas de autenticación (públicas)
app.use(authRoutes);

// Rutas de reservas y contacto (reservas: POST público, GET solo admin)
app.use(reservaContactoRoutes);

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
