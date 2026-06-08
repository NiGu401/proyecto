import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css.css";

const API_URL = "http://192.168.250.92:3001";

function Registro() {
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    rol_id: "2", // Por defecto Empleado
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validarPassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("La contraseña debe tener al menos una letra mayúscula");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("La contraseña debe tener al menos un número");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push("La contraseña debe tener al menos un carácter especial");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    setExito("");

    // Validar que las contraseñas coincidan
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError("❌ Las contraseñas no coinciden");
      setCargando(false);
      return;
    }

    // Validar requisitos de contraseña
    const passwordErrors = validarPassword(formData.contrasena);
    if (passwordErrors.length > 0) {
      setError("❌ " + passwordErrors.join(" | "));
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
          rol_id: parseInt(formData.rol_id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al registrar usuario");
      }

      setExito(
        "✅ Usuario registrado exitosamente. Redirigiendo al login..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error al registrar usuario");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card registro-card" onSubmit={handleSubmit}>
        <div className="logo-container">
          <span className="logo-icon">🍞</span>
        </div>
        <h1>Registro de Usuario</h1>
        <p>Crea una cuenta para acceder al sistema</p>

        {error && <div className="error-message">⚠️ {error}</div>}
        {exito && <div className="success-message">✅ {exito}</div>}

        <div className="input-group">
          <span className="input-icon">👤</span>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
            disabled={cargando}
          />
        </div>

        <div className="input-group">
          <span className="input-icon">✉️</span>
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
            disabled={cargando}
          />
        </div>

        <div className="input-group">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
            disabled={cargando}
          />
        </div>

        {/* Indicador de requisitos de contraseña */}
        <div className="password-requirements">
          <p className="req-title">Requisitos de contraseña:</p>
          <ul>
            <li
              className={
                formData.contrasena.length >= 8 ? "valid" : ""
              }
            >
              {formData.contrasena.length >= 8 ? "✅" : "❌"} Al menos 8
              caracteres
            </li>
            <li
              className={
                /[A-Z]/.test(formData.contrasena) ? "valid" : ""
              }
            >
              {/[A-Z]/.test(formData.contrasena) ? "✅" : "❌"} Al menos una
              letra mayúscula
            </li>
            <li
              className={
                /[0-9]/.test(formData.contrasena) ? "valid" : ""
              }
            >
              {/[0-9]/.test(formData.contrasena) ? "✅" : "❌"} Al menos un
              número
            </li>
            <li
              className={
                /[!@#$%^&*]/.test(formData.contrasena) ? "valid" : ""
              }
            >
              {/[!@#$%^&*]/.test(formData.contrasena) ? "✅" : "❌"} Al menos
              un carácter especial
            </li>
          </ul>
        </div>

        <div className="input-group">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            name="confirmarContrasena"
            placeholder="Confirmar contraseña"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            required
            disabled={cargando}
          />
        </div>

        <div className="input-group">
          <span className="input-icon">⚙️</span>
          <select
            name="rol_id"
            value={formData.rol_id}
            onChange={handleChange}
            disabled={cargando}
          >
            <option value="2">Empleado</option>
            <option value="1">Administrador</option>
          </select>
        </div>

        <button type="submit" disabled={cargando}>
          {cargando ? "Registrando..." : "Registrarse"}
        </button>

        <button
          type="button"
          className="btn-back"
          onClick={() => navigate("/login")}
        >
          ← Volver al Login
        </button>
      </form>
    </div>
  );
}

export default Registro;
