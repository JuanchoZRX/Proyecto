import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { authApi } from "../api/api";

const EMPTY = { username: "", password: "", role: "USER" };

export default function Usuarios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // Note: there's no GET /usuarios endpoint yet — only register.
  // We show a note and the register form.

  const closeModal = () => { setModal(false); setError(""); setForm(EMPTY); };
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await authApi.register(form);
      setSuccess(`Usuario "${form.username}" creado con rol ${form.role}.`);
      closeModal();
    } catch (err) {
      setError(err.message || "Error al crear usuario.");
    } finally { setSaving(false); }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"> Usuarios</h1>
          <p className="page-subtitle">Gestión de accesos al sistema</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>+ Nuevo Usuario</button>
      </div>

      {success && (
        <div style={{
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.3)",
          color: "var(--success)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 14px",
          marginBottom: 20,
          fontSize: "0.875rem"
        }}>
          ✓ {success}
        </div>
      )}

      <div className="card" style={{ maxWidth: 600 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
          Desde esta sección podés registrar nuevos usuarios en el sistema.<br />
          <br />
          <strong style={{ color: "var(--text-primary)" }}>Roles disponibles:</strong>
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <div style={{ flex: 1, background: "var(--bg-hover)", borderRadius: "var(--radius-sm)", padding: "14px 16px" }}>
            <span className="badge badge-admin" style={{ marginBottom: 8, display: "inline-block" }}>ADMIN</span>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Acceso completo: lectura y escritura en todas las entidades.</p>
          </div>
          <div style={{ flex: 1, background: "var(--bg-hover)", borderRadius: "var(--radius-sm)", padding: "14px 16px" }}>
            <span className="badge badge-user" style={{ marginBottom: 8, display: "inline-block" }}>USER</span>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Solo lectura. No puede modificar datos del sistema.</p>
          </div>
        </div>
      </div>

      {modal && (
        <Modal title="Nuevo Usuario" onClose={closeModal}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label>Username</label>
              <input name="username" value={form.username} onChange={handleChange} required placeholder="nombre_usuario" />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" minLength={6} />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="USER">USER — Solo lectura</option>
                <option value="ADMIN">ADMIN — Acceso completo</option>
              </select>
            </div>
            {error && <p className="error-msg">{error}</p>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Creando..." : "Crear Usuario"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
