import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--text-muted)" }}>
        Cargando...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin()) {
    alert("Rol inválido - Solo válido para administradores");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
