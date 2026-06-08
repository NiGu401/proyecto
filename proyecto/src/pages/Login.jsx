import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css.css";

const API_URL = "http://192.168.250.92:3001";

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
          <span className="logo-icon">🍞</span>
        </div>
        <h1>Proyecto</h1>
        <p>Inicie sesión para continuar</p>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="input-group">
          <span className="input-icon">✉️</span>
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
          <span className="input-icon">🔒</span>
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
            🔄
          </button>
        </div>

        <div className="input-group">
          <span className="input-icon">🔢</span>
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
          📝 ¿No tienes cuenta? Regístrate
        </button>
      </form>
    </div>
  );
}

export default Login;
