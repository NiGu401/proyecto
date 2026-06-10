-- ============================================================
-- BASE DE DATOS: reposteria
-- ============================================================

CREATE DATABASE IF NOT EXISTS reposteria
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE reposteria;

-- ============================================================
-- TABLAS
-- ============================================================

-- -------------------------------------------------------
-- Roles
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL,
    descripcion TEXT         NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_roles_nombre (nombre)
) ENGINE = InnoDB;

-- -------------------------------------------------------
-- Usuarios
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    correo         VARCHAR(100) NOT NULL,
    contrasena     TEXT         NOT NULL,
    rol_id         INT          NOT NULL DEFAULT 2,
    estado         TINYINT      NOT NULL DEFAULT 1,
    fecha_creacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uk_usuarios_correo (correo),
    CONSTRAINT fk_usuarios_roles
        FOREIGN KEY (rol_id) REFERENCES roles(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_usuarios_correo (correo),
    INDEX idx_usuarios_rol (rol_id)
) ENGINE = InnoDB;

-- -------------------------------------------------------
-- Reservas
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservas (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    tipo_torta     VARCHAR(100) NOT NULL,
    sabor          VARCHAR(100) NOT NULL,
    diseño         TEXT         NOT NULL,
    fecha_entrega  DATE         NOT NULL,
    personas       INT          NOT NULL,
    telefono       VARCHAR(20)  NOT NULL,
    email          VARCHAR(100) NOT NULL,
    mensaje        TEXT         NULL,
    estado         VARCHAR(20)  NOT NULL DEFAULT 'pendiente',
    fecha_registro DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT ck_reservas_estado CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),

    INDEX idx_reservas_estado (estado),
    INDEX idx_reservas_fecha_entrega (fecha_entrega),
    INDEX idx_reservas_email (email)
) ENGINE = InnoDB;

-- -------------------------------------------------------
-- Mensajes de contacto
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    email          VARCHAR(100) NOT NULL,
    mensaje        TEXT         NOT NULL,
    leido          TINYINT      NOT NULL DEFAULT 0,
    fecha_registro DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_contactos_leido (leido),
    INDEX idx_contactos_email (email)
) ENGINE = InnoDB;

-- -------------------------------------------------------
-- Logs de acceso
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS logs_acceso (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    usuario        VARCHAR(100) NOT NULL,
    ip             VARCHAR(45)  NOT NULL,
    evento         VARCHAR(20)  NOT NULL,
    navegador      VARCHAR(100) NULL,
    fecha          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_logs_usuario (usuario),
    INDEX idx_logs_evento (evento),
    INDEX idx_logs_fecha (fecha)
) ENGINE = InnoDB;

-- -------------------------------------------------------
-- Productos
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    precio         DECIMAL(10,2) NOT NULL,
    categoria      VARCHAR(50)  NOT NULL DEFAULT 'General',
    activo         TINYINT      NOT NULL DEFAULT 1,
    fecha_creacion DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT ck_productos_activo CHECK (activo IN (0, 1)),

    INDEX idx_productos_categoria (categoria),
    INDEX idx_productos_activo (activo),
    INDEX idx_productos_nombre (nombre)
) ENGINE = InnoDB;

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Roles por defecto
INSERT INTO roles (nombre, descripcion) VALUES
    ('Administrador', 'Acceso completo al sistema'),
    ('Usuario', 'Usuario estándar');

-- Asegurarse de que los IDs de rol sean correctos
SET @admin_id = (SELECT id FROM roles WHERE nombre = 'Administrador');
SET @user_id  = (SELECT id FROM roles WHERE nombre = 'Usuario');
