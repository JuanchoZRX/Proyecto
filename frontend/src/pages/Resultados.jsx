import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { resultadosApi, carrerasApi, conductoresApi, autosApi } from "../api/api";

const EMPTY = { carreraId: "", conductorId: "", autoId: "", posicion: "", puntos: "", tiempo: "" };

export default function Resultados() {
  const { isAdmin } = useAuth();
  const [items, setItems]         = useState([]);
  const [carreras, setCarreras]   = useState([]);
  const [conductores, setConductores] = useState([]);
  const [autos, setAutos]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [modal, setModal]         = useState(null);
  const [selected, setSelected]   = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState("");

  const load = async () => {
    try {
      const [r, c, co, a] = await Promise.all([
        resultadosApi.getAll(),
        carrerasApi.getAll(),
        conductoresApi.getAll(),
        autosApi.getAll(),
      ]);
      setItems(Array.isArray(r) ? r : [...r]);
      setCarreras(Array.isArray(c) ? c : [...c]);
      setConductores(Array.isArray(co) ? co : [...co]);
      setAutos(Array.isArray(a) ? a : [...a]);
    } catch { setError("Error al cargar resultados."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(EMPTY); setSelected(null); setModal("create"); };
  const openEdit = (r) => {
    setForm({
      carreraId:   r.carreraId,
      conductorId: r.conductorId,
      autoId:      r.autoId,
      posicion:    r.posicion,
      puntos:      r.puntos,
      tiempo:      r.tiempo ?? "",
    });
    setSelected(r);
    setModal("edit");
  };
  const closeModal = () => { setModal(null); setError(""); };
  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        carreraId:   Number(form.carreraId),
        conductorId: Number(form.conductorId),
        autoId:      Number(form.autoId),
        posicion:    Number(form.posicion),
        puntos:      Number(form.puntos),
      };
      if (modal === "create") await resultadosApi.create(payload);
      else await resultadosApi.update(selected.id, payload);
      closeModal();
      await load();
    } catch (err) {
      setError(err.message || "Error al guardar.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este resultado?")) return;
    try { await resultadosApi.delete(id); await load(); }
    catch (err) { alert(err.message || "Error al eliminar."); }
  };

  // Helpers para mostrar nombres en lugar de IDs
  const carreraNombre   = (id) => carreras.find((c) => c.id === id)?.nombre    || `#${id}`;
  const conductorNombre = (id) => conductores.find((c) => c.id === id)?.nombre || `#${id}`;
  const autoModelo      = (id) => autos.find((a) => a.id === id)?.modelo       || `#${id}`;

  // Badge de posición con color
  const posBadge = (pos) => {
    const color = pos === 1 ? "#E8C84A" : pos === 2 ? "#A8A8A8" : pos === 3 ? "#CD7F32" : "var(--text-muted)";
    return <span style={{ fontWeight: 600, color }}>P{pos}</span>;
  };

  const filtered = items.filter((r) =>
      carreraNombre(r.carreraId).toLowerCase().includes(search.toLowerCase()) ||
      conductorNombre(r.conductorId).toLowerCase().includes(search.toLowerCase()) ||
      autoModelo(r.autoId).toLowerCase().includes(search.toLowerCase())
  );

  return (
      <Layout>
        <div className="page-header">
          <div>
            <h1 className="page-title">🏆 Resultados</h1>
            <p className="page-subtitle">
              {filtered.length} de {items.length} resultado{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <input
              className="search-input"
              placeholder="Buscar carrera, conductor o auto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />
          {isAdmin() && (
              <button className="btn btn-primary" onClick={openCreate}>+ Nuevo Resultado</button>
          )}
        </div>

        {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Cargando...</p>
        ) : filtered.length === 0 ? (
            <div className="empty-state">
              {items.length === 0 ? "Sin resultados registrados." : `Sin resultados para "${search}".`}
            </div>
        ) : (
            <div className="table-wrap">
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Carrera</th>
                  <th>Conductor</th>
                  <th>Auto</th>
                  <th>Posición</th>
                  <th>Puntos</th>
                  <th>Tiempo</th>
                  {isAdmin() && <th>Acciones</th>}
                </tr>
                </thead>
                <tbody>
                {filtered.map((r) => (
                    <tr key={r.id}>
                      <td style={{ color: "var(--text-muted)" }}>#{r.id}</td>
                      <td>{carreraNombre(r.carreraId)}</td>
                      <td><strong>{conductorNombre(r.conductorId)}</strong></td>
                      <td>{autoModelo(r.autoId)}</td>
                      <td>{posBadge(r.posicion)}</td>
                      <td>{r.puntos} pts</td>
                      <td style={{ color: "var(--text-muted)" }}>{r.tiempo ?? "—"}</td>
                      {isAdmin() && (
                          <td>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}>Editar</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Eliminar</button>
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
            <Modal title={modal === "create" ? "Nuevo Resultado" : "Editar Resultado"} onClose={closeModal}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="form-group">
                  <label>Carrera</label>
                  <select name="carreraId" value={form.carreraId} onChange={handleChange} required>
                    <option value="">— Seleccionar —</option>
                    {carreras.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Conductor</label>
                  <select name="conductorId" value={form.conductorId} onChange={handleChange} required>
                    <option value="">— Seleccionar —</option>
                    {conductores.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Auto</label>
                  <select name="autoId" value={form.autoId} onChange={handleChange} required>
                    <option value="">— Seleccionar —</option>
                    {autos.map((a) => (
                        <option key={a.id} value={a.id}>{a.modelo}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Posición</label>
                    <input name="posicion" type="number" min="1" value={form.posicion} onChange={handleChange} required placeholder="1" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Puntos</label>
                    <input name="puntos" type="number" min="0" value={form.puntos} onChange={handleChange} required placeholder="25" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Tiempo <span style={{ color: "var(--text-muted)", fontSize: 12 }}>(opcional)</span></label>
                  <input name="tiempo" value={form.tiempo} onChange={handleChange} placeholder="1:14:40.226" />
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