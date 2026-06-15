const mysql = require("mysql2");
require("dotenv").config();

const conexion = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "test",
  password: process.env.DB_PASSWORD || "test123",
  database: process.env.DB_NAME || "reposteria",
});

conexion.connect((err) => {
  if (err) {
    console.error("❌ Error en la conexión a MySQL:", err.message);
    return;
  }
  console.log("✅ MySQL conectado exitosamente");

  // Crear tabla de roles si no existe
  conexion.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(50) NOT NULL,
      descripcion TEXT
    )
  `, (err) => {
    if (err) console.error("Error creando roles:", err.message);
  });

  // Crear tablas si no existen
  conexion.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      correo VARCHAR(100) UNIQUE NOT NULL,
      contrasena TEXT NOT NULL,
      rol_id INT DEFAULT 2,
      estado INT DEFAULT 1,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("Error creando usuarios:", err.message);
  });

  conexion.query(`
    CREATE TABLE IF NOT EXISTS reservas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tipo_torta VARCHAR(100) NOT NULL,
      sabor VARCHAR(100) NOT NULL,
      diseño TEXT NOT NULL,
      fecha_entrega DATE NOT NULL,
      personas INT NOT NULL,
      telefono VARCHAR(20) NOT NULL,
      email VARCHAR(100) NOT NULL,
      mensaje TEXT,
      estado VARCHAR(20) DEFAULT 'pendiente',
      fecha_registro DATE
    )
  `, (err) => {
    if (err) console.error("Error creando reservas:", err.message);
  });

  conexion.query(`
    CREATE TABLE IF NOT EXISTS mensajes_contacto (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      mensaje TEXT NOT NULL,
      leido INT DEFAULT 0,
      fecha_registro DATE
    )
  `, (err) => {
    if (err) console.error("Error creando mensajes_contacto:", err.message);
  });

  conexion.query(`
    CREATE TABLE IF NOT EXISTS logs_acceso (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario VARCHAR(100) NOT NULL,
      ip VARCHAR(45) NOT NULL,
      evento VARCHAR(20) NOT NULL,
      navegador VARCHAR(100),
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("Error creando logs_acceso:", err.message);
  });

  conexion.query(`
    CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      precio DECIMAL(10,2) NOT NULL,
      categoria VARCHAR(50) DEFAULT 'General',
      activo INT DEFAULT 1,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      imagen VARCHAR(255)
    )
  `, (err) => {
    if (err) console.error("Error creando productos:", err.message);
  });

  // Tabla de pagos
  conexion.query(`
    CREATE TABLE IF NOT EXISTS pagos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tipo_pago VARCHAR(20) NOT NULL DEFAULT 'mercado_pago',
      monto DECIMAL(10,2) NOT NULL,
      estado VARCHAR(20) DEFAULT 'pendiente',
      id_presupuesto INT,
      nombre VARCHAR(100),
      email VARCHAR(100),
      telefono VARCHAR(20),
      detalles TEXT,
      respuesta_mercado_pago JSON,
      ruta_comprobante VARCHAR(255),
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error("Error creando pagos:", err.message);
  });
});

module.exports = conexion;
