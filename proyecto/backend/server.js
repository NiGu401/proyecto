const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const reservaContactoRoutes = require("./routes/reservaContactoRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== MIDDLEWARES ====================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.250.92:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// ==================== RUTAS ====================
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
