const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
const db = require("../db");
const { verificarToken } = require("../middleware/authMiddleware");

require("dotenv").config();
const router = express.Router();
const SECRET = process.env.JWT_SECRET;

const captchaStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of captchaStore.entries()) {
    if (now - value.timestamp > 300000) {
      captchaStore.delete(key);
    }
  }
}, 300000);

/**
 * @route GET /captcha
 * @description Genera un nuevo CAPTCHA
 */
router.get("/captcha", (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6,
    ignoreChars: "0o1i",
    noise: 2,
    color: true,
    background: "#f8f9fa",
    width: 150,
    height: 50,
  });

  const captchaId = Math.random().toString(36).substring(2, 15);

  captchaStore.set(captchaId, {
    text: captcha.text.toLowerCase(),
    timestamp: Date.now(),
  });

  res.json({
    captchaId: captchaId,
    svg: captcha.data,
  });
});

function verificarCaptcha(captchaId, userInput) {
  const stored = captchaStore.get(captchaId);
  if (!stored) return false;

  const isValid = stored.text === userInput.toLowerCase();
  captchaStore.delete(captchaId);
  return isValid;
}

/**
 * @route POST /login
 * @description Inicia sesión verificando CAPTCHA
 */
router.post("/login", (req, res) => {
  const { correo, contrasena, captchaId, captchaText } = req.body;

  if (!captchaId || !captchaText) {
    return res.status(400).json({
      mensaje: "❌ CAPTCHA requerido",
    });
  }

  const captchaValido = verificarCaptcha(captchaId, captchaText);
  if (!captchaValido) {
    return res.status(400).json({
      mensaje: "❌ CAPTCHA incorrecto. Intente nuevamente.",
    });
  }

  const sql = `SELECT * FROM usuarios WHERE correo = ? AND estado = 1`;

  db.query(sql, [correo], async (error, resultado) => {
    if (error) {
      return res.status(500).json({
        mensaje: "Error del servidor",
      });
    }

    if (resultado.length === 0) {
      return res.status(401).json({
        mensaje: "❌ Usuario no encontrado o cuenta inactiva",
      });
    }

    const usuario = resultado[0];
    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!coincide) {
      return res.status(401).json({
        mensaje: "❌ Contraseña incorrecta",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        rol_id: usuario.rol_id,
        correo: usuario.correo,
      },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol_id: usuario.rol_id,
      },
    });
  });
});

/**
 * @route POST /registro
 * @description Registra un nuevo usuario
 */
router.post("/registro", async (req, res) => {
  const { nombre, correo, contrasena, rol_id } = req.body;

  try {
    const passwordHash = await bcrypt.hash(contrasena, 10);

    const sql = `
      INSERT INTO usuarios (nombre, correo, contrasena, rol_id)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [nombre, correo, passwordHash, rol_id],
      (error, result) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              mensaje: "❌ El correo ya está registrado",
            });
          }
          return res.status(500).json({
            mensaje: "Error al registrar usuario",
          });
        }
        res.json({
          mensaje: "✅ Usuario registrado exitosamente",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      mensaje: "Error del servidor",
    });
  }
});

/**
 * @route POST /logout
 * @description Cierra la sesión
 */
router.post("/logout", verificarToken, (req, res) => {
  res.json({
    mensaje: "✅ Sesión cerrada correctamente",
  });
});

module.exports = router;
