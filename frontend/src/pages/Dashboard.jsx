import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { carrerasApi, circuitosApi, conductoresApi, equiposApi, resultadosApi } from "../api/api";
import Layout from "../components/Layout";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [carreras, circuitos, conductores, equipos, resultados] = await Promise.all([
          carrerasApi.getAll(),
          circuitosApi.getAll(),
          conductoresApi.getAll(),
          equiposApi.getAll(),
          resultadosApi.getAll(),
        ]);
        setStats({
          carreras: carreras.length,
          circuitos: circuitos.length,
          conductores: Array.isArray(conductores) ? conductores.length : [...conductores].length,
          equipos: Array.isArray(equipos) ? equipos.length : [...equipos].length,
        });
        setRecentResults(resultados.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-label">Bienvenido, {user?.username}</div>
        <h1 className="dashboard-hero-title">
          <span className="dashboard-hero-accent">F1</span> Stats
        </h1>
        <p className="dashboard-hero-sub">
          {isAdmin() ? "Panel de Administración — Control total del sistema" : "Panel de consulta — Visualización de datos F1"}
        </p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Cargando estadísticas...</p>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Carreras" value={stats?.carreras} icon="🏁" color="#e10600" />
            <StatCard label="Circuitos" value={stats?.circuitos} icon="🗺️" color="#3b82f6" />
            <StatCard label="Conductores" value={stats?.conductores} icon="🧑‍✈️" color="#22c55e" />
            <StatCard label="Equipos" value={stats?.equipos} icon="🔧" color="#f59e0b" />
          </div>

          {/* Recent results */}
          <div className="dashboard-section">
            <h2 className="dashboard-section-title">Últimos Resultados</h2>
            {recentResults.length === 0 ? (
              <div className="empty-state">Sin resultados registrados aún.</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID Resultado</th>
                      <th>Carrera</th>
                      <th>Conductor</th>
                      <th>Posición</th>
                      <th>Puntos</th>
                      <th>Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentResults.map((r) => (
                      <tr key={r.id}>
                        <td style={{ color: "var(--text-muted)" }}>#{r.id}</td>
                        <td>Carrera {r.carreraId}</td>
                        <td>Conductor {r.conductorId}</td>
                        <td>
                          <span className={`pos-badge pos-${r.posicion}`}>
                            P{r.posicion}
                          </span>
                        </td>
                        <td><strong>{r.puntos}</strong> pts</td>
                        <td style={{ color: "var(--text-secondary)" }}>{r.tiempo || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card card">
      <div className="stat-card-icon" style={{ color }}>{icon}</div>
      <div className="stat-card-value">{value ?? "—"}</div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-bar" style={{ background: color }} />
    </div>
  );
}
