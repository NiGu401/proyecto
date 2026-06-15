const express = require("express");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const router = express.Router();

// ==================== UPLOAD DE IMÁGENES DE PRODUCTOS ====================
const imagenesDir = path.join(__dirname, '..', 'uploads', 'productos');

const storageImagenes = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(imagenesDir)) {
      fs.mkdirSync(imagenesDir, { recursive: true });
    }
    cb(null, imagenesDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `producto_${timestamp}${ext}`);
  }
});

const uploadImagen = multer({
  storage: storageImagenes,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Solo se permiten imágenes (JPEG, PNG, WEBP, JPG)'));
  }
}).single('imagen');

// ============================================================
// RESERVAS (Agenda y Eventos)
// ============================================================

/**
 * @route POST /api/reserva
 * @description Crear una nueva reserva de tarta personalizada
 */
router.post("/api/reserva", (req, res) => {
  const {
    tipoTorta,
    sabor,
    diseño,
    fechaEntrega,
    personas,
    telefono,
    email,
    mensaje,
  } = req.body;

  const sql = `
    INSERT INTO reservas (
      tipo_torta, sabor, diseño, fecha_entrega, personas,
      telefono, email, mensaje, estado, fecha_registro
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      tipoTorta,
      sabor,
      diseño,
      fechaEntrega,
      parseInt(personas),
      telefono,
      email,
      mensaje || "",
      "pendiente",
      new Date().toISOString().split("T")[0],
    ],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          mensaje: "❌ Error al registrar la reserva",
          error: error.message,
        });
      }
      res.json({
        mensaje: "✅ Reserva registrada exitosamente",
        id: result.insertId,
      });
    }
  );
});

/**
 * @route GET /api/reservas
 * @description Obtener todas las reservas
 */
router.get("/api/reservas", (req, res) => {
  const sql = `SELECT * FROM reservas ORDER BY fecha_registro DESC`;

  db.query(sql, [], (error, resultado) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener las reservas",
      });
    }
    res.json({ reservas: resultado });
  });
});

/**
 * @route PUT /api/reserva/:id
 * @description Actualizar el estado de una reserva
 */
router.put("/api/reserva/:id", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!["pendiente", "confirmada", "completada", "cancelada"].includes(estado)) {
    return res.status(400).json({
      mensaje: "Estado no válido. Usa: pendiente, confirmada, completada, cancelada",
    });
  }

  const sql = `UPDATE reservas SET estado = ? WHERE id = ?`;

  db.query(sql, [estado, id], (error) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al actualizar la reserva",
        error: error.message,
      });
    }
    res.json({ mensaje: "✅ Estado de reserva actualizado" });
  });
});

/**
 * @route DELETE /api/reserva/:id
 * @description Eliminar reserva (eliminación lógica)
 */
router.delete("/api/reserva/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM reservas WHERE id = ?`;

  db.query(sql, [id], (error) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al eliminar la reserva",
        error: error.message,
      });
    }
    res.json({ mensaje: "✅ Reserva eliminada" });
  });
});

// ============================================================
// CONTACTOS (Dudas y mensajes de contacto)
// ============================================================

/**
 * @route POST /api/contacto
 * @description Enviar un mensaje de contacto
 */
