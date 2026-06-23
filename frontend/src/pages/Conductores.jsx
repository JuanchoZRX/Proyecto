import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { conductoresApi, equiposApi } from "../api/api";

const EMPTY = { nombre: "", equipoId: "" };

export default function Conductores() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [c, e] = await Promise.all([conductoresApi.getAll(), equiposApi.getAll()]);
      setItems(Array.isArray(c) ? c : [...c]);
      setEquipos(Array.isArray(e) ? e : [...e]);
    } catch { setError("Error al cargar conductores."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setSelected(null); setModal("create"); };
  const openEdit = (c) => { setForm({ nombre: c.nombre, equipoId: c.equipoId }); setSelected(c); setModal("edit"); };
  const closeModal = () => { setModal(null); setError(""); };
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, equipoId: Number(form.equipoId) };
      if (modal === "create") await conductoresApi.create(payload);
      else await conductoresApi.update(selected.id, payload);
      closeModal();
      await load();
    } catch (err) {
      setError(err.message || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este conductor?")) return;
    try { await conductoresApi.delete(id); await load(); }
    catch (err) { alert(err.message || "Error al eliminar."); }
  };

  const equipoNombre = (id) => equipos.find((e) => e.id === id)?.nombre || `#${id}`;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"> Conductores</h1>
          <p className="page-subtitle">{items.length} conductor{items.length !== 1 ? "es" : ""} registrado{items.length !== 1 ? "s" : ""}</p>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Conductor</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Cargando...</p>
      ) : items.length === 0 ? (
        <div className="empty-state">Sin conductores registrados.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Equipo</th>
                {isAdmin() && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: "var(--text-muted)" }}>#{c.id}</td>
                  <td><strong>{c.nombre}</strong></td>
                  <td>{equipoNombre(c.equipoId)}</td>
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
        <Modal title={modal === "create" ? "Nuevo Conductor" : "Editar Conductor"} onClose={closeModal}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Max Verstappen" />
            </div>
            <div className="form-group">
              <label>Equipo</label>
              <select name="equipoId" value={form.equipoId} onChange={handleChange} required>
                <option value="">— Seleccionar —</option>
                {equipos.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
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
