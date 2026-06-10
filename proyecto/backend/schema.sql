-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS reposteria;
USE reposteria;

-- Eliminar tablas existentes para empezar limpio
DROP TABLE IF EXISTS logs_acceso;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS mensajes_contacto;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    rol_id INT DEFAULT 2,
    estado INT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(100) NOT NULL,
    productos TEXT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha DATE
);

-- Tabla de reservas
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
);

-- Tabla de mensajes de contacto
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    leido INT DEFAULT 0,
    fecha_registro DATE
);

-- Tabla de logs de acceso
CREATE TABLE IF NOT EXISTS logs_acceso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL,
    ip VARCHAR(45) NOT NULL,
    evento VARCHAR(20) NOT NULL,
    navegador VARCHAR(100),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50) DEFAULT 'General',
    activo INT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
