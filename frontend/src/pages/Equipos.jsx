import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { equiposApi } from "../api/api";
const EMPTY = { nombre: "" };

export default function Equipos() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await equiposApi.getAll();
      setItems(Array.isArray(data) ? data : [...data]);
    } catch { setError("Error al cargar equipos."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setSelected(null); setModal("create"); };
  const openEdit = (e) => { setForm({ nombre: e.nombre }); setSelected(e); setModal("edit"); };
  const closeModal = () => { setModal(null); setError(""); };
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (modal === "create") await equiposApi.create(form);
      else await equiposApi.update(selected.id, form);
      closeModal();
      await load();
    } catch (err) {
      setError(err.message || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este equipo?")) return;
    try { await equiposApi.delete(id); await load(); }
    catch (err) { alert(err.message || "Error al eliminar."); }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">🔧 Equipos</h1>
          <p className="page-subtitle">{items.length} equipo{items.length !== 1 ? "s" : ""} registrado{items.length !== 1 ? "s" : ""}</p>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Equipo</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Cargando...</p>
      ) : items.length === 0 ? (
        <div className="empty-state">Sin equipos registrados.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                {isAdmin() && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id}>
                  <td style={{ color: "var(--text-muted)" }}>#{e.id}</td>
                  <td><strong>{e.nombre}</strong></td>
                  {isAdmin() && (
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(e)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)}>Eliminar</button>
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
        <Modal title={modal === "create" ? "Nuevo Equipo" : "Editar Equipo"} onClose={closeModal}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label>Nombre del Equipo</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Red Bull Racing" />
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
