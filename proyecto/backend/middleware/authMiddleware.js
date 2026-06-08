const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      mensaje: "🔐 Token requerido - Por favor inicie sesión",
    });
  }

  try {
    const datos = jwt.verify(token, SECRET);
    req.usuario = datos;
    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "❌ Token inválido o expirado",
    });
  }
}

function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "No autenticado",
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol_id)) {
      return res.status(403).json({
        mensaje: "⛔ Acceso denegado - No tienes permisos para esta acción",
      });
    }

    next();
  };
}

module.exports = {
  verificarToken,
  verificarRol,
};
