-- ============================================================
-- F1 STATS - Schema completo
-- ============================================================

-- Equipos
CREATE TABLE IF NOT EXISTS equipo (
                                      id     SERIAL PRIMARY KEY,
                                      nombre VARCHAR(100) UNIQUE NOT NULL
    );

-- Autos (pertenecen a un equipo)
CREATE TABLE IF NOT EXISTS auto (
                                    id        SERIAL PRIMARY KEY,
                                    modelo    VARCHAR(100) NOT NULL,
    equipo_id INT NOT NULL REFERENCES equipo(id)
    );

-- Conductores (pertenecen a un equipo)
CREATE TABLE IF NOT EXISTS conductor (
                                         id        SERIAL PRIMARY KEY,
                                         nombre    VARCHAR(100) NOT NULL,
    equipo_id INT NOT NULL REFERENCES equipo(id)
    );

-- Circuitos
CREATE TABLE IF NOT EXISTS circuito (
                                        id       SERIAL PRIMARY KEY,
                                        nombre   VARCHAR(100) UNIQUE NOT NULL,
    pais     VARCHAR(100) NOT NULL,
    longitud DOUBLE PRECISION NOT NULL
    );

-- Carreras (se corren en un circuito)
CREATE TABLE IF NOT EXISTS carrera (
                                       id          SERIAL PRIMARY KEY,
                                       nombre      VARCHAR(100) UNIQUE NOT NULL,
    fecha       DATE NOT NULL,
    circuito_id INT NOT NULL REFERENCES circuito(id)
    );

-- Resultados de carrera
CREATE TABLE IF NOT EXISTS resultado_carrera (
                                                 id           SERIAL PRIMARY KEY,
                                                 carrera_id   INT NOT NULL REFERENCES carrera(id),
    conductor_id INT NOT NULL REFERENCES conductor(id),
    posicion     INT NOT NULL CHECK (posicion > 0),
    puntos       INT NOT NULL CHECK (puntos >= 0),
    tiempo       VARCHAR(20)
    );

-- Usuarios del sistema
CREATE TABLE IF NOT EXISTS usuario (
                                       id       SERIAL PRIMARY KEY,
                                       username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,   -- BCrypt hash
    role     VARCHAR(20)  NOT NULL    -- 'ADMIN' o 'USER'
    );

-- ============================================================
-- DATOS DE PRUEBA
-- ============================================================

-- Usuarios
-- Passwords hasheadas con BCrypt (costo 10):
--   admin123  →  $2b$10$zPs5r4jJfcV6aA1oC7o/0.QbXHiULTJCUXeGbep/hbJBaOoQlgULS
--   user123   →  $2b$10$Lx8qznnkrxvxswA2l5ZXvejgrnvRdqQA.iPn1PTl4tnbsazSkufpG
INSERT INTO usuario (username, password, role)
VALUES
    ('admin', '$2b$10$zPs5r4jJfcV6aA1oC7o/0.QbXHiULTJCUXeGbep/hbJBaOoQlgULS', 'ADMIN'),
    ('user',  '$2b$10$Lx8qznnkrxvxswA2l5ZXvejgrnvRdqQA.iPn1PTl4tnbsazSkufpG', 'USER')
    ON CONFLICT (username) DO NOTHING;

-- Equipos
INSERT INTO equipo (nombre) VALUES
                                ('Red Bull Racing'),
                                ('Mercedes AMG'),
                                ('Scuderia Ferrari')
    ON CONFLICT (nombre) DO NOTHING;

-- Conductores
INSERT INTO conductor (nombre, equipo_id) VALUES
                                              ('Max Verstappen',   1),
                                              ('Sergio Pérez',     1),
                                              ('Lewis Hamilton',   2),
                                              ('George Russell',   2),
                                              ('Charles Leclerc',  3),
                                              ('Carlos Sainz',     3)
    ON CONFLICT DO NOTHING;

-- Autos
INSERT INTO auto (modelo, equipo_id) VALUES
                                         ('RB20', 1),
                                         ('W15',  2),
                                         ('SF-24',3)
    ON CONFLICT DO NOTHING;

-- Circuitos
INSERT INTO circuito (nombre, pais, longitud) VALUES
                                                  ('Autodromo Nazionale Monza',  'Italia',    5.793),
                                                  ('Circuit de Monaco',          'Mónaco',    3.337),
                                                  ('Silverstone Circuit',        'Reino Unido', 5.891)
    ON CONFLICT (nombre) DO NOTHING;

-- Carreras
INSERT INTO carrera (nombre, fecha, circuito_id) VALUES
                                                     ('Gran Premio de Italia 2024',   '2024-09-01', 1),
                                                     ('Gran Premio de Mónaco 2024',   '2024-05-26', 2),
                                                     ('Gran Premio de Gran Bretaña 2024', '2024-07-07', 3)
    ON CONFLICT (nombre) DO NOTHING;

-- Resultados (carrera 1 - Monza)
INSERT INTO resultado_carrera (carrera_id, conductor_id, posicion, puntos, tiempo) VALUES
                                                                                       (1, 3, 1, 25, '1:14:40.226'),  -- Hamilton 1°
                                                                                       (1, 5, 2, 18, '+2.664s'),      -- Leclerc 2°
                                                                                       (1, 4, 3, 15, '+6.153s')       -- Russell 3°
    ON CONFLICT DO NOTHING;

-- Resultados (carrera 2 - Mónaco)
INSERT INTO resultado_carrera (carrera_id, conductor_id, posicion, puntos, tiempo) VALUES
                                                                                       (2, 5, 1, 25, '1:45:46.712'),  -- Leclerc 1°
                                                                                       (2, 6, 2, 18, '+7.152s'),      -- Sainz 2°
                                                                                       (2, 1, 3, 15, '+8.135s')       -- Verstappen 3°
    ON CONFLICT DO NOTHING;