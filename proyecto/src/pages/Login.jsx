import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css.css";

const API_URL = '';

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cargarCaptcha = async () => {
    try {
      const response = await fetch(`${API_URL}/captcha`);
      const data = await response.json();
      setCaptchaId(data.captchaId);
      setCaptchaSvg(data.svg);
    } catch (error) {
      console.error("Error al cargar CAPTCHA:", error);
      setError("Error al cargar el CAPTCHA. Recargue la página.");
    }
  };

  useEffect(() => {
    cargarCaptcha();
  }, []);

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          contrasena,
          captchaId,
          captchaText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Notificar al Header que cambió el estado de login
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('login'));

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError(error.message || "Correo, contraseña o CAPTCHA incorrectos");
      cargarCaptcha();
      setCaptchaText("");
    } finally {
      setCargando(false);
    }
  };

  const refreshCaptcha = () => {
    setCaptchaText("");
    cargarCaptcha();
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={iniciarSesion}>
        <div className="logo-container">
          <img src="/Imagenes/Logo.png" alt="Logo" className="logo-icon" />
        </div>
        <p className="login-subtitle">Inicie sesión para continuar</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="input-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            disabled={cargando}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
            disabled={cargando}
          />
        </div>

        {/* CAPTCHA */}
        <div className="captcha-container">
          <div
            className="captcha-svg"
            dangerouslySetInnerHTML={{ __html: captchaSvg }}
          />
          <button
            type="button"
            className="captcha-refresh"
            onClick={refreshCaptcha}
            disabled={cargando}
            title="Actualizar captcha"
          >
            Actualizar
          </button>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Ingrese el código de la imagen"
            value={captchaText}
            onChange={(e) => setCaptchaText(e.target.value)}
            required
            disabled={cargando}
          />
        </div>

        <button type="submit" disabled={cargando}>
          {cargando ? "Verificando..." : "Ingresar"}
        </button>

        <button
          type="button"
          className="btn-back"
          onClick={() => navigate("/registro")}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </form>
    </div>
  );
}

export default Login;
