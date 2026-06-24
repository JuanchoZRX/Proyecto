import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    carrerasApi,
    circuitosApi,
    conductoresApi,
    equiposApi,
    resultadosApi,
} from "../api/api";
import Layout from "../components/Layout";
import "./Dashboard.css";

export default function Dashboard() {
    const { user, isAdmin } = useAuth();

    const [stats, setStats] = useState(null);
    const [recentResults, setRecentResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const [carreras, setCarreras] = useState([]);
    const [conductores, setConductores] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const [
                    carrerasData,
                    circuitosData,
                    conductoresData,
                    equiposData,
                    resultadosData,
                ] = await Promise.all([
                    carrerasApi.getAll(),
                    circuitosApi.getAll(),
                    conductoresApi.getAll(),
                    equiposApi.getAll(),
                    resultadosApi.getAll(),
                ]);

                setCarreras(carrerasData);
                setConductores(conductoresData);

                setStats({
                    carreras: carrerasData.length,
                    circuitos: circuitosData.length,
                    conductores: conductoresData.length,
                    equipos: equiposData.length,
                });

                setRecentResults(resultadosData.slice(0, 5));
            } catch (e) {
                console.error("Error cargando dashboard:", e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <Layout>
            <div className="dashboard-video-wrapper">
                <video
                    className="dashboard-video"
                    src="/F1video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <div className="dashboard-video-overlay" />
            </div>

            <div className="dashboard-content">
                <div className="dashboard-hero">
                    <div className="dashboard-hero-label">
                        Bienvenido, {user?.username}
                    </div>

                    <h1 className="dashboard-hero-title">
                        <span className="dashboard-hero-accent">F1</span> Stats
                    </h1>

                    <p className="dashboard-hero-sub">
                        {isAdmin()
                            ? "Panel de Administración — Control total del sistema"
                            : "Panel de consulta — Visualización de datos F1"}
                    </p>
                </div>

                {loading ? (
                    <p style={{ color: "var(--text-muted)" }}>
                        Cargando estadísticas...
                    </p>
                ) : (
                    <>
                        <div className="stat-grid">
                            <StatCard
                                label="Carreras"
                                value={stats?.carreras}
                                color="#e10600"
                            />

                            <StatCard
                                label="Circuitos"
                                value={stats?.circuitos}
                                color="#3b82f6"
                            />

                            <StatCard
                                label="Conductores"
                                value={stats?.conductores}
                                color="#22c55e"
                            />

                            <StatCard
                                label="Equipos"
                                value={stats?.equipos}
                                color="#f59e0b"
                            />
                        </div>

                        <div className="dashboard-section">
                            <h2 className="dashboard-section-title">
                                Últimos Resultados
                            </h2>

                            {recentResults.length === 0 ? (
                                <div className="empty-state">
                                    Sin resultados registrados aún.
                                </div>
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
                                                <td style={{ color: "var(--text-muted)" }}>
                                                    #{r.id}
                                                </td>

                                                <td>
                                                    {carreras.find(
                                                        (c) => Number(c.id) === Number(r.carreraId)
                                                    )?.nombre || "Sin carrera"}
                                                </td>

                                                <td>
                                                    {conductores.find(
                                                        (c) => Number(c.id) === Number(r.conductorId)
                                                    )?.nombre || "Sin conductor"}
                                                </td>

                                                <td>
                            <span
                                className={`pos-badge pos-${r.posicion}`}
                            >
                              P{r.posicion}
                            </span>
                                                </td>

                                                <td>
                                                    <strong>{r.puntos}</strong> pts
                                                </td>

                                                <td style={{ color: "var(--text-secondary)" }}>
                                                    {r.tiempo || "—"}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <div className="stat-card card">
            <div className="stat-card-icon" style={{ color }}>
                {icon}
            </div>

            <div className="stat-card-value">
                {value ?? "—"}
            </div>

            <div className="stat-card-label">
                {label}
            </div>

            <div
                className="stat-card-bar"
                style={{ background: color }}
            />
        </div>
    );
}