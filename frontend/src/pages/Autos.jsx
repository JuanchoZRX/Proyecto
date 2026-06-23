import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { autosApi, equiposApi } from "../api/api";

const EMPTY = { modelo: "", equipoId: "" };

export default function Autos() {
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
      const [a, e] = await Promise.all([autosApi.getAll(), equiposApi.getAll()]);
      setItems(Array.isArray(a) ? a : [...a]);
      setEquipos(Array.isArray(e) ? e : [...e]);
    } catch { setError("Error al cargar autos."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setSelected(null); setModal("create"); };
  const openEdit = (a) => { setForm({ modelo: a.modelo, equipoId: a.equipoId }); setSelected(a); setModal("edit"); };
  const closeModal = () => { setModal(null); setError(""); };
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, equipoId: Number(form.equipoId) };
      if (modal === "create") await autosApi.create(payload);
      else await autosApi.update(selected.id, payload);
      closeModal();
      await load();
    } catch (err) {
      setError(err.message || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este auto?")) return;
    try { await autosApi.delete(id); await load(); }
    catch (err) { alert(err.message || "Error al eliminar."); }
  };

  const equipoNombre = (id) => equipos.find((e) => e.id === id)?.nombre || `#${id}`;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">🚗 Autos</h1>
          <p className="page-subtitle">{items.length} auto{items.length !== 1 ? "s" : ""} registrado{items.length !== 1 ? "s" : ""}</p>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Auto</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Cargando...</p>
      ) : items.length === 0 ? (
        <div className="empty-state">Sin autos registrados.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Equipo</th>
                {isAdmin() && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: "var(--text-muted)" }}>#{a.id}</td>
                  <td><strong>{a.modelo}</strong></td>
                  <td>{equipoNombre(a.equipoId)}</td>
                  {isAdmin() && (
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Eliminar</button>
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
        <Modal title={modal === "create" ? "Nuevo Auto" : "Editar Auto"} onClose={closeModal}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label>Modelo</label>
              <input name="modelo" value={form.modelo} onChange={handleChange} required placeholder="RB20" />
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
