import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("usuario");

    if (!token) {
      navigate("/login");
      return;
    }

    setUsuario(JSON.parse(user));
  }, [navigate]);

  const logout = async () => {
    try {
      await fetch("http://localhost:3001/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });
    } catch (e) {
      console.error("Error al cerrar sesión");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (!usuario) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <h1>Bienvenido, {usuario.nombre}</h1>
      <p>Correo: {usuario.correo}</p>
      <p>Rol: {usuario.rol_id === 1 ? "Administrador" : "Empleado"}</p>

      <button onClick={logout} className="btn-logout">
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;
