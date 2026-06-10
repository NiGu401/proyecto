import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requireAdmin = false }) {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("usuario");

    if (!token) {
      setAuthChecked(true);
      setIsAuthorized(false);
      return;
    }

    try {
      const userData = JSON.parse(user);
      const hasAdmin = userData.rol_id === 1;

      if (requireAdmin) {
        if (hasAdmin) {
          setIsAuthorized(true);
        } else {
          // No es admin, redirigir al menu
          setAuthChecked(true);
          setIsAuthorized(false);
          window.location.href = "/menu";
        }
      } else {
        setIsAuthorized(true);
      }
    } catch {
      setAuthChecked(true);
      setIsAuthorized(false);
    }
    setAuthChecked(true);
  }, [requireAdmin]);

  if (!authChecked) {
    return null; // Loading state
  }

  if (!isAuthorized) {
    return <Navigate to="/menu" />;
  }

  return children;
}

export default ProtectedRoute;
