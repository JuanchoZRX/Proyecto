import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login       from "./pages/Login";
import Dashboard   from "./pages/Dashboard";
import Carreras    from "./pages/Carreras";
import Circuitos   from "./pages/Circuitos";
import Conductores from "./pages/Conductores";
import Equipos     from "./pages/Equipos";
import Autos       from "./pages/Autos";
import Usuarios    from "./pages/Usuarios";
import Resultados from "./pages/Resultados";



export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected — all authenticated users */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/carreras" element={
            <ProtectedRoute><Carreras /></ProtectedRoute>
          } />
          <Route path="/circuitos" element={
            <ProtectedRoute><Circuitos /></ProtectedRoute>
          } />
          <Route path="/conductores" element={
            <ProtectedRoute><Conductores /></ProtectedRoute>
          } />
          <Route path="/equipos" element={
            <ProtectedRoute><Equipos /></ProtectedRoute>
          } />
          <Route path="/autos" element={
            <ProtectedRoute><Autos /></ProtectedRoute>
          } />
          <Route path="/resultados" element={
            <ProtectedRoute><Resultados /></ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/usuarios" element={
            <ProtectedRoute adminOnly><Usuarios /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
