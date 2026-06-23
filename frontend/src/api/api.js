const BASE_URL = "http://localhost:8080";

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: getHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Error ${res.status}`);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  login: (creds) => request("POST", "/auth/login", creds),
  register: (user) => request("POST", "/auth/register", user),
};

// ── Equipos ───────────────────────────────────────────
export const equiposApi = {
  getAll: () => request("GET", "/equipos"),
  getById: (id) => request("GET", `/equipos/${id}`),
  create: (data) => request("POST", "/equipos", data),
  update: (id, data) => request("PUT", `/equipos/${id}`, data),
  delete: (id) => request("DELETE", `/equipos/${id}`),
};

// ── Conductores ───────────────────────────────────────
export const conductoresApi = {
  getAll: () => request("GET", "/conductores"),
  getByEquipo: (id) => request("GET", `/conductores/equipo/${id}`),
  create: (data) => request("POST", "/conductores", data),
  update: (id, data) => request("PUT", `/conductores/${id}`, data),
  delete: (id) => request("DELETE", `/conductores/${id}`),
};

// ── Autos ─────────────────────────────────────────────
export const autosApi = {
  getAll: () => request("GET", "/autos"),
  getByEquipo: (id) => request("GET", `/autos/equipo/${id}`),
  create: (data) => request("POST", "/autos", data),
  update: (id, data) => request("PUT", `/autos/${id}`, data),
  delete: (id) => request("DELETE", `/autos/${id}`),
};

// ── Circuitos ─────────────────────────────────────────
export const circuitosApi = {
  getAll: () => request("GET", "/circuitos"),
  getById: (id) => request("GET", `/circuitos/${id}`),
  create: (data) => request("POST", "/circuitos", data),
  update: (id, data) => request("PUT", `/circuitos/${id}`, data),
  delete: (id) => request("DELETE", `/circuitos/${id}`),
};

// ── Carreras ──────────────────────────────────────────
export const carrerasApi = {
  getAll: () => request("GET", "/carreras"),
  getById: (id) => request("GET", `/carreras/${id}`),
  getByCircuito: (id) => request("GET", `/carreras/circuito/${id}`),
  create: (data) => request("POST", "/carreras", data),
  update: (id, data) => request("PUT", `/carreras/${id}`, data),
  delete: (id) => request("DELETE", `/carreras/${id}`),
};

// ── Resultados ────────────────────────────────────────
export const resultadosApi = {
  getAll: () => request("GET", "/resultados"),
  getByCarrera: (id) => request("GET", `/resultados/carrera/${id}`),
  create: (data) => request("POST", "/resultados", data),
  update: (id, data) => request("PUT", `/resultados/${id}`, data),
  delete: (id) => request("DELETE", `/resultados/${id}`),
};