router.post("/api/contacto", (req, res) => {
  const { nombre, email, mensaje } = req.body;

  const sql = `
    INSERT INTO mensajes_contacto (nombre, email, mensaje, fecha_registro)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nombre, email, mensaje || "", new Date().toISOString().split("T")[0]],
    (error, result) => {
      if (error) {
        return res.status(500).json({
          mensaje: "❌ Error al enviar el mensaje",
          error: error.message,
        });
      }
      res.json({
        mensaje: "✅ Mensaje enviado exitosamente",
        id: result.insertId,
      });
    }
  );
});

/**
 * @route GET /api/contactos
 * @description Obtener todos los mensajes de contacto
 */
router.get("/api/contactos", (req, res) => {
  const sql = `SELECT * FROM mensajes_contacto WHERE leido != -1 ORDER BY fecha_registro DESC`;

  db.query(sql, [], (error, resultado) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al obtener los mensajes",
      });
    }
    res.json({ contactos: resultado });
  });
});

/**
 * @route PUT /api/contacto/:id
 * @description Marcar mensaje como leído
 */
router.put("/api/contacto/:id", (req, res) => {
  const { id } = req.params;

  const sql = `UPDATE mensajes_contacto SET leido = 1 WHERE id = ?`;

  db.query(sql, [id], (error) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al actualizar el mensaje",
        error: error.message,
      });
    }
    res.json({ mensaje: "✅ Mensaje marcado como leído" });
  });
});

/**
 * @route DELETE /api/contacto/:id
 * @description Eliminar mensaje (eliminación lógica)
 */
router.delete("/api/contacto/:id", (req, res) => {
  const { id } = req.params;

  const sql = `UPDATE mensajes_contacto SET leido = -1 WHERE id = ?`;

  db.query(sql, [id], (error) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error al eliminar el mensaje",
        error: error.message,
      });
    }
    res.json({ mensaje: "✅ Mensaje eliminado (eliminación lógica)" });
  });
});

// ============================================================
// PRODUCTOS (CRUD completo con imágenes)
// ============================================================

router.get("/api/productos", (req, res) => {
  const sql = `SELECT id, nombre, precio, categoria, activo, imagen, fecha_creacion FROM productos ORDER BY nombre`;
  db.query(sql, [], (error, resultado) => {
    if (error) return res.status(500).json({ mensaje: "Error al obtener los productos" });
    res.json({ productos: resultado });
  });
});

// Ruta para subir imagen de un producto (POST: /api/producto-imagen/:id)
router.post("/api/producto-imagen/:id", (req, res) => {
  uploadImagen(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ mensaje: "❌ " + err.message });
    }

    if (!req.file) {
      return res.status(400).json({ mensaje: "❌ No se recibió ninguna imagen" });
    }

    const { id } = req.params;
    const imagenPath = req.file.filename;

    try {
      // Eliminar imagen anterior si existe
      db.query("SELECT imagen FROM productos WHERE id = ?", [id], (errSelect, rows) => {
        if (errSelect) {
          return res.status(500).json({ mensaje: "Error al verificar imagen anterior" });
        }
        if (rows[0] && rows[0].imagen) {
          const oldImg = path.join(imagenesDir, rows[0].imagen);
          fs.unlink(oldImg, (unlinkErr) => {
            if (unlinkErr) console.log("No se pudo eliminar imagen anterior:", unlinkErr.message);
          });
        }
      });

      // Actualizar la imagen en la DB
      db.query("UPDATE productos SET imagen = ? WHERE id = ?", [imagenPath, id], (error) => {
        if (error) {
          console.error("Error al guardar imagen en DB:", error);
          return res.status(500).json({ mensaje: "Error al actualizar la imagen", error: error.message });
        }
        res.json({ mensaje: "✅ Imagen actualizada", ruta: `/uploads/productos/${imagenPath}` });
      });
    } catch (e) {
      res.status(500).json({ mensaje: "Error al actualizar imagen", error: e.message });
    }
  });
});

router.post("/api/producto", (req, res) => {
  const { nombre, precio, categoria, activo, imagen } = req.body;
  const sql = `INSERT INTO productos (nombre, precio, categoria, activo, imagen) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [nombre, parseFloat(precio), categoria || "General", activo ? 1 : 0, imagen || null],
    (error, result) => {
      if (error) return res.status(500).json({ mensaje: "❌ Error al registrar el producto", error: error.message });
      res.json({ mensaje: "✅ Producto registrado exitosamente", id: result.insertId });
    }
  );
});

router.put("/api/producto/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria, activo, imagen } = req.body;
  const sql = `UPDATE productos SET nombre=?, precio=?, categoria=?, activo=?, imagen=? WHERE id=?`;
  db.query(
    sql,
    [nombre, parseFloat(precio), categoria || "General", activo ? 1 : 0, imagen || null, id],
    (error) => {
      if (error) return res.status(500).json({ mensaje: "Error al actualizar el producto", error: error.message });
      res.json({ mensaje: "✅ Producto actualizado" });
    }
  );
});

router.delete("/api/producto/:id", (req, res) => {
  const { id } = req.params;
  // Obtener la imagen antes de borrar
  db.query("SELECT imagen FROM productos WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ mensaje: "Error al eliminar el producto", error: err.message });

    // Eliminar archivo de imagen si existe
    if (rows[0] && rows[0].imagen) {
      const imgPath = path.join(imagenesDir, rows[0].imagen);
      fs.unlink(imgPath, (unlinkErr) => {
        if (unlinkErr) console.log("No se pudo eliminar imagen:", unlinkErr.message);
      });
    }

    db.query("DELETE FROM productos WHERE id = ?", [id], (error) => {
      if (error) return res.status(500).json({ mensaje: "Error al eliminar el producto", error: error.message });
      res.json({ mensaje: "✅ Producto eliminado" });
    });
  });
});

// ============================================================
// LOGS DE ACCESO
// ============================================================

router.get("/api/logs", (req, res) => {
  const sql = `SELECT * FROM logs_acceso ORDER BY fecha DESC`;
  db.query(sql, [], (error, resultado) => {
    if (error) return res.status(500).json({ mensaje: "Error al obtener los logs", error: error.message });
    res.json({ logs: resultado });
  });
});

module.exports = router;
