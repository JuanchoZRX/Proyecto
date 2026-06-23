import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { carrerasApi, circuitosApi } from "../api/api";

const EMPTY = { nombre: "", fecha: "", circuitoId: "" };

export default function Carreras() {
  const { isAdmin } = useAuth();
  const [carreras, setCarreras] = useState([]);
  const [circuitos, setCircuitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [c, ci] = await Promise.all([carrerasApi.getAll(), circuitosApi.getAll()]);
      setCarreras(c);
      setCircuitos(ci);
    } catch { setError("Error al cargar los datos."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setSelected(null); setModal("create"); };
  const openEdit = (c) => { setForm({ nombre: c.nombre, fecha: c.fecha, circuitoId: c.circuitoId }); setSelected(c); setModal("edit"); };
  const closeModal = () => { setModal(null); setError(""); };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, circuitoId: Number(form.circuitoId) };
      if (modal === "create") await carrerasApi.create(payload);
      else await carrerasApi.update(selected.id, payload);
      closeModal();
      await load();
    } catch (err) {
      setError(err.message || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta carrera?")) return;
    try { await carrerasApi.delete(id); await load(); }
    catch (err) { alert(err.message || "Error al eliminar."); }
  };

  const circuitoNombre = (id) => circuitos.find((c) => c.id === id)?.nombre || `#${id}`;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title"> Carreras</h1>
          <p className="page-subtitle">{carreras.length} carrera{carreras.length !== 1 ? "s" : ""} registrada{carreras.length !== 1 ? "s" : ""}</p>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={openCreate}>+ Nueva Carrera</button>
        )}
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Cargando...</p>
      ) : carreras.length === 0 ? (
        <div className="empty-state">Sin carreras registradas.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Circuito</th>
                {isAdmin() && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {carreras.map((c) => (
                <tr key={c.id}>
                  <td style={{ color: "var(--text-muted)" }}>#{c.id}</td>
                  <td><strong>{c.nombre}</strong></td>
                  <td>{c.fecha}</td>
                  <td>{circuitoNombre(c.circuitoId)}</td>
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
        <Modal title={modal === "create" ? "Nueva Carrera" : "Editar Carrera"} onClose={closeModal}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Gran Premio de..." />
            </div>
            <div className="form-group">
              <label>Fecha</label>
              <input name="fecha" type="date" value={form.fecha} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Circuito</label>
              <select name="circuitoId" value={form.circuitoId} onChange={handleChange} required>
                <option value="">— Seleccionar —</option>
                {circuitos.map((ci) => (
                  <option key={ci.id} value={ci.id}>{ci.nombre}</option>
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
