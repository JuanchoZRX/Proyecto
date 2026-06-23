import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { circuitosApi } from "../api/api";

const EMPTY = { nombre: "", pais: "", longitud: "" };

export default function Circuitos() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { setItems(await circuitosApi.getAll()); }
    catch { setError("Error al cargar circuitos."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setSelected(null); setModal("create"); };
  const openEdit = (c) => { setForm({ nombre: c.nombre, pais: c.pais, longitud: c.longitud }); setSelected(c); setModal("edit"); };
  const closeModal = () => { setModal(null); setError(""); };
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, longitud: parseFloat(form.longitud) };
      if (modal === "create") await circuitosApi.create(payload);
      else await circuitosApi.update(selected.id, payload);
      closeModal();
      await load();
    } catch (err) {
      setError(err.message || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este circuito?")) return;
    try { await circuitosApi.delete(id); await load(); }
    catch (err) { alert(err.message || "Error al eliminar."); }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">🗺️ Circuitos</h1>
          <p className="page-subtitle">{items.length} circuito{items.length !== 1 ? "s" : ""} registrado{items.length !== 1 ? "s" : ""}</p>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Circuito</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Cargando...</p>
      ) : items.length === 0 ? (
        <div className="empty-state">Sin circuitos registrados.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>País</th>
                <th>Longitud (km)</th>
                {isAdmin() && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: "var(--text-muted)" }}>#{c.id}</td>
                  <td><strong>{c.nombre}</strong></td>
                  <td>{c.pais}</td>
                  <td>{c.longitud} km</td>
                  {isAdmin() && (
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Eliminar</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === "create" ? "Nuevo Circuito" : "Editar Circuito"} onClose={closeModal}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Circuit de Monaco" />
            </div>
            <div className="form-group">
              <label>País</label>
              <input name="pais" value={form.pais} onChange={handleChange} required placeholder="Mónaco" />
            </div>
            <div className="form-group">
              <label>Longitud (km)</label>
              <input name="longitud" type="number" step="0.001" min="0.1" value={form.longitud} onChange={handleChange} required placeholder="3.337" />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
}
